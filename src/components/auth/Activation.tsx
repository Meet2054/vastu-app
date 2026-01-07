import { useState } from "react";
import { activateAccount } from "../../lib/auth/auth-service";
import type { UserProfile } from "../../lib/supabase/types";

interface ActivationProps {
  profile: UserProfile;
  onActivationSuccess: () => void;
  onBack: () => void;
}

export function Activation({
  profile,
  onActivationSuccess,
  onBack,
}: ActivationProps) {
  const [activationKey, setActivationKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await activateAccount(activationKey.trim(), profile.id);

      if (!result.success) {
        setError(result.error || "Activation failed");
        setLoading(false);
        return;
      }

      // Success!
      onActivationSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-2xl p-8 border border-border">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Activate Your Device
            </h1>
            <p className="text-sm text-muted-foreground">
              Signed in as: <span className="font-medium">{profile.email}</span>
            </p>
          </div>

          {/* Info Box */}
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
            <p className="text-sm text-blue-400">
              ⚠️ This account needs to be activated on this device.
              <br />
              <br />
              Please contact your administrator to get a one-time activation
              key.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* Activation Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="activationKey"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Activation Key
              </label>
              <input
                id="activationKey"
                type="text"
                value={activationKey}
                onChange={(e) => setActivationKey(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-foreground font-mono disabled:opacity-50"
                placeholder="XXXX-XXXX-XXXX-XXXX"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Enter the activation key provided by your administrator
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !activationKey.trim()}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Activating...
                </span>
              ) : (
                "Activate Device"
              )}
            </button>
          </form>

          {/* Back Button */}
          <button
            onClick={onBack}
            disabled={loading}
            className="mt-4 w-full py-2 px-4 bg-transparent hover:bg-background border border-border text-foreground font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            Back to Login
          </button>

          {/* Warning */}
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
            <p className="text-xs text-yellow-400">
              <strong>Important:</strong> The activation key can only be used
              once. Once activated, this app will only work on this device.
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            🔒 Device-locked for maximum security
          </p>
        </div>
      </div>
    </div>
  );
}
