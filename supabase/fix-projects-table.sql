-- =====================================================
-- FIX PROJECTS TABLE - Add Missing Column
-- =====================================================
-- Run this if you already created the projects table
-- without the client_name column
-- =====================================================

-- Add client_name column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'projects' 
    AND column_name = 'client_name'
  ) THEN
    ALTER TABLE projects ADD COLUMN client_name TEXT DEFAULT '';
  END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'projects'
ORDER BY ordinal_position;
