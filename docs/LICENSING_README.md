# 🔐 Vastu App - Licensing System

A complete device-locked licensing system for your Tauri desktop application using Supabase.

## 🎯 Features

- ✅ **Email/Password Authentication** - Secure user login
- ✅ **One-Time Activation Keys** - Single-use keys for device activation
- ✅ **Device Fingerprinting** - Hardware-based device identification
- ✅ **Device Locking** - App works only on activated device
- ✅ **No Backend Required** - 100% serverless with Supabase
- ✅ **Logout Protection** - New key required after logout
- ✅ **Anti-Sharing** - Prevents EXE sharing across devices
- ✅ **User Projects** - Store user data in Supabase
- ✅ **Long-Term Sessions** - Users stay logged in (30+ days)

## 🏗️ Architecture

```
[Tauri Desktop App]
        |
        | Supabase JS SDK
        |
[Supabase Cloud]
    ├── Auth (Email/Password)
    ├── Database (PostgreSQL)
    ├── Edge Functions (Device Activation)
    └── Row Level Security (RLS)
```

## 📋 Setup Checklist

### 1. Supabase Setup
- [ ] Create Supabase project
- [ ] Run database migrations (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))
- [ ] Deploy Edge Function (see [EDGE_FUNCTION_SETUP.md](./EDGE_FUNCTION_SETUP.md))
- [ ] Get project credentials

### 2. Application Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Add Supabase URL and Anon Key
- [ ] Build Rust dependencies: `npm run tauri build`

### 3. Testing
- [ ] Create test user in Supabase
- [ ] Generate activation key
- [ ] Test login flow
- [ ] Test activation flow
- [ ] Verify device locking

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment

Create `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3: Setup Supabase

Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:
- Create database tables
- Set up Row Level Security
- Configure authentication

### Step 4: Deploy Edge Function

Follow [EDGE_FUNCTION_SETUP.md](./EDGE_FUNCTION_SETUP.md) to:
- Install Supabase CLI
- Deploy activation function
- Test the function

### Step 5: Run Development

```bash
npm run tauri dev
```

### Step 6: Build for Production

```bash
npm run tauri build
```

The EXE will be in: `src-tauri/target/release/`

## 🔑 User Management (Admin Tasks)

### Creating Users

**Option 1: Supabase Dashboard**
1. Go to Authentication → Users
2. Click "Add User"
3. Enter email and password
4. User created with `is_active = false`

**Option 2: SQL Query**
```sql
-- User will be created via Supabase Auth API
-- Profile auto-created by trigger
```

### Generating Activation Keys

Run in Supabase SQL Editor:

```sql
-- Generate one key
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

-- Generate 10 keys at once
INSERT INTO activation_keys (key)
SELECT 
  upper(
    substring(md5(random()::text) from 1 for 4) || '-' ||
    substring(md5(random()::text) from 1 for 4) || '-' ||
    substring(md5(random()::text) from 1 for 4) || '-' ||
    substring(md5(random()::text) from 1 for 4)
  )
FROM generate_series(1, 10)
RETURNING key;
```

### Distributing to Users

Send to each user:
1. **EXE file** - The built application
2. **Email/Username** - Their login credentials
3. **Password** - Their account password
4. **Activation Key** - One-time use key (format: XXXX-XXXX-XXXX-XXXX)

## 🔄 User Flow

### First Time Setup

1. User installs EXE
2. Opens application
3. Sees login screen
4. Enters email + password
5. System detects account not activated
6. User enters activation key
7. App generates device fingerprint
8. Edge Function validates and activates
9. User now logged in ✅

### Subsequent Opens

1. User opens app
2. Supabase auto-restores session
3. System verifies device fingerprint
4. User automatically logged in ✅

### If User Logs Out

1. Session cleared
2. Activation key already used
3. User must contact admin for new key
4. Cannot login without new activation ⚠️

### If User Shares EXE

1. Different device = different fingerprint
2. Login attempt fails
3. Error: "Account registered on different device"
4. Sharing prevented ✅

## 🗂️ Database Schema

### Tables

- **profiles** - User profiles (extends auth.users)
  - `id` - User ID (FK to auth.users)
  - `email` - User email
  - `is_active` - Activation status
  - `created_at` - Account creation time

- **activation_keys** - One-time activation keys
  - `id` - Key ID
  - `key` - The activation key
  - `is_used` - Usage status
  - `used_by` - User who used it
  - `used_on_device` - Device fingerprint
  - `used_at` - Usage timestamp

- **devices** - Registered devices
  - `id` - Device ID
  - `user_id` - Owner user ID
  - `device_fingerprint` - Hardware fingerprint
  - `activated_at` - Registration time

- **projects** - User's Vastu projects
  - `id` - Project ID
  - `user_id` - Owner user ID
  - `name` - Project name
  - `data` - Project data (JSONB)
  - `created_at` - Creation time

## 🔒 Security Features

### Device Fingerprinting
- Hardware ID (machine_uid)
- OS name
- CPU architecture
- SHA-256 hashed
- Stored locally and in database

### Authentication
- Supabase Auth (email/password)
- Session tokens (JWT)
- Auto-refresh tokens
- Secure storage

### Row Level Security (RLS)
- Users can only access own data
- Admin operations via service role
- No direct access to activation keys
- Protected device records

### Edge Functions
- Server-side validation
- Atomic operations
- Rollback on failure
- Comprehensive error handling

## 🛠️ Admin Tools

### Check Unused Keys

```sql
SELECT key, created_at
FROM activation_keys
WHERE is_used = false
ORDER BY created_at DESC;
```

### View All Users and Devices

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

### Reset User (Deactivate)

```sql
-- Deactivate user
UPDATE profiles
SET is_active = false
WHERE email = 'user@example.com';

-- Remove device registration
DELETE FROM devices
WHERE user_id = (
  SELECT id FROM profiles WHERE email = 'user@example.com'
);

-- Now user needs new activation key
```

### Check Key Status

```sql
SELECT 
  key,
  is_used,
  (SELECT email FROM profiles WHERE id = used_by) as used_by_email,
  used_at
FROM activation_keys
WHERE key = 'XXXX-XXXX-XXXX-XXXX';
```

## 📦 Project Structure

```
vastu/
├── src/
│   ├── components/
│   │   └── auth/
│   │       ├── Login.tsx          # Login screen
│   │       └── Activation.tsx     # Activation screen
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── auth-context.tsx   # Auth state management
│   │   │   ├── auth-service.ts    # Auth operations
│   │   │   └── device.ts          # Device fingerprinting
│   │   └── supabase/
│   │       ├── client.ts          # Supabase client
│   │       ├── config.ts          # Configuration
│   │       └── types.ts           # TypeScript types
│   └── App.tsx                    # Main app with auth flow
├── src-tauri/
│   └── src/
│       └── lib.rs                 # Rust device fingerprinting
├── SUPABASE_SETUP.md              # Database setup guide
├── EDGE_FUNCTION_SETUP.md         # Edge function guide
└── README.md                      # This file
```

## 🧪 Testing

### Test Credentials

Create in Supabase Dashboard:
- Email: `test@example.com`
- Password: `test123456`

### Test Flow

1. Generate activation key
2. Build and run app: `npm run tauri dev`
3. Login with test credentials
4. Enter activation key
5. Verify activation successful
6. Close and reopen app
7. Verify auto-login works
8. Test logout (should require new key)

## 🚨 Common Issues

### Issue: "Failed to get device fingerprint"
**Solution**: Rebuild Rust dependencies
```bash
cd src-tauri
cargo clean
cargo build
```

### Issue: "Invalid activation key"
**Solution**: 
- Check key is unused in database
- Verify key format is correct
- Check Edge Function logs

### Issue: "Device already registered"
**Solution**:
- Each device can only be registered once
- Delete device record in database to test again

### Issue: Can't login after logout
**Solution**: 
- This is expected behavior!
- User needs new activation key
- Contact admin for new key

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Tauri Documentation](https://tauri.app)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)

## 🤝 Support

For issues with:
- **Supabase**: Check SUPABASE_SETUP.md
- **Edge Functions**: Check EDGE_FUNCTION_SETUP.md
- **Device Fingerprinting**: Check src-tauri/src/lib.rs
- **Auth Flow**: Check src/lib/auth/

## 📝 License

Your application license here.

---

**Built with ❤️ using Tauri + React + Supabase**
