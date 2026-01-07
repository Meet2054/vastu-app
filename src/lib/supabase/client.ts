import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG, SESSION_CONFIG } from './config';
import type { Database } from './types';

/**
 * Supabase Client Instance
 * 
 * This client handles:
 * - Authentication
 * - Database operations
 * - Real-time subscriptions
 * - Edge Functions calls
 */
export const supabase = createClient<Database>(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey,
  {
    auth: SESSION_CONFIG,
  }
);
