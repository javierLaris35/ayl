-- Create confirmations table
CREATE TABLE IF NOT EXISTS confirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  email TEXT,
  telefono TEXT NOT NULL,
  asistentes INTEGER NOT NULL DEFAULT 1,
  mensaje TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin users table for authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_confirmations_created_at ON confirmations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Enable Row Level Security
ALTER TABLE confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policies for confirmations (anyone can insert, only admins can read/update/delete)
CREATE POLICY "Anyone can create confirmations" ON confirmations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can read confirmations" ON confirmations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

-- Policies for admin_users (only admins can read their own data)
CREATE POLICY "Admins can read own data" ON admin_users
  FOR SELECT USING (
    email = current_setting('request.jwt.claims', true)::json->>'email'
  );
