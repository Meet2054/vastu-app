# 🚀 Complete Step-by-Step Implementation Guide

This is your **master guide** for implementing the complete licensing system. Follow each step carefully.

---

## 📌 Overview

You're building a **device-locked desktop app** where:
- ✅ Users get email/password + one-time activation key
- ✅ App only works on the activated device
- ✅ No sharing possible between devices
- ✅ Logout = need new key
- ✅ 100% serverless (Supabase only)

---

## 🎯 Phase 1: Supabase Project Setup (30 minutes)

### Step 1.1: Create Supabase Account

1. Go to https://supabase.com
2. Click **"Start your project"**
3. Sign up with GitHub or Email
4. Verify your email

### Step 1.2: Create New Project

1. Click **"New Project"**
2. Choose your organization (or create one)
3. Fill in:
   - **Name**: Vastu App
   - **Database Password**: (Save this! You'll need it)
   - **Region**: Choose closest to your users
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup

### Step 1.3: Get Project Credentials

1. Go to **Settings** (gear icon) → **API**
2. Copy these values:
   ```
   Project URL: https://xxxxx.supabase.co
   Anon Key: eyJhbGc...long string...
   ```
3. **SAVE THESE!** You'll need them later

---

## 🗄️ Phase 2: Database Setup (20 minutes)

### Step 2.1: Open SQL Editor

1. In Supabase Dashboard, click **SQL Editor** (left sidebar)
2. Click **"New query"**

### Step 2.2: Create Profiles Table

Paste and run:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);
```

✅ You should see: "Success. No rows returned"

### Step 2.3: Create Activation Keys Table

Paste and run:

```sql
-- Create activation_keys table
CREATE TABLE activation_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  used_by UUID REFERENCES auth.users(id),
  used_on_device TEXT,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE activation_keys ENABLE ROW LEVEL SECURITY;

-- No direct access policy
CREATE POLICY "No direct access"
  ON activation_keys FOR ALL
  USING (FALSE);
```

### Step 2.4: Create Devices Table

Paste and run:

```sql
-- Create devices table
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  device_fingerprint TEXT UNIQUE NOT NULL,
  activated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

-- Policy
CREATE POLICY "Users can read own devices"
  ON devices FOR SELECT
  USING (auth.uid() = user_id);
```

### Step 2.5: Create Projects Table

Paste and run:

```sql
-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);
```

### Step 2.6: Create Triggers

Paste and run:

```sql
-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_active)
  VALUES (new.id, new.email, FALSE);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update timestamp on project changes
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  new.updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_project_updated
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
```

✅ **Verify**: Go to **Table Editor** → You should see all 4 tables

---

## 🔧 Phase 3: Edge Function Setup (25 minutes)

### Step 3.1: Install Supabase CLI

Open PowerShell and run:

```powershell
npm install -g supabase
```

Verify:
```powershell
supabase --version
```

### Step 3.2: Login to Supabase

```powershell
supabase login
```

- Browser will open
- Click **"Authorize"**
- Return to terminal

### Step 3.3: Navigate to Project

```powershell
cd C:\Users\akash\Desktop\VASTU\vastu
```

### Step 3.4: Link Project

```powershell
supabase link --project-ref YOUR_PROJECT_REF
```

**Where to find Project Ref?**
- Supabase Dashboard → Settings → General
- Look for "Reference ID" (looks like: `abcdefghijklmnop`)

### Step 3.5: Create Edge Function

```powershell
supabase functions new activate-device
```

✅ This creates: `supabase/functions/activate-device/index.ts`

### Step 3.6: Write Function Code

Open: `supabase/functions/activate-device/index.ts`

Replace everything with:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ActivationRequest {
  key: string;
  deviceFingerprint: string;
  userId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { key, deviceFingerprint, userId }: ActivationRequest = await req.json()

    if (!key || !deviceFingerprint || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check key
    const { data: activationKey, error: keyError } = await supabaseAdmin
      .from('activation_keys')
      .select('*')
      .eq('key', key)
      .eq('is_used', false)
      .single()

    if (keyError || !activationKey) {
      return new Response(
        JSON.stringify({ error: 'Invalid or already used activation key' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check device not already registered
    const { data: existingDevice } = await supabaseAdmin
      .from('devices')
      .select('*')
      .eq('device_fingerprint', deviceFingerprint)
      .single()

    if (existingDevice) {
      return new Response(
        JSON.stringify({ error: 'Device already registered' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Register device
    await supabaseAdmin.from('devices').insert({
      user_id: userId,
      device_fingerprint: deviceFingerprint,
    })

    // Mark key used
    await supabaseAdmin.from('activation_keys').update({
      is_used: true,
      used_by: userId,
      used_on_device: deviceFingerprint,
      used_at: new Date().toISOString(),
    }).eq('id', activationKey.id)

    // Activate user
    await supabaseAdmin.from('profiles').update({
      is_active: true
    }).eq('id', userId)

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

### Step 3.7: Deploy Edge Function

```powershell
supabase functions deploy activate-device
```

✅ You should see: "Deployed Function activate-device"

### Step 3.8: Verify Deployment

1. Go to Supabase Dashboard
2. Click **Edge Functions** (left sidebar)
3. You should see: `activate-device`
4. Status: **Active**

---

## 💻 Phase 4: Application Setup (15 minutes)

### Step 4.1: Create Environment File

In your project root, create `.env`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Replace with your actual values from Phase 1!

### Step 4.2: Install Dependencies

Already done! The packages are installed.

### Step 4.3: Build Rust Dependencies

```powershell
cd src-tauri
cargo build
cd ..
```

This may take 5-10 minutes first time.

---

## 🧪 Phase 5: Testing (20 minutes)

### Step 5.1: Create Test User

1. Supabase Dashboard → **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Fill in:
   - Email: `test@example.com`
   - Password: `Test123456!`
   - Email Confirm: ✅ **OFF** (auto-confirm)
4. Click **"Create user"**

### Step 5.2: Generate Activation Key

1. Go to **SQL Editor**
2. Run:

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

3. **COPY THE KEY!** (Format: ABCD-EFGH-IJKL-MNOP)

### Step 5.3: Run Application

```powershell
npm run tauri dev
```

### Step 5.4: Test Login Flow

1. App opens
2. Login screen appears
3. Enter:
   - Email: `test@example.com`
   - Password: `Test123456!`
4. Click **"Sign In"**
5. Activation screen appears ✅

### Step 5.5: Test Activation

1. Paste activation key
2. Click **"Activate Device"**
3. Wait 2-3 seconds
4. App reloads
5. Main app appears ✅

### Step 5.6: Test Persistent Login

1. Close app (X button)
2. Run again: `npm run tauri dev`
3. App opens directly (no login) ✅

### Step 5.7: Test Logout Protection

1. Click **"Sign Out"** button
2. Confirm logout
3. Try to login again
4. Enter activation key
5. Error: "Invalid or already used key" ✅

---

## 📦 Phase 6: Production Build (10 minutes)

### Step 6.1: Build Application

```powershell
npm run tauri build
```

This takes 10-15 minutes.

### Step 6.2: Find EXE

Location:
```
src-tauri\target\release\vastu.exe
```

Or:
```
src-tauri\target\release\bundle\nsis\vastu_0.1.0_x64-setup.exe
```

### Step 6.3: Test Production Build

1. Copy EXE to Desktop
2. Double-click to run
3. Test full flow again

---

## 👥 Phase 7: User Distribution (Ongoing)

### For Each New User:

#### Step 1: Create User Account

Supabase → Authentication → Add User

#### Step 2: Generate Activation Key

Run SQL:
```sql
INSERT INTO activation_keys (key)
VALUES (upper(
  substring(md5(random()::text) from 1 for 4) || '-' ||
  substring(md5(random()::text) from 1 for 4) || '-' ||
  substring(md5(random()::text) from 1 for 4) || '-' ||
  substring(md5(random()::text) from 1 for 4)
))
RETURNING key;
```

#### Step 3: Send to User

Email template:

```
Subject: Vastu App - Your Access Credentials

Hi [Name],

Here are your credentials for Vastu App:

📧 Email: [user email]
🔑 Password: [password]
🎫 Activation Key: [XXXX-XXXX-XXXX-XXXX]

Installation:
1. Download and install the app
2. Open the app
3. Enter your email and password
4. Enter the activation key when prompted

IMPORTANT:
- The activation key can only be used ONCE
- The app will only work on the device you activate it on
- If you logout, you'll need a new activation key

[Attach EXE file]

Best regards,
[Your Name]
```

---

## 🔧 Phase 8: Admin Management

### Generate Keys in Bulk

```sql
-- Generate 10 keys
INSERT INTO activation_keys (key)
SELECT upper(
  substring(md5(random()::text) from 1 for 4) || '-' ||
  substring(md5(random()::text) from 1 for 4) || '-' ||
  substring(md5(random()::text) from 1 for 4) || '-' ||
  substring(md5(random()::text) from 1 for 4)
)
FROM generate_series(1, 10)
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

### Reset User (If Needed)

```sql
-- Deactivate
UPDATE profiles SET is_active = false
WHERE email = 'user@example.com';

-- Remove device
DELETE FROM devices
WHERE user_id = (SELECT id FROM profiles WHERE email = 'user@example.com');
```

Then give user a new activation key.

---

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] All 4 tables created
- [ ] Triggers working
- [ ] Edge Function deployed
- [ ] Test user created
- [ ] Test key generated
- [ ] Login works
- [ ] Activation works
- [ ] Auto-login works
- [ ] Logout protection works
- [ ] Production build created
- [ ] First real user activated

---

## 🆘 Common Issues

### Issue: Can't login

**Check:**
- User exists in Supabase Auth
- Email confirmed (or auto-confirm ON)
- Password correct
- `.env` has correct credentials

### Issue: Activation fails

**Check:**
- Edge Function deployed
- Key is unused (check in table editor)
- No errors in Edge Function logs
- CORS headers configured

### Issue: Device fingerprint error

**Check:**
- Rust dependencies built: `cargo build`
- No errors in console
- Try rebuilding: `cargo clean && cargo build`

### Issue: Auto-login not working

**Check:**
- Session stored (check Application tab in DevTools)
- Profile is_active = true
- Device record exists

---

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Tauri Docs**: https://tauri.app
- **Admin Queries**: See `admin-queries.sql`
- **Detailed Setup**: See `SUPABASE_SETUP.md`
- **Edge Function**: See `EDGE_FUNCTION_SETUP.md`

---

## 🎉 You're Done!

Your licensing system is now:
✅ Fully functional
✅ Secure
✅ Serverless
✅ Device-locked
✅ Production-ready

**Next Steps:**
1. Create your first real user
2. Generate their key
3. Send them the EXE + credentials
4. Watch them activate successfully!

---

**Built with ❤️ using Tauri + React + Supabase**
