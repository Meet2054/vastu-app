import { ProjectProvider } from "./lib/project-context";
import { Sidebar } from "./components/layout/Sidebar";
import { Workspace, WorkspaceRef } from "./components/layout/Workspace";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useRef } from "react";

function App() {
  const workspaceRef = useRef<WorkspaceRef>(null);

  return (
    <ErrorBoundary>
      <ProjectProvider>
        <div className="flex h-screen w-screen bg-background text-foreground overflow-hidden">
          <Sidebar
            onQuickReport={() => workspaceRef.current?.generateQuickReport()}
            onFullReport={(options) =>
              workspaceRef.current?.generateFullReport(options)
            }
          />
          <main className="flex-1 flex flex-col relative">
            <header className="h-14 border-b flex items-center px-4 bg-card">
              <h1 className="font-semibold text-lg">Vastu App</h1>
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

export default App;
