-- Create apps table for Bearified Apps platform
CREATE TABLE IF NOT EXISTS apps (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(100),
  color VARCHAR(100),
  status VARCHAR(50) DEFAULT 'development',
  features JSONB DEFAULT '[]',
  required_roles JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert the actual apps that exist in the platform
INSERT INTO apps (name, description, slug, icon, color, status, features, required_roles, is_active) VALUES
('SoleBrew', 'Coffee & Sneaker Marketplace powered by Solana SPL tokens', 'solebrew', 'Coffee', 'from-amber-500 to-orange-600', 'development', '["Coffee Ordering", "Sneaker Marketplace", "Solana Integration", "$SOLE Token", "NFT Receipts"]', '["super_admin", "admin", "solebrew-admin", "solebrew-member"]', true),
('Chimpanion', 'Blockchain AI companion app for managing crypto wallets through natural language', 'chimpanion', 'Bot', 'from-purple-500 to-pink-600', 'production', '["AI Wallet Management", "Natural Language Interface", "Multi-Chain Support", "Portfolio Analytics"]', '["super_admin", "admin", "chimpanion-admin", "chimpanion-member"]', true);

-- Note: Admin Panel is not included as it's part of the platform infrastructure, not a separate app