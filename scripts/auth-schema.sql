-- Create users table for Privy + Supabase integration
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, -- Privy user ID
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar TEXT,
  roles TEXT[] DEFAULT ARRAY['user'], -- Array of role strings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_roles ON users USING GIN(roles);

-- Create roles table for role management
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name, description, permissions) VALUES
  ('admin', 'System Administrator', ARRAY['*']),
  ('solebrew-admin', 'SoleBrew Administrator', ARRAY['solebrew:*']),
  ('solebrew-member', 'SoleBrew Member', ARRAY['solebrew:read', 'solebrew:write']),
  ('chimpanion-admin', 'Chimpanion Administrator', ARRAY['chimpanion:*']),
  ('chimpanion-member', 'Chimpanion Member', ARRAY['chimpanion:read', 'chimpanion:write']),
  ('user', 'Basic User', ARRAY['profile:read', 'profile:write'])
ON CONFLICT (name) DO NOTHING;

-- Create user sessions table for tracking
CREATE TABLE IF NOT EXISTS user_sessions (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY users_select_own ON users
  FOR SELECT USING (auth.uid()::text = id);

-- Users can update their own data (except roles)
CREATE POLICY users_update_own ON users
  FOR UPDATE USING (auth.uid()::text = id)
  WITH CHECK (auth.uid()::text = id);

-- Only admins can manage all users
CREATE POLICY users_admin_all ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()::text 
      AND 'admin' = ANY(roles)
    )
  );

-- Audit logs - users can read their own, admins can read all
CREATE POLICY audit_logs_select ON audit_logs
  FOR SELECT USING (
    user_id = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()::text 
      AND 'admin' = ANY(roles)
    )
  );
