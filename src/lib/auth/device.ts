import { invoke } from '@tauri-apps/api/core';

/**
 * Device Fingerprinting Utilities
 * 
 * These functions communicate with the Rust backend to:
 * - Generate unique device fingerprint
 * - Verify device matches stored fingerprint
 */

/**
 * Get the unique device fingerprint for this machine
 * 
 * @returns Promise<string> - SHA-256 hash of device information
 * @throws Error if fingerprint cannot be generated
 */
export async function getDeviceFingerprint(): Promise<string> {
  try {
    const fingerprint = await invoke<string>('get_device_fingerprint');
    return fingerprint;
  } catch (error) {
    console.error('Failed to get device fingerprint:', error);
    throw new Error('Could not generate device fingerprint');
  }
}

/**
 * Verify if current device matches stored fingerprint
 * 
 * @param storedFingerprint - The fingerprint stored in database
 * @returns Promise<boolean> - True if device matches
 */
export async function verifyDeviceFingerprint(
  storedFingerprint: string
): Promise<boolean> {
  try {
    const isValid = await invoke<boolean>('verify_device_fingerprint', {
      storedFingerprint,
    });
    return isValid;
  } catch (error) {
    console.error('Failed to verify device fingerprint:', error);
    return false;
  }
}

/**
 * Store device fingerprint in local storage
 * This is used to check device on app restart
 */
export function storeDeviceFingerprint(fingerprint: string): void {
  localStorage.setItem('device_fingerprint', fingerprint);
}

/**
 * Get stored device fingerprint from local storage
 */
export function getStoredDeviceFingerprint(): string | null {
  return localStorage.getItem('device_fingerprint');
}

/**
 * Clear stored device fingerprint
 * Call this on logout
 */
export function clearStoredDeviceFingerprint(): void {
  localStorage.removeItem('device_fingerprint');
}
