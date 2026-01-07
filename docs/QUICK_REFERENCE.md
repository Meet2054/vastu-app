# 🚀 Quick Reference Card

## Essential Commands

### Development
```bash
# Run in dev mode
npm run tauri dev

# Build for production
npm run tauri build
```

### Supabase CLI
```bash
# Login
supabase login

# Link project
supabase link --project-ref YOUR_REF

# Deploy edge function
supabase functions deploy activate-device

# View logs
supabase functions logs activate-device --tail
```

---

## Key File Locations

### Configuration
- `.env` - Supabase credentials (CREATE THIS!)
- `src/lib/supabase/config.ts` - Supabase client config
- `src/lib/supabase/types.ts` - Database types

### Auth Components
- `src/components/auth/Login.tsx` - Login screen
- `src/components/auth/Activation.tsx` - Activation screen
- `src/lib/auth/auth-context.tsx` - Auth state
- `src/lib/auth/auth-service.ts` - Auth operations
- `src/lib/auth/device.ts` - Device fingerprinting

### Backend
- `src-tauri/src/lib.rs` - Rust device functions
- `supabase/functions/activate-device/index.ts` - Edge function

### Build Output
- `src-tauri/target/release/vastu.exe` - Windows executable
- `src-tauri/target/release/bundle/nsis/` - Installer

---

## Database Quick Queries

### Create User (Manual)
```sql
-- Use Supabase Dashboard → Authentication → Add User
-- Profile auto-created by trigger
```

### Generate Activation Key
```sql
INSERT INTO activation_keys (key)
VALUES (
  upper(
    substring(md5(random()::text) from 1 for 4) || '-' ||
    substring(md5(random()::text) from 1 for 4) || '-' ||
    substring(md5(random()::text) from 1 for 4) || '-' ||
    substring(md5(random()::text) from 1 for 4)
  )
)
RETURNING key;
```

### View All Users
```sql
SELECT 
  p.email,
  p.is_active,
  d.device_fingerprint,
  d.activated_at
FROM profiles p
LEFT JOIN devices d ON d.user_id = p.id
ORDER BY p.created_at DESC;
```

### View Unused Keys
```sql
SELECT key, created_at
FROM activation_keys
WHERE is_used = false
ORDER BY created_at DESC;
```

### Reset User
```sql
-- Deactivate
UPDATE profiles SET is_active = false
WHERE email = 'user@example.com';

-- Remove device
DELETE FROM devices
WHERE user_id = (SELECT id FROM profiles WHERE email = 'user@example.com');
```

---

## Supabase Dashboard URLs

- **Authentication**: https://supabase.com/dashboard/project/YOUR_REF/auth/users
- **Table Editor**: https://supabase.com/dashboard/project/YOUR_REF/editor
- **SQL Editor**: https://supabase.com/dashboard/project/YOUR_REF/sql
- **Edge Functions**: https://supabase.com/dashboard/project/YOUR_REF/functions
- **API Settings**: https://supabase.com/dashboard/project/YOUR_REF/settings/api

---

## Environment Variables

Required in `.env`:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-key...
```

Find these at: **Settings** → **API** in Supabase Dashboard

---

## User Distribution Checklist

For each new user:

- [ ] Create user in Supabase Auth
- [ ] Generate activation key
- [ ] Send email with:
  - [ ] EXE file
  - [ ] Email address
  - [ ] Password
  - [ ] Activation key
- [ ] Verify user activated successfully

---

## Testing Flow

1. **Create test user**
   - Email: test@example.com
   - Password: Test123456!

2. **Generate key**
   - Run SQL to create key
   - Copy key

3. **Test login**
   - Run app: `npm run tauri dev`
   - Enter credentials
   - Should show activation screen

4. **Test activation**
   - Enter activation key
   - Should activate successfully
   - App should load

5. **Test persistence**
   - Close app
   - Reopen app
   - Should auto-login

6. **Test logout protection**
   - Sign out
   - Try to login again with same key
   - Should fail (key already used)

---

## Common Issues & Solutions

### Issue: Build fails
```bash
cd src-tauri
cargo clean
cargo build
cd ..
npm run tauri build
```

### Issue: Edge function not working
```bash
# Check deployment
supabase functions list

# Redeploy
supabase functions deploy activate-device

# Check logs
supabase functions logs activate-device
```

### Issue: Login fails
- Check `.env` has correct credentials
- Verify user exists in Supabase Auth
- Check user email is confirmed

### Issue: Activation fails
- Verify key is unused in database
- Check Edge Function logs for errors
- Ensure device fingerprint is generated

---

## Security Checklist

- [ ] `.env` file in `.gitignore`
- [ ] No hardcoded credentials in code
- [ ] RLS enabled on all tables
- [ ] Edge Function deployed
- [ ] Service role key never exposed to client
- [ ] Device fingerprinting working
- [ ] Keys marked as used after activation
- [ ] Users can only access own data

---

## Admin Tasks

### Daily
- Monitor new user signups
- Generate activation keys as needed

### Weekly
- Check unused keys
- Review active users
- Monitor Edge Function logs

### Monthly
- Clean up old unused keys (90+ days)
- Review security logs
- Update documentation if needed

---

## Support Resources

- **Full Guide**: STEP_BY_STEP_GUIDE.md
- **Database Setup**: SUPABASE_SETUP.md
- **Edge Function**: EDGE_FUNCTION_SETUP.md
- **Architecture**: ARCHITECTURE_DIAGRAM.md
- **Admin Queries**: admin-queries.sql
- **Implementation Checklist**: IMPLEMENTATION_CHECKLIST.md

---

## Production Deployment

### Build
```bash
npm run tauri build
```

### Output
- EXE: `src-tauri/target/release/vastu.exe`
- Installer: `src-tauri/target/release/bundle/nsis/vastu_0.1.0_x64-setup.exe`

### Distribution
1. Copy EXE/Installer
2. Send to user with credentials
3. User installs and activates
4. Verify in database

---

## Monitoring

### Check Active Users
```sql
SELECT COUNT(*) FROM profiles WHERE is_active = true;
```

### Check Total Devices
```sql
SELECT COUNT(*) FROM devices;
```

### Check Unused Keys
```sql
SELECT COUNT(*) FROM activation_keys WHERE is_used = false;
```

### Recent Activations
```sql
SELECT 
  p.email,
  d.activated_at
FROM devices d
JOIN profiles p ON p.id = d.user_id
WHERE d.activated_at > NOW() - INTERVAL '7 days'
ORDER BY d.activated_at DESC;
```

---

## Emergency Procedures

### Reset All (Nuclear Option)
```sql
-- ⚠️ DANGER: This deletes EVERYTHING
TRUNCATE activation_keys CASCADE;
TRUNCATE devices CASCADE;
UPDATE profiles SET is_active = false;
```

### Reset Single User
```sql
UPDATE profiles SET is_active = false WHERE email = 'user@example.com';
DELETE FROM devices WHERE user_id = (SELECT id FROM profiles WHERE email = 'user@example.com');
-- Generate new key for user
```

---

**Last Updated**: January 2026
**Version**: 1.0.0
