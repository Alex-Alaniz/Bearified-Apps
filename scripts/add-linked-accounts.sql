-- Add linked_accounts column to users table for Privy integration
ALTER TABLE users ADD COLUMN IF NOT EXISTS linked_accounts JSONB DEFAULT '{}';

-- Add status column for user account status
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';

-- Update existing user record to include linked accounts structure
UPDATE users 
SET linked_accounts = '{"phone": null, "wallet": null}'::jsonb,
    status = 'active'
WHERE email = 'alex@alexalaniz.com' AND linked_accounts IS NULL;