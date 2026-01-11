-- =====================================================
-- ADMIN ROLE SETUP FOR VASTU APPLICATION
-- =====================================================
-- This script sets up the profiles table with role support
-- and marks your initial admin user.
--
-- Run this in Supabase SQL Editor ONCE during initial setup.
-- =====================================================

-- Step 1: Create or update profiles table with role column
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add role column if it doesn't exist (for existing tables)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));
  END IF;
END $$;

-- Step 2: Create index for faster role lookups
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Step 3: Set up Row Level Security (RLS)
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow admins to read all profiles
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admins to update user profiles (not their own role)
DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
CREATE POLICY "Admins can update profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Step 4: MAKE YOUR FIRST ADMIN USER
-- =====================================================
-- ⚠️ IMPORTANT: Replace 'your-email@example.com' with your actual email
-- ⚠️ Run this AFTER you've created your first user account
-- =====================================================

-- Option A: If you haven't created your profile yet
-- INSERT INTO profiles (id, email, role, is_active)
-- SELECT id, email, 'admin', true
-- FROM auth.users
-- WHERE email = 'your-email@example.com';

-- Option B: If profile already exists, just update the role
UPDATE profiles
SET role = 'admin', is_active = true
WHERE email = 'your-email@example.com';

-- Verify admin setup
SELECT id, email, role, is_active, created_at
FROM profiles
WHERE role = 'admin';

-- =====================================================
-- NOTES:
-- =====================================================
-- 1. After running this script, log in with your admin account
-- 2. Use the Admin Panel to create new users
-- 3. All new users will have role = 'user' by default
-- 4. Only users with role = 'admin' can create new users
-- 5. To make another user admin, run:
--    UPDATE profiles SET role = 'admin' WHERE email = 'another-admin@example.com';
-- =====================================================
