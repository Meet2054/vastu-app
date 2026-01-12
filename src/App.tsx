import { useState } from "react";
import { AuthProvider } from "./lib/auth/auth-context";
import { useAuth } from "./lib/auth/use-auth";
import { Login } from "./components/auth/Login";
import { Activation } from "./components/auth/Activation";
import { ProjectProvider } from "./lib/vastu/project-context";
import { Sidebar } from "./components/layout/Sidebar";
import { Workspace, WorkspaceRef } from "./components/layout/Workspace";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useRef } from "react";
import type { UserProfile } from "./lib/supabase/types";

/**
 * Main Application Component (Protected)
 */
function VastuApp() {
  const workspaceRef = useRef<WorkspaceRef>(null);
  const { signOut, profile } = useAuth();

  const handleSignOut = async () => {
    // Show confirmation dialog before any action
    const shouldSignOut = window.confirm("Are you sure you want to sign out?");

    // Only proceed if user confirmed
    if (shouldSignOut) {
      await signOut();
    }
  };

  return (
    <ErrorBoundary>
      <ProjectProvider>
        <div className="flex h-screen w-screen bg-background text-foreground overflow-hidden">
          <Sidebar
            onQuickReport={() => workspaceRef.current?.generateQuickReport()}
            onFullReport={(options) =>
              workspaceRef.current?.generateFullReport(options)
            }
            getThumbnail={() => workspaceRef.current?.getThumbnail()}
          />
          <main className="flex-1 flex flex-col relative">
            <header className="h-14 border-b flex items-center px-4 bg-card justify-between">
              <h1 className="font-semibold text-lg">Vastu App</h1>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {profile?.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-sm px-3 py-1 rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </header>
            <Workspace ref={workspaceRef} />
          </main>
          <aside className="w-80 border-l bg-card p-4">
            <h2 className="font-semibold mb-4">Properties</h2>
            <div className="text-sm text-muted-foreground">
              Select an element to view properties
            </div>
          </aside>
        </div>
      </ProjectProvider>
    </ErrorBoundary>
  );
}

/**
 * Auth Flow Manager
 */
function AuthenticatedApp() {
  const { user, profile, loading, signOut } = useAuth();
  const [needsActivation, setNeedsActivation] = useState(false);
  const [pendingProfile, setPendingProfile] = useState<UserProfile | null>(
    null
  );

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // User not logged in - show login
  if (!user) {
    return (
      <Login
        onLoginSuccess={() => {
          // Auth context will handle the state update
        }}
        onNeedsActivation={(profile) => {
          setPendingProfile(profile);
          setNeedsActivation(true);
        }}
      />
    );
  }

  // User logged in but needs activation
  if (needsActivation && pendingProfile) {
    return (
      <Activation
        profile={pendingProfile}
        onActivationSuccess={() => {
          setNeedsActivation(false);
          setPendingProfile(null);
          // Reload the page to refresh auth state
          window.location.reload();
        }}
        onBack={async () => {
          setNeedsActivation(false);
          setPendingProfile(null);
          await signOut();
        }}
      />
    );
  }

  // Check if profile is active
  if (profile && !profile.is_active) {
    return (
      <Activation
        profile={profile}
        onActivationSuccess={() => {
          window.location.reload();
        }}
        onBack={async () => {
          await signOut();
        }}
      />
    );
  }

  // User is authenticated and activated - show main app
  return <VastuApp />;
}

/**
 * Root App Component
 */
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
