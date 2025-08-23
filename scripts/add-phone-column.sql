-- Add phone column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add an index on phone for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);

-- Update RLS policies to include phone column
-- (Existing policies should still work, but we can add phone-specific ones if needed)