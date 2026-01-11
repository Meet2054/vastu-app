import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase/client";
import { X, Key, RefreshCw, Copy, CheckCircle, UserPlus } from "lucide-react";

interface User {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingKey, setGeneratingKey] = useState<string | null>(null);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Filter out admin users
      const filteredUsers = (data || []).filter(
        (user: User) => user.email && !user.email.endsWith("@admin") // or check role !== 'admin'
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Failed to load users:", error);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    if (!newUserEmail || !newUserPassword) {
      alert("Please enter both email and password");
      return;
    }

    setCreatingUser(true);
    try {
      // Get current session token
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error("No active session. Please log in again.");
      }

      // Call Edge Function with Authorization header
      const { data, error } = await supabase.functions.invoke("create-user", {
        body: { email: newUserEmail, password: newUserPassword },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to create user");
      }

      if (!data || !data.activationKey) {
        throw new Error("No activation key returned");
      }

      // Show success and generated key
      setGeneratedKey(data.activationKey);
      setGeneratingKey(null);
      alert(
        `User created successfully!\n\nEmail: ${newUserEmail}\nActivation Key: ${data.activationKey}\n\nPlease copy the activation key now.`
      );

      // Reset form and reload users
      setNewUserEmail("");
      setNewUserPassword("");
      setShowCreateUser(false);
      await loadUsers();
    } catch (error) {
      console.error("Failed to create user:", error);
      alert(
        `Failed to create user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setCreatingUser(false);
    }
  };

  const generateActivationKey = async (userId: string) => {
    setGeneratingKey(userId);
    setGeneratedKey(null);
    setCopiedKey(false);

    try {
      // Call the edge function to generate activation key
      const { data, error } = await supabase.functions.invoke(
        "activate-device",
        {
          body: { userId },
        }
      );

      if (error) throw error;

      if (data?.activationKey) {
        setGeneratedKey(data.activationKey);
      } else {
        throw new Error("No activation key returned");
      }
    } catch (error) {
      console.error("Failed to generate activation key:", error);
      alert("Failed to generate activation key");
    } finally {
      setGeneratingKey(null);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">
            Admin Panel - User Management
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateUser(!showCreateUser)}
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm"
            >
              <UserPlus size={16} />
              Create User
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-accent transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Create User Form */}
        {showCreateUser && (
          <div className="p-4 border-b bg-accent/20">
            <h3 className="font-semibold mb-3">Create New User</h3>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="flex-1 px-3 py-2 rounded-md border bg-background text-foreground"
              />
              <input
                type="password"
                placeholder="Password"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                className="flex-1 px-3 py-2 rounded-md border bg-background text-foreground"
              />
              <button
                onClick={createUser}
                disabled={creatingUser}
                className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingUser ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  "Create"
                )}
              </button>
              <button
                onClick={() => {
                  setShowCreateUser(false);
                  setNewUserEmail("");
                  setNewUserPassword("");
                }}
                className="px-4 py-2 rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw
                className="animate-spin text-muted-foreground"
                size={32}
              />
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="border rounded-lg p-4 hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{user.email}</h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            user.is_active
                              ? "bg-green-500/10 text-green-500"
                              : "bg-yellow-500/10 text-yellow-500"
                          }`}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        ID: {user.id}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Created:{" "}
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => generateActivationKey(user.id)}
                        disabled={generatingKey === user.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {generatingKey === user.id ? (
                          <>
                            <RefreshCw size={16} className="animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Key size={16} />
                            Generate Key
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Generated Key Display */}
                  {generatedKey && generatingKey === null && (
                    <div className="mt-4 p-3 bg-accent/50 rounded-md border">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-1">
                            Activation Key:
                          </p>
                          <code className="text-sm font-mono bg-background px-2 py-1 rounded block break-all">
                            {generatedKey}
                          </code>
                        </div>
                        <button
                          onClick={() => copyToClipboard(generatedKey)}
                          className="p-2 rounded-md hover:bg-accent transition-colors"
                          title="Copy to clipboard"
                        >
                          {copiedKey ? (
                            <CheckCircle size={18} className="text-green-500" />
                          ) : (
                            <Copy size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t">
          <p className="text-sm text-muted-foreground">
            Total Users: {users.length}
          </p>
          <button
            onClick={loadUsers}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-accent hover:bg-accent/80 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
