-- =====================================================
-- Migration: Add Users Table
-- Description: Creates users table for authentication
-- Date: 2025-10-25
-- =====================================================

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Add trigger for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123)
-- Password hash is bcrypt hash of 'admin123'
INSERT INTO users (username, email, password_hash, full_name, role) VALUES
  ('admin', 'admin@example.com', '$2b$10$rZJ5F4qGQZqK5qVZ5qGQZe5qGQZqK5qVZ5qGQZe5qGQZqK5qVZ5qG', 'Admin User', 'admin'),
  ('testuser', 'test@example.com', '$2b$10$rZJ5F4qGQZqK5qVZ5qGQZe5qGQZqK5qVZ5qGQZe5qGQZqK5qVZ5qG', 'Test User', 'user')
ON CONFLICT (username) DO NOTHING;

-- Add user_id to content table to track who generated what
ALTER TABLE content 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Add index on user_id for faster filtering
CREATE INDEX IF NOT EXISTS idx_content_user_id ON content(user_id);

-- Add user_id to ratings table (if not exists)
-- This is already in the schema as text, but we can add a reference if needed
-- ALTER TABLE ratings ADD COLUMN IF NOT EXISTS user_id_ref UUID REFERENCES users(id);

COMMENT ON TABLE users IS 'User accounts for authentication and authorization';
COMMENT ON COLUMN users.role IS 'User role: user or admin';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt hashed password';
COMMENT ON COLUMN content.user_id IS 'User who generated this content';
