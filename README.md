# 🏡 Vastu App - Device-Locked Desktop Application

A professional Vastu analysis desktop application with **device-locked licensing system** built with Tauri, React, TypeScript, and Supabase.

## 🎯 Features

### Core Application
- ✅ Vastu analysis and visualization
- ✅ Multiple division layers (8, 16, 32)
- ✅ Circle zones analysis
- ✅ Project management
- ✅ Report generation (Quick & Full)
- ✅ Interactive canvas with grid

### 🔐 Licensing System
- ✅ **Email/Password Authentication**
- ✅ **One-Time Activation Keys**
- ✅ **Device Fingerprinting** (Hardware-based)
- ✅ **Device Locking** (App works only on activated device)
- ✅ **Anti-Sharing Protection**
- ✅ **Logout Protection** (Requires new key)
- ✅ **100% Serverless** (No backend to deploy)
- ✅ **Automatic Login** (Long-term sessions)

## 📚 Documentation

### 🚀 Getting Started
**Start here if you're setting up for the first time:**
- **[📖 STEP_BY_STEP_GUIDE.md](./STEP_BY_STEP_GUIDE.md)** - Complete setup guide (2 hours)

### 🗄️ Supabase Setup
**Database and authentication setup:**
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Database tables, RLS, triggers
- **[EDGE_FUNCTION_SETUP.md](./EDGE_FUNCTION_SETUP.md)** - Deploy activation function

### 📋 Daily Operations
**For managing users and keys:**
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Common commands & queries
- **[admin-queries.sql](./admin-queries.sql)** - Copy-paste SQL queries

### 📐 Understanding the System
**Architecture and implementation:**
- **[ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)** - Visual diagrams & flows
- **[LICENSING_README.md](./LICENSING_README.md)** - System overview & security

### ✅ Progress Tracking
**Track your setup progress:**
- **[IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)** - 77-point checklist
- **[IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)** - What's been done

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Rust (for Tauri)
- Supabase account

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your Supabase credentials
# Get these from: Supabase Dashboard → Settings → API
```

### 3. Setup Supabase
Follow the comprehensive guide: **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**

1. Create Supabase project
2. Run database migrations
3. Deploy Edge Function
4. Get project credentials

### 4. Run Development
```bash
npm run tauri dev
```

### 5. Build for Production
```bash
npm run tauri build
```

Output: `src-tauri/target/release/vastu.exe`

## 📦 Project Structure

```
vastu/
├── src/
│   ├── components/
│   │   ├── auth/              # Authentication screens
│   │   ├── canvas/            # Vastu visualization
│   │   ├── layout/            # App layout
│   │   └── report/            # Report generation
│   ├── lib/
│   │   ├── auth/              # Auth logic & device fingerprinting
│   │   ├── supabase/          # Supabase client & types
│   │   └── vastu/             # Vastu calculations
│   └── App.tsx                # Main app with auth flow
├── src-tauri/
│   ├── src/
│   │   └── lib.rs             # Rust device fingerprinting
│   └── Cargo.toml             # Rust dependencies
├── supabase/
│   └── functions/
│       └── activate-device/   # Edge Function (deploy this!)
└── [Documentation files]
```

## 🔐 How It Works

### For End Users
1. **Install App** → Double-click EXE
2. **Login** → Enter email + password
3. **Activate** → Enter one-time activation key
4. **Done!** → App works, auto-login next time

### For Admins (You)
1. **Create User** → Supabase Dashboard
2. **Generate Key** → Run SQL query
3. **Send Credentials** → Email user (EXE + email + password + key)
4. **User Activates** → Verify in database

## 👥 User Management

### Create New User
1. Supabase Dashboard → Authentication → Add User
2. Enter email and password
3. Profile automatically created with `is_active = false`

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
  d.activated_at
FROM profiles p
LEFT JOIN devices d ON d.user_id = p.id
ORDER BY p.created_at DESC;
```

More queries: **[admin-queries.sql](./admin-queries.sql)**

## 🔒 Security Features

- **Device Fingerprinting**: Hardware-based (Machine ID + OS + CPU)
- **One-Time Keys**: Can't be reused after activation
- **Row Level Security**: Users can only access their own data
- **Edge Functions**: Server-side validation
- **JWT Tokens**: Industry-standard authentication
- **Device Verification**: Checked on every app open

## 🚫 Anti-Sharing Protection

- ✅ One device per user
- ✅ One activation key per device
- ✅ Keys can't be reused
- ✅ Logout requires new key from admin
- ✅ Different device = access denied

## 🧪 Testing

### Create Test User
1. Supabase → Authentication → Add User
   - Email: `test@example.com`
   - Password: `Test123456!`

2. Generate key (see SQL above)

3. Run app:
```bash
npm run tauri dev
```

4. Login → Activate → Verify works

## 📊 Database Schema

### Tables
- **profiles** - User data (extends Supabase Auth)
- **activation_keys** - One-time activation keys
- **devices** - Registered devices (device fingerprints)
- **projects** - User's Vastu projects

Full schema: **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS
- **Desktop**: Tauri 2
- **Backend**: Supabase (Auth + Database + Edge Functions)
- **Database**: PostgreSQL with Row Level Security
- **Language**: TypeScript + Rust

## 📈 Supabase Free Tier Limits

- ✅ 50,000 monthly active users
- ✅ 500 MB database space
- ✅ 1 GB file storage
- ✅ 2 GB bandwidth
- ✅ 500,000 Edge Function invocations

More than enough for most use cases!

## 🆘 Common Issues

### Build Fails
```bash
cd src-tauri
cargo clean
cargo build
cd ..
npm run tauri build
```

### Edge Function Not Working
```bash
supabase functions deploy activate-device
supabase functions logs activate-device --tail
```

### Login Fails
- Check `.env` has correct credentials
- Verify user exists in Supabase Auth
- Check user email is confirmed

More troubleshooting: **[STEP_BY_STEP_GUIDE.md](./STEP_BY_STEP_GUIDE.md)** → Common Issues

## 📞 Support

- **Documentation**: All guides in project folder
- **Supabase Docs**: https://supabase.com/docs
- **Tauri Docs**: https://tauri.app/v1/guides

## 📝 License

[Your License Here]

## 🙏 Credits

Built with:
- [Tauri](https://tauri.app) - Desktop framework
- [React](https://react.dev) - UI library
- [Supabase](https://supabase.com) - Backend platform
- [Tailwind CSS](https://tailwindcss.com) - Styling

---

## 🎉 Ready to Get Started?

👉 **Follow the [STEP_BY_STEP_GUIDE.md](./STEP_BY_STEP_GUIDE.md)** to set up your licensing system!

**Estimated Setup Time**: 2 hours
**Difficulty**: Intermediate
**Result**: Production-ready desktop app with licensing

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Built with ❤️ using Tauri + React + Supabase**
