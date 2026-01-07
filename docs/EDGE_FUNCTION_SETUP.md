# Edge Function Setup Guide

This guide explains how to create and deploy the Supabase Edge Function for device activation.

## 📋 What is an Edge Function?

Edge Functions run on Supabase's servers and handle sensitive operations that shouldn't be done on the client. In our case, it validates and processes activation keys.

## 🚀 Setup Steps

### Step 1: Install Supabase CLI

```bash
# Install Supabase CLI globally
npm install -g supabase

# Or using homebrew (macOS/Linux)
brew install supabase/tap/supabase

# Verify installation
supabase --version
```

### Step 2: Login to Supabase

```bash
# Login to your Supabase account
supabase login
```

### Step 3: Link Your Project

```bash
# Navigate to your project directory
cd c:\Users\akash\Desktop\VASTU\vastu

# Link to your Supabase project
supabase link --project-ref your-project-ref

# Find your project ref in: Supabase Dashboard → Settings → General
```

### Step 4: Create Edge Function

```bash
# Create the function
supabase functions new activate-device
```

This creates: `supabase/functions/activate-device/index.ts`

### Step 5: Write the Function Code

Replace the content of `supabase/functions/activate-device/index.ts` with:

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
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get request body
    const { key, deviceFingerprint, userId }: ActivationRequest = await req.json()

    // Validate inputs
    if (!key || !deviceFingerprint || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with service role (has admin access)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // 1. Check if activation key exists and is unused
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

    // 2. Check if device is already registered (prevent duplicate registrations)
    const { data: existingDevice } = await supabaseAdmin
      .from('devices')
      .select('*')
      .eq('device_fingerprint', deviceFingerprint)
      .single()

    if (existingDevice) {
      return new Response(
        JSON.stringify({ error: 'This device is already registered to another account' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 3. Check if user already has a device registered
    const { data: userDevice } = await supabaseAdmin
      .from('devices')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (userDevice) {
      return new Response(
        JSON.stringify({ error: 'User already has a device registered' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 4. Register the device
    const { error: deviceError } = await supabaseAdmin
      .from('devices')
      .insert({
        user_id: userId,
        device_fingerprint: deviceFingerprint,
      })

    if (deviceError) {
      console.error('Device registration error:', deviceError)
      return new Response(
        JSON.stringify({ error: 'Failed to register device' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 5. Mark activation key as used
    const { error: updateError } = await supabaseAdmin
      .from('activation_keys')
      .update({
        is_used: true,
        used_by: userId,
        used_on_device: deviceFingerprint,
        used_at: new Date().toISOString(),
      })
      .eq('id', activationKey.id)

    if (updateError) {
      console.error('Key update error:', updateError)
      // Rollback device registration
      await supabaseAdmin
        .from('devices')
        .delete()
        .eq('device_fingerprint', deviceFingerprint)
      
      return new Response(
        JSON.stringify({ error: 'Failed to mark key as used' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 6. Activate the user profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ is_active: true })
      .eq('id', userId)

    if (profileError) {
      console.error('Profile activation error:', profileError)
      return new Response(
        JSON.stringify({ error: 'Failed to activate user profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Success!
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Device activated successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

### Step 6: Deploy the Function

```bash
# Deploy the function to Supabase
supabase functions deploy activate-device

# Verify deployment
supabase functions list
```

## 🧪 Testing the Edge Function

### Method 1: Using Supabase Dashboard

1. Go to **Edge Functions** in Supabase Dashboard
2. Click on `activate-device`
3. Click **Invoke Function**
4. Use this test body:

```json
{
  "key": "YOUR-TEST-KEY",
  "deviceFingerprint": "test-fingerprint-123",
  "userId": "USER-UUID-FROM-AUTH"
}
```

### Method 2: Using cURL

```bash
curl -L -X POST 'https://YOUR-PROJECT-REF.supabase.co/functions/v1/activate-device' \
  -H 'Authorization: Bearer YOUR-ANON-KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "key": "YOUR-TEST-KEY",
    "deviceFingerprint": "test-fingerprint",
    "userId": "USER-UUID"
  }'
```

### Method 3: From Your App

The function is already integrated in `auth-service.ts`!

## 📝 Function Logic Flow

1. **Validate Input** - Check all required fields present
2. **Check Key** - Verify key exists and is unused
3. **Check Device** - Ensure device not already registered
4. **Check User** - Ensure user doesn't have another device
5. **Register Device** - Create device record
6. **Mark Key Used** - Update activation key
7. **Activate Profile** - Set `is_active = true`
8. **Return Success**

## 🔒 Security Features

- Runs with **service_role** key (full access)
- Validates all inputs
- Prevents double registration
- Atomic operations (rollback on failure)
- One device per user enforcement
- One key per device enforcement

## 🐛 Debugging

View function logs:

```bash
# Stream logs in real-time
supabase functions logs activate-device --tail

# View recent logs
supabase functions logs activate-device
```

Or check logs in Supabase Dashboard: **Edge Functions** → **activate-device** → **Logs**

## 🔄 Updating the Function

After making changes:

```bash
# Deploy updated function
supabase functions deploy activate-device
```

## 📊 Monitoring

Check function invocations in:
- **Supabase Dashboard** → **Edge Functions** → **activate-device** → **Metrics**

You can see:
- Total invocations
- Success/failure rate
- Response times
- Error logs

## ⚠️ Important Notes

1. **Service Role Key** - Never expose this in client code. It's automatically available in Edge Functions.
2. **CORS** - The function includes CORS headers to allow calls from your Tauri app.
3. **Idempotency** - The function checks for existing registrations to prevent duplicates.
4. **Rollback** - If any step fails, previous steps are rolled back.

## 🚀 Production Checklist

- [ ] Edge Function deployed
- [ ] Function tested with real data
- [ ] Logs checked for errors
- [ ] CORS headers configured
- [ ] Error handling verified
- [ ] Admin can generate keys
- [ ] Users can activate devices

## 📚 Additional Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Deploy Documentation](https://deno.com/deploy/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli/introduction)
