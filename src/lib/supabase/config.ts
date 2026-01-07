/**
 * Supabase Configuration
 * 
 * IMPORTANT: Replace these with your actual Supabase project credentials
 * You can find these in your Supabase project settings:
 * https://app.supabase.com/project/_/settings/api
 */

export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY',
};

// Session configuration
export const SESSION_CONFIG = {
  // Keep user logged in for 30 days
  persistSession: true,
  // Auto refresh token before expiry
  autoRefreshToken: true,
  // Detect session in URL (OAuth redirects)
  detectSessionInUrl: true,
};
