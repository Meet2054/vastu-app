-- ==========================================
-- VASTU APP ADMIN HELPER QUERIES
-- ==========================================
-- Use these queries in Supabase SQL Editor
-- ==========================================

-- ==========================================
-- 1. USER MANAGEMENT
-- ==========================================

-- View all users with their activation status
SELECT 
    p.id,
    p.email,
    p.is_active,
    p.created_at,
    d.device_fingerprint,
    d.activated_at as device_activated_at
FROM profiles p
LEFT JOIN devices d ON d.user_id = p.id
ORDER BY p.created_at DESC;

-- Count active vs inactive users
SELECT 
    is_active,
    COUNT(*) as user_count
FROM profiles
GROUP BY is_active;

-- Find specific user by email
SELECT 
    p.*,
    d.device_fingerprint,
    d.activated_at
FROM profiles p
LEFT JOIN devices d ON d.user_id = p.id
WHERE p.email = 'user@example.com';

-- ==========================================
-- 2. ACTIVATION KEY MANAGEMENT
-- ==========================================

-- Generate 1 activation key
INSERT INTO activation_keys (key)
VALUES (
    upper(
        substring(md5(random()::text) from 1 for 4) || '-' ||
        substring(md5(random()::text) from 1 for 4) || '-' ||
        substring(md5(random()::text) from 1 for 4) || '-' ||
        substring(md5(random()::text) from 1 for 4)
    )
)
RETURNING key, created_at;

-- Generate 10 activation keys at once
INSERT INTO activation_keys (key)
SELECT 
    upper(
        substring(md5(random()::text) from 1 for 4) || '-' ||
        substring(md5(random()::text) from 1 for 4) || '-' ||
        substring(md5(random()::text) from 1 for 4) || '-' ||
        substring(md5(random()::text) from 1 for 4)
    )
FROM generate_series(1, 10)
RETURNING key, created_at;

-- View all unused keys
SELECT 
    key,
    created_at
FROM activation_keys
WHERE is_used = false
ORDER BY created_at DESC;

-- View all used keys with user info
SELECT 
    ak.key,
    ak.used_at,
    ak.used_on_device,
    p.email as used_by_email
FROM activation_keys ak
LEFT JOIN profiles p ON p.id = ak.used_by
WHERE ak.is_used = true
ORDER BY ak.used_at DESC;

-- Check specific key status
SELECT 
    ak.key,
    ak.is_used,
    ak.used_at,
    ak.used_on_device,
    p.email as used_by_email,
    ak.created_at
FROM activation_keys ak
LEFT JOIN profiles p ON p.id = ak.used_by
WHERE ak.key = 'XXXX-XXXX-XXXX-XXXX'; -- Replace with actual key

-- Count keys by status
SELECT 
    is_used,
    COUNT(*) as key_count
FROM activation_keys
GROUP BY is_used;

-- ==========================================
-- 3. DEVICE MANAGEMENT
-- ==========================================

-- View all registered devices
SELECT 
    d.id,
    p.email,
    d.device_fingerprint,
    d.activated_at
FROM devices d
JOIN profiles p ON p.id = d.user_id
ORDER BY d.activated_at DESC;

-- Count devices per user (should be max 1)
SELECT 
    p.email,
    COUNT(d.id) as device_count
FROM profiles p
LEFT JOIN devices d ON d.user_id = p.id
GROUP BY p.email
HAVING COUNT(d.id) > 0
ORDER BY device_count DESC;

-- Find device by fingerprint
SELECT 
    d.*,
    p.email
FROM devices d
JOIN profiles p ON p.id = d.user_id
WHERE d.device_fingerprint = 'device-fingerprint-here';

-- ==========================================
-- 4. USER RESET (DEACTIVATION)
-- ==========================================

-- ⚠️ DANGER: Reset user - requires new activation key
-- Step 1: Deactivate user
UPDATE profiles
SET is_active = false
WHERE email = 'user@example.com'
RETURNING id, email, is_active;

-- Step 2: Remove device registration
DELETE FROM devices
WHERE user_id = (
    SELECT id FROM profiles WHERE email = 'user@example.com'
)
RETURNING *;

-- ⚠️ Combined reset (use carefully!)
BEGIN;
-- Deactivate user
UPDATE profiles
SET is_active = false
WHERE email = 'user@example.com';

-- Remove device
DELETE FROM devices
WHERE user_id = (SELECT id FROM profiles WHERE email = 'user@example.com');

-- Show result
SELECT 
    p.email,
    p.is_active,
    COUNT(d.id) as devices_count
FROM profiles p
LEFT JOIN devices d ON d.user_id = p.id
WHERE p.email = 'user@example.com'
GROUP BY p.email, p.is_active;
COMMIT;

-- ==========================================
-- 5. PROJECT MANAGEMENT
-- ==========================================

-- View all projects
SELECT 
    pr.id,
    p.email as owner,
    pr.name,
    pr.created_at,
    pr.updated_at
FROM projects pr
JOIN profiles p ON p.id = pr.user_id
ORDER BY pr.created_at DESC;

-- Count projects per user
SELECT 
    p.email,
    COUNT(pr.id) as project_count
FROM profiles p
LEFT JOIN projects pr ON pr.user_id = p.id
GROUP BY p.email
ORDER BY project_count DESC;

-- View specific user's projects
SELECT 
    pr.id,
    pr.name,
    pr.created_at,
    pr.updated_at
FROM projects pr
JOIN profiles p ON p.id = pr.user_id
WHERE p.email = 'user@example.com'
ORDER BY pr.created_at DESC;

-- Delete specific project (optional)
DELETE FROM projects
WHERE id = 'project-id-here'
RETURNING *;

-- ==========================================
-- 6. STATISTICS & REPORTS
-- ==========================================

-- Overall system statistics
SELECT 
    'Total Users' as metric,
    COUNT(*)::text as value
FROM profiles
UNION ALL
SELECT 
    'Active Users',
    COUNT(*)::text
FROM profiles
WHERE is_active = true
UNION ALL
SELECT 
    'Inactive Users',
    COUNT(*)::text
FROM profiles
WHERE is_active = false
UNION ALL
SELECT 
    'Total Devices',
    COUNT(*)::text
FROM devices
UNION ALL
SELECT 
    'Total Keys Generated',
    COUNT(*)::text
FROM activation_keys
UNION ALL
SELECT 
    'Used Keys',
    COUNT(*)::text
FROM activation_keys
WHERE is_used = true
UNION ALL
SELECT 
    'Unused Keys',
    COUNT(*)::text
FROM activation_keys
WHERE is_used = false
UNION ALL
SELECT 
    'Total Projects',
    COUNT(*)::text
FROM projects;

-- Users registered in last 7 days
SELECT 
    p.email,
    p.created_at,
    p.is_active
FROM profiles p
WHERE p.created_at > NOW() - INTERVAL '7 days'
ORDER BY p.created_at DESC;

-- Keys used in last 7 days
SELECT 
    ak.key,
    p.email as used_by,
    ak.used_at
FROM activation_keys ak
JOIN profiles p ON p.id = ak.used_by
WHERE ak.used_at > NOW() - INTERVAL '7 days'
ORDER BY ak.used_at DESC;

-- ==========================================
-- 7. CLEANUP OPERATIONS
-- ==========================================

-- Delete old unused keys (older than 90 days)
-- ⚠️ Use carefully!
DELETE FROM activation_keys
WHERE is_used = false 
AND created_at < NOW() - INTERVAL '90 days'
RETURNING key, created_at;

-- Delete inactive users with no devices (never activated)
-- ⚠️ Very dangerous! Backup first!
DELETE FROM profiles
WHERE is_active = false
AND id NOT IN (SELECT user_id FROM devices)
AND created_at < NOW() - INTERVAL '30 days'
RETURNING email, created_at;

-- ==========================================
-- 8. TROUBLESHOOTING
-- ==========================================

-- Find users with multiple devices (should be 0)
SELECT 
    p.email,
    COUNT(d.id) as device_count,
    array_agg(d.device_fingerprint) as fingerprints
FROM profiles p
JOIN devices d ON d.user_id = p.id
GROUP BY p.email
HAVING COUNT(d.id) > 1;

-- Find keys used multiple times (should be 0)
SELECT 
    key,
    is_used,
    used_by,
    used_at
FROM activation_keys
WHERE is_used = true
GROUP BY key, is_used, used_by, used_at
HAVING COUNT(*) > 1;

-- Find active users with no devices (corruption)
SELECT 
    p.email,
    p.is_active,
    COUNT(d.id) as device_count
FROM profiles p
LEFT JOIN devices d ON d.user_id = p.id
WHERE p.is_active = true
GROUP BY p.email, p.is_active
HAVING COUNT(d.id) = 0;

-- ==========================================
-- 9. EMERGENCY OPERATIONS
-- ==========================================

-- Force activate user (emergency only!)
UPDATE profiles
SET is_active = true
WHERE email = 'user@example.com'
RETURNING id, email, is_active;

-- Manually mark key as unused (emergency only!)
-- ⚠️ Only if key was used by mistake
UPDATE activation_keys
SET 
    is_used = false,
    used_by = NULL,
    used_on_device = NULL,
    used_at = NULL
WHERE key = 'XXXX-XXXX-XXXX-XXXX'
RETURNING *;

-- ==========================================
-- 10. AUDIT LOG
-- ==========================================

-- View user activity timeline
SELECT 
    p.email,
    'User Created' as event,
    p.created_at as event_time
FROM profiles p
WHERE p.email = 'user@example.com'

UNION ALL

SELECT 
    p.email,
    'Device Activated',
    d.activated_at
FROM devices d
JOIN profiles p ON p.id = d.user_id
WHERE p.email = 'user@example.com'

UNION ALL

SELECT 
    p.email,
    'Key Used',
    ak.used_at
FROM activation_keys ak
JOIN profiles p ON p.id = ak.used_by
WHERE p.email = 'user@example.com'

ORDER BY event_time DESC;

-- ==========================================
-- END OF ADMIN HELPER QUERIES
-- ==========================================
