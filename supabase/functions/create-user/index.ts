import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    console.log("=== Create User Function Started ===");
    console.log("Method:", req.method);
    
    // 🔐 Get user token from request
    const authHeader = req.headers.get("Authorization");
    console.log("Auth header present:", !!authHeader);
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 🔑 Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Missing environment variables" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 👤 Create user client with auth header
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 🔐 Create admin client with service role key
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 👤 Get logged-in user
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (!user || userError) {
      return new Response(
        JSON.stringify({ 
          error: "Unauthorized",
          details: userError?.message || "Invalid token"
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 🔍 Check admin role from profiles table
    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ 
          error: "Failed to verify user role",
          details: profileError?.message
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (profile.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Admin access required. You do not have admin privileges." }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 📩 Read request body
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ➕ Create user with admin client
    const { data: userData, error: createUserError } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (createUserError) {
      return new Response(
        JSON.stringify({ 
          error: "Failed to create user",
          details: createUserError.message
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!userData.user) {
      return new Response(
        JSON.stringify({ error: "No user data returned" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 🧾 Create profile with 'user' role (not admin)
    // Use upsert to handle cases where profile already exists
    const { error: createProfileError } = await adminClient
      .from("profiles")
      .upsert({
        id: userData.user.id,
        email: email,
        role: "user",
        is_active: false,
      }, {
        onConflict: "id"
      });

    if (createProfileError) {
      // If profile creation fails, rollback user creation
      await adminClient.auth.admin.deleteUser(userData.user.id);
      return new Response(
        JSON.stringify({ 
          error: "Failed to create user profile",
          details: createProfileError.message
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 🔑 Generate and save activation key to database
    const activationKey = await generateActivationKey();
    
    const { error: keyError } = await adminClient
      .from("activation_keys")
      .insert({
        key: activationKey,
        is_used: false,
      });

    if (keyError) {
      // If key creation fails, rollback user and profile
      await adminClient.auth.admin.deleteUser(userData.user.id);
      return new Response(
        JSON.stringify({ 
          error: "Failed to create activation key",
          details: keyError.message
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ✅ Success response
    return new Response(
      JSON.stringify({
        success: true,
        userId: userData.user.id,
        email: userData.user.email,
        activationKey,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message || "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// 🔑 Generate random activation key
async function generateActivationKey(): Promise<string> {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const segments = 4;
  const segmentLength = 4;
  const keySegments: string[] = [];

  for (let i = 0; i < segments; i++) {
    let segment = "";
    for (let j = 0; j < segmentLength; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    keySegments.push(segment);
  }

  return keySegments.join("-");
}
