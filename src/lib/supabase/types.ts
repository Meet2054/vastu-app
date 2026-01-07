/**
 * Database Types
 * 
 * Auto-generated from Supabase schema
 * Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      activation_keys: {
        Row: {
          id: string;
          key: string;
          is_used: boolean;
          used_by: string | null;
          used_on_device: string | null;
          used_at: string | null;
        };
        Insert: {
          id?: string;
          key: string;
          is_used?: boolean;
          used_by?: string | null;
          used_on_device?: string | null;
          used_at?: string | null;
        };
        Update: {
          id?: string;
          key?: string;
          is_used?: boolean;
          used_by?: string | null;
          used_on_device?: string | null;
          used_at?: string | null;
        };
      };
      devices: {
        Row: {
          id: string;
          user_id: string;
          device_fingerprint: string;
          activated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          device_fingerprint: string;
          activated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          device_fingerprint?: string;
          activated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          data: Record<string, unknown>; // jsonb
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          data?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          data?: Record<string, unknown>;
          created_at?: string;
        };
      };
    };
  };
}

// Auth types
export interface UserProfile {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface ActivationKey {
  id: string;
  key: string;
  is_used: boolean;
  used_by: string | null;
  used_on_device: string | null;
  used_at: string | null;
}

export interface Device {
  id: string;
  user_id: string;
  device_fingerprint: string;
  activated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  data: Record<string, unknown>;
  created_at: string;
}
