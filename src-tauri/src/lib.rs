use sha2::{Digest, Sha256};
use std::env;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Generate a unique device fingerprint
///
/// This combines:
/// - Machine ID (hardware-based unique identifier) or fallback
/// - OS name
/// - CPU architecture
/// - Username
///
/// Returns a SHA-256 hash that uniquely identifies this device
#[tauri::command]
fn get_device_fingerprint() -> Result<String, String> {
    // Try to get machine ID, use fallback if fails
    let machine_id = match machine_uid::get() {
        Ok(id) => id,
        Err(_) => {
            // Fallback: use hostname + username
            let hostname = hostname::get()
                .map(|h| h.to_string_lossy().to_string())
                .unwrap_or_else(|_| "unknown-host".to_string());

            let username = whoami::username();

            format!("{}-{}", hostname, username)
        }
    };

    // Get OS information
    let os = env::consts::OS;

    // Get CPU architecture
    let arch = env::consts::ARCH;

    // Combine all information
    let combined = format!("{}-{}-{}", machine_id, os, arch);

    // Create SHA-256 hash
    let mut hasher = Sha256::new();
    hasher.update(combined.as_bytes());
    let result = hasher.finalize();

    // Convert to hex string
    let fingerprint = format!("{:x}", result);

    Ok(fingerprint)
}

/// Verify device fingerprint matches stored value
///
/// This is used to check if the app is running on the authorized device
#[tauri::command]
fn verify_device_fingerprint(stored_fingerprint: String) -> Result<bool, String> {
    let current_fingerprint = get_device_fingerprint()?;
    Ok(current_fingerprint == stored_fingerprint)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_device_fingerprint,
            verify_device_fingerprint
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
