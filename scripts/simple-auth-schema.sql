-- Simple auth schema without RLS for initial setup
-- This avoids the "Tenant or user not found" error

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar TEXT,
  roles TEXT[] DEFAULT ARRAY['user'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_roles ON public.users USING GIN(roles);

-- Create roles reference table
CREATE TABLE IF NOT EXISTS public.app_roles (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default roles
INSERT INTO public.app_roles (name, description, permissions) VALUES
  ('admin', 'System Administrator', ARRAY['*']),
  ('solebrew-admin', 'SoleBrew Administrator', ARRAY['solebrew:*']),
  ('solebrew-member', 'SoleBrew Member', ARRAY['solebrew:read', 'solebrew:write']),
  ('chimpanion-admin', 'Chimpanion Administrator', ARRAY['chimpanion:*']),
  ('chimpanion-member', 'Chimpanion Member', ARRAY['chimpanion:read', 'chimpanion:write']),
  ('user', 'Basic User', ARRAY['profile:read', 'profile:write'])
ON CONFLICT (name) DO NOTHING;

-- Create audit log table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert a default admin user for testing
-- You can update this with your actual email
INSERT INTO public.users (id, email, name, roles) VALUES
  ('admin-user-1', 'admin@company.com', 'System Administrator', ARRAY['admin'])
ON CONFLICT (email) DO UPDATE SET
  roles = ARRAY['admin'],
  updated_at = NOW();

-- Grant permissions to authenticated users
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.app_roles TO authenticated;
GRANT ALL ON public.audit_logs TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant permissions to anon users for initial setup
GRANT SELECT, INSERT, UPDATE ON public.users TO anon;
GRANT SELECT ON public.app_roles TO anon;
GRANT INSERT ON public.audit_logs TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
