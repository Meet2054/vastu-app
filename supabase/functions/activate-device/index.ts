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