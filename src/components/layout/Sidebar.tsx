import { cn } from "../../lib/utils";
import {
  Compass as CompassIcon,
  FileText,
  Grid,
  Layers,
  Settings,
  Upload,
  PenTool,
} from "lucide-react";
import { Compass } from "../compass/Compass";
import { useState } from "react";
import { useProject } from "../../lib/project-context";
import { FullReportModal } from "../report/FullReportModal";

interface SidebarProps {
  className?: string;
  onQuickReport?: () => void;
}

export function Sidebar({ className, onQuickReport }: SidebarProps) {
  const [showCompass, setShowCompass] = useState(false);
  const [showGrids, setShowGrids] = useState(false);
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [showFullReportModal, setShowFullReportModal] = useState(false);
  const { activeGrids, toggleGrid, isEditingBoundary, setIsEditingBoundary } =
    useProject();

  return (
    <div
      className={cn(
        "w-16 bg-card border-r flex flex-col items-center py-4 gap-4 relative z-50",
        className
      )}
    >
      <div className="p-2 rounded-lg bg-primary/10 text-primary">
        <CompassIcon size={24} />
      </div>
      <div className="flex-1 flex flex-col gap-2 w-full px-2">
        <button
          className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          title="New Project"
        >
          <Upload size={20} />
        </button>
        <div className="relative group">
          <button
            className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors w-full"
            title="Compass"
            onClick={() => setShowCompass(!showCompass)}
          >
            <CompassIcon size={20} />
          </button>
          {showCompass && (
            <div className="absolute left-full top-0 ml-2 z-50 w-64">
              <Compass />
            </div>
          )}
        </div>
        <div className="relative group">
          <button
            className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors w-full"
            title="Grids"
            onClick={() => setShowGrids(!showGrids)}
          >
            <Grid size={20} />
          </button>
          {showGrids && (
            <div className="absolute left-full top-0 ml-2 z-50 w-48 bg-card border rounded-lg shadow-lg p-2 flex flex-col gap-1">
              <h4 className="text-xs font-semibold text-muted-foreground px-2 py-1">
                Grids
              </h4>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  activeGrids.grid16 && "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleGrid("grid16")}
              >
                16 Zones
              </button>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  activeGrids.grid32 && "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleGrid("grid32")}
              >
                32 Door Pada
              </button>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  activeGrids.grid64 && "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleGrid("grid64")}
              >
                64 Padvinyash
              </button>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  activeGrids.grid81 && "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleGrid("grid81")}
              >
                81 Padvinyash
              </button>
            </div>
          )}
        </div>
        <button
          className={cn(
            "p-2 rounded-md hover:bg-accent transition-colors",
            isEditingBoundary
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
          title="Edit Boundary"
          onClick={() => setIsEditingBoundary(!isEditingBoundary)}
        >
          <PenTool size={20} />
        </button>
        <button
          className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          title="Layers"
        >
          <Layers size={20} />
        </button>
        <div className="relative group">
          <button
            className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors w-full"
            title="Report"
            onClick={() => setShowReportMenu(!showReportMenu)}
          >
            <FileText size={20} />
          </button>
          {showReportMenu && (
            <div className="absolute left-full top-0 ml-2 z-50 w-48 bg-card border rounded-lg shadow-lg p-2 flex flex-col gap-1">
              <h4 className="text-xs font-semibold text-muted-foreground px-2 py-1">
                Reports
              </h4>
              <button
                className="text-sm text-left px-2 py-1.5 rounded hover:bg-accent"
                onClick={() => {
                  setShowReportMenu(false);
                  onQuickReport?.();
                }}
              >
                Quick Report
              </button>
              <button
                className="text-sm text-left px-2 py-1.5 rounded hover:bg-accent"
                onClick={() => {
                  setShowReportMenu(false);
                  setShowFullReportModal(true);
                }}
              >
                Full Report
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-auto">
        <button
          className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          title="Settings"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Full Report Modal */}
      <FullReportModal
        isOpen={showFullReportModal}
        onClose={() => setShowFullReportModal(false)}
        onGenerate={(options) => {
          console.log("Generating full report with options:", options);
          // TODO: Implement full report generation with selected options
        }}
      />
    </div>
  );
}
