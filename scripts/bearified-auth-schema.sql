-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    roles TEXT[] NOT NULL DEFAULT ARRAY['user'],
    apps TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert super admin user (alex@alexalaniz.com)
INSERT INTO users (email, name, role, roles, apps, is_active)
VALUES (
    'alex@alexalaniz.com',
    'Alex Alaniz',
    'super_admin',
    ARRAY['super_admin', 'admin', 'user'],
    ARRAY['solebrew', 'chimpanion'],
    true
)
ON CONFLICT (email) DO UPDATE SET
    role = EXCLUDED.role,
    roles = EXCLUDED.roles,
    apps = EXCLUDED.apps,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Create audit log table for tracking changes
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- Create app_permissions table for fine-grained permissions
CREATE TABLE IF NOT EXISTS app_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    app_id VARCHAR(50) NOT NULL,
    permissions TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    granted_by UUID REFERENCES users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for app_permissions
CREATE INDEX IF NOT EXISTS idx_app_permissions_user_id ON app_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_app_permissions_app_id ON app_permissions(app_id);
CREATE INDEX IF NOT EXISTS idx_app_permissions_is_active ON app_permissions(is_active);

-- Create trigger for app_permissions updated_at
DROP TRIGGER IF EXISTS update_app_permissions_updated_at ON app_permissions;
CREATE TRIGGER update_app_permissions_updated_at
    BEFORE UPDATE ON app_permissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
