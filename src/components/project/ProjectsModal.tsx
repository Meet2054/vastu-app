import { useState, useEffect } from "react";
import { X, FolderOpen, Trash2, Calendar, RefreshCw } from "lucide-react";
import {
  getUserProjects,
  deleteProject,
  type SavedProject,
} from "../../lib/vastu/project-service";

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectLoad: (project: SavedProject) => void;
}

export function ProjectsModal({
  isOpen,
  onClose,
  onProjectLoad,
}: ProjectsModalProps) {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchProjects = async () => {
        setLoading(true);
        const result = await getUserProjects();
        if (result.success && result.projects) {
          setProjects(result.projects);
        } else {
          alert(result.error || "Failed to load projects");
        }
        setLoading(false);
      };

      void fetchProjects();
    }
  }, [isOpen]);

  const loadProjects = async () => {
    setLoading(true);
    const result = await getUserProjects();
    if (result.success && result.projects) {
      setProjects(result.projects);
    } else {
      alert(result.error || "Failed to load projects");
    }
    setLoading(false);
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    setDeletingId(projectId);
    const result = await deleteProject(projectId);

    if (result.success) {
      setProjects(projects.filter((p) => p.id !== projectId));
    } else {
      alert(result.error || "Failed to delete project");
    }
    setDeletingId(null);
  };

  const handleOpenProject = (project: SavedProject) => {
    onProjectLoad(project);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <FolderOpen size={20} />
            <h2 className="text-xl font-semibold">My Projects</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadProjects}
              disabled={loading}
              className="p-2 rounded-md hover:bg-accent transition-colors"
              title="Refresh"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-accent transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw
                className="animate-spin text-muted-foreground"
                size={32}
              />
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FolderOpen size={48} className="mb-4 opacity-50" />
              <p>No saved projects yet</p>
              <p className="text-sm mt-1">
                Create and save your first project to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border rounded-lg overflow-hidden hover:border-primary/50 transition-colors group"
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-accent/20 relative overflow-hidden">
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <FolderOpen size={48} className="opacity-30" />
                      </div>
                    )}
                    {/* Overlay buttons */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenProject(project)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingId === project.id}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        {deletingId === project.id ? (
                          <RefreshCw size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="font-semibold truncate">{project.name}</h3>
                    {project.client_name && (
                      <p className="text-sm text-muted-foreground truncate mt-0.5">
                        Client: {project.client_name}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                      <Calendar size={12} />
                      <span>
                        {new Date(project.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t">
          <p className="text-sm text-muted-foreground">
            Total Projects: {projects.length}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-accent hover:bg-accent/80 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
