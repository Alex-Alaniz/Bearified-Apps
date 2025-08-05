-- Multi-tenant database schema for multi-app admin platform

-- Organizations table (for multi-tenancy)
CREATE TABLE IF NOT EXISTS organizations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'app', 'franchise'
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Apps table
CREATE TABLE IF NOT EXISTS apps (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  description TEXT,
  config JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(organization_id, slug)
);

-- Enhanced users table with multi-app support
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User app memberships (many-to-many)
CREATE TABLE IF NOT EXISTS user_app_memberships (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  app_id INTEGER REFERENCES apps(id),
  role VARCHAR(50) DEFAULT 'member',
  permissions JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, app_id)
);

-- Enhanced projects table with app association
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  app_id INTEGER REFERENCES apps(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'todo',
  priority VARCHAR(20) DEFAULT 'medium',
  assigned_to INTEGER REFERENCES users(id),
  due_date DATE,
  labels JSONB DEFAULT '[]',
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced expenses table with app association
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  app_id INTEGER REFERENCES apps(id),
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  submitted_by INTEGER REFERENCES users(id),
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by INTEGER REFERENCES users(id),
  receipt_url VARCHAR(500)
);

-- Enhanced inventory table with app association
CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  app_id INTEGER REFERENCES apps(id),
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  quantity INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  price DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'in-stock',
  location_id INTEGER, -- For franchise locations
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(app_id, sku)
);

-- Franchise locations table
CREATE TABLE IF NOT EXISTS franchise_locations (
  id SERIAL PRIMARY KEY,
  app_id INTEGER REFERENCES apps(id),
  name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(255) NOT NULL,
  owner_email VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  phone VARCHAR(20),
  status VARCHAR(50) DEFAULT 'pending',
  monthly_revenue DECIMAL(10,2) DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Franchise applications table
CREATE TABLE IF NOT EXISTS franchise_applications (
  id SERIAL PRIMARY KEY,
  app_id INTEGER REFERENCES apps(id),
  applicant_name VARCHAR(255) NOT NULL,
  applicant_email VARCHAR(255) NOT NULL,
  proposed_location VARCHAR(255) NOT NULL,
  investment_amount DECIMAL(10,2) NOT NULL,
  experience TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP,
  reviewed_by INTEGER REFERENCES users(id),
  notes TEXT
);

-- Enhanced activity logs with app context
CREATE TABLE IF NOT EXISTS activity_logs (
  id SERIAL PRIMARY KEY,
  app_id INTEGER REFERENCES apps(id),
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id INTEGER,
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample organizations
INSERT INTO organizations (name, slug, type, settings) VALUES
('SoleBrew Company', 'solebrew', 'app', '{"features": ["inventory", "coffee-shop", "franchise"]}'),
('Chimpanion Labs', 'chimpanion', 'app', '{"features": ["ai-training", "blockchain", "security"]}'),
('Franchise Network', 'franchise', 'franchise', '{"multi_location": true}');

-- Insert sample apps
INSERT INTO apps (organization_id, name, slug, description, config) VALUES
(1, 'SoleBrew', 'solebrew', 'Coffee shop & sneaker app', '{"type": "mobile_app", "platform": "ios"}'),
(2, 'Chimpanion', 'chimpanion', 'AI blockchain companion', '{"type": "mobile_app", "platform": "ios", "blockchain": true}');

-- Insert sample users
INSERT INTO users (email, name) VALUES
('admin@company.com', 'Admin User'),
('sarah@solebrew.com', 'Sarah Johnson'),
('mike@chimpanion.com', 'Mike Chen'),
('emma@solebrew.com', 'Emma Davis'),
('alex@company.com', 'Alex Rodriguez');

-- Insert user app memberships
INSERT INTO user_app_memberships (user_id, app_id, role, permissions) VALUES
(1, 1, 'admin', '["all"]'),
(1, 2, 'admin', '["all"]'),
(2, 1, 'developer', '["projects", "expenses"]'),
(3, 2, 'developer', '["projects", "ai-training"]'),
(4, 1, 'manager', '["inventory", "expenses", "franchise"]'),
(5, 1, 'developer', '["projects"]'),
(5, 2, 'developer', '["projects", "blockchain"]');

-- Insert sample franchise locations
INSERT INTO franchise_locations (app_id, name, owner_name, owner_email, address, city, state, zip_code, status, monthly_revenue, rating) VALUES
(1, 'SoleBrew Downtown LA', 'Maria Rodriguez', 'maria@solebrew-la.com', '123 Main St', 'Los Angeles', 'CA', '90210', 'active', 28500.00, 4.8),
(1, 'SoleBrew Brooklyn Heights', 'James Wilson', 'james@solebrew-bk.com', '456 Brooklyn Ave', 'Brooklyn', 'NY', '11201', 'active', 31200.00, 4.9),
(1, 'SoleBrew Miami Beach', 'Sofia Martinez', 'sofia@solebrew-miami.com', '789 Ocean Dr', 'Miami', 'FL', '33139', 'pending', 0.00, 0.0);

-- Insert sample franchise applications
INSERT INTO franchise_applications (app_id, applicant_name, applicant_email, proposed_location, investment_amount, experience, status) VALUES
(1, 'David Chen', 'david.chen@email.com', 'Austin, TX', 150000.00, '5 years F&B experience', 'review'),
(1, 'Lisa Thompson', 'lisa.thompson@email.com', 'Seattle, WA', 175000.00, '8 years retail management', 'interview'),
(1, 'Michael Brown', 'michael.brown@email.com', 'Chicago, IL', 160000.00, '3 years coffee shop owner', 'pending');
