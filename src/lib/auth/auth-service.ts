import { supabase } from '../supabase/client';
import { getDeviceFingerprint } from './device';
import type { UserProfile } from '../supabase/types';

/**
 * Authentication Service
 * 
 * Handles all auth operations including:
 * - Sign in
 * - Sign out
 * - Device activation
 * - Profile checks
 */

export interface SignInResult {
  success: boolean;
  needsActivation: boolean;
  user?: UserProfile;
  error?: string;
}

export interface ActivationResult {
  success: boolean;
  error?: string;
}

/**
 * Sign in with email and password
 */
export async function signIn(
  email: string,
  password: string
): Promise<SignInResult> {
  try {
    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return {
        success: false,
        needsActivation: false,
        error: authError.message,
      };
    }

    if (!authData.user) {
      return {
        success: false,
        needsActivation: false,
        error: 'No user data returned',
      };
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select<'*', UserProfile>('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      return {
        success: false,
        needsActivation: false,
        error: 'Failed to fetch user profile',
      };
    }

    // Check if user is activated
    if (!profile.is_active) {
      return {
        success: true,
        needsActivation: true,
        user: profile,
      };
    }

    // Verify device fingerprint
    const deviceFingerprint = await getDeviceFingerprint();
    const { data: device, error: deviceError } = await supabase
      .from('devices')
      .select('*')
      .eq('user_id', authData.user.id)
      .eq('device_fingerprint', deviceFingerprint)
      .single();

    if (deviceError || !device) {
      // Device not found - user trying to login from different device
      await supabase.auth.signOut();
      return {
        success: false,
        needsActivation: false,
        error: 'This account is registered on a different device. Please contact the administrator for a new activation key.',
      };
    }

    return {
      success: true,
      needsActivation: false,
      user: profile,
    };
  } catch (error) {
    return {
      success: false,
      needsActivation: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Activate user account with activation key
 */
export async function activateAccount(
  activationKey: string,
  userId: string
): Promise<ActivationResult> {
  try {
    const deviceFingerprint = await getDeviceFingerprint();

    // Call Supabase Edge Function to activate
    const { data, error } = await supabase.functions.invoke('activate-device', {
      body: {
        key: activationKey,
        deviceFingerprint,
        userId,
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (data?.error) {
      return {
        success: false,
        error: data.error,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Activation failed',
    };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/**
 * Get current user profile
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const session = await getCurrentSession();
  if (!session) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return profile;
}

/**
 * Check if device is authorized
 */
export async function isDeviceAuthorized(userId: string): Promise<boolean> {
  try {
    const deviceFingerprint = await getDeviceFingerprint();
    
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('user_id', userId)
      .eq('device_fingerprint', deviceFingerprint)
      .single();

    return !error && !!data;
  } catch {
    return false;
  }
}
