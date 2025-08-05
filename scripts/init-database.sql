-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'todo',
  priority VARCHAR(20) DEFAULT 'medium',
  assigned_to INTEGER REFERENCES users(id),
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  submitted_by INTEGER REFERENCES users(id),
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by INTEGER REFERENCES users(id)
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL,
  quantity INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  price DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'in-stock',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id INTEGER,
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (email, name, role) VALUES
('admin@solebrew.com', 'Admin User', 'admin'),
('sarah@solebrew.com', 'Sarah Johnson', 'developer'),
('mike@solebrew.com', 'Mike Chen', 'designer'),
('emma@solebrew.com', 'Emma Davis', 'manager'),
('alex@solebrew.com', 'Alex Rodriguez', 'developer');

-- Insert sample projects
INSERT INTO projects (title, description, status, priority, assigned_to, due_date) VALUES
('iOS App v2.1 Release', 'Deploy latest version with bug fixes and improvements', 'done', 'high', 2, '2024-01-10'),
('Coffee Shop Inventory System', 'Build real-time inventory tracking for coffee and supplies', 'in-progress', 'high', 4, '2024-01-18'),
('Sneaker Authentication Feature', 'Create UX wireframes for sneaker verification process', 'todo', 'medium', 3, '2024-01-20'),
('Loyalty Program Integration', 'Implement points system for app and coffee shop', 'in-progress', 'medium', 5, '2024-01-25');

-- Insert sample expenses
INSERT INTO expenses (description, amount, category, status, submitted_by) VALUES
('Coffee beans - Premium blend', 450.00, 'Coffee Shop', 'approved', 4),
('iOS Developer License Renewal', 99.00, 'App Development', 'approved', 2),
('Sneaker display cases', 1200.00, 'Coffee Shop', 'pending', 3),
('Cloud hosting - AWS', 289.50, 'App Development', 'approved', 5),
('Marketing materials printing', 175.00, 'Marketing', 'rejected', 4);

-- Insert sample inventory
INSERT INTO inventory (name, sku, category, quantity, min_stock, price, status) VALUES
('Air Jordan 1 Retro High OG', 'AJ1-001', 'Sneakers', 12, 5, 170.00, 'in-stock'),
('Premium Coffee Beans - Ethiopian', 'COF-ETH-001', 'Coffee', 25, 10, 18.99, 'in-stock'),
('Nike Dunk Low Panda', 'NK-DL-002', 'Sneakers', 3, 8, 110.00, 'low-stock'),
('Espresso Cups - Ceramic', 'SUP-CUP-001', 'Supplies', 0, 20, 12.50, 'out-of-stock'),
('Yeezy Boost 350 V2', 'YZ-350-003', 'Sneakers', 8, 5, 220.00, 'in-stock');
