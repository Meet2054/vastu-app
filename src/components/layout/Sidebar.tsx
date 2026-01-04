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
import { useProject } from "../../lib/vastu/project-context";
import { FullReportModal } from "../report/FullReportModal";

interface SidebarProps {
  className?: string;
  onQuickReport?: () => void;
  onFullReport?: (options: any) => void;
}

export function Sidebar({
  className,
  onQuickReport,
  onFullReport,
}: SidebarProps) {
  const [showCompass, setShowCompass] = useState(false);
  const [showGrids, setShowGrids] = useState(false);
  const [showVastuLayers, setShowVastuLayers] = useState(false);
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [showFullReportModal, setShowFullReportModal] = useState(false);
  const {
    activeGrids,
    toggleGrid,
    vastuLayers,
    toggleVastuLayer,
    isEditingBoundary,
    setIsEditingBoundary,
  } = useProject();

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
            onClick={() => {
              setShowCompass(!showCompass);
              setShowGrids(false);
              setShowVastuLayers(false);
              setShowReportMenu(false);
            }}
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
            onClick={() => {
              setShowGrids(!showGrids);
              setShowCompass(false);
              setShowVastuLayers(false);
              setShowReportMenu(false);
            }}
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
        <div className="relative group">
          <button
            className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors w-full"
            title="Vastu Layers"
            onClick={() => {
              setShowVastuLayers(!showVastuLayers);
              setShowCompass(false);
              setShowGrids(false);
              setShowReportMenu(false);
            }}
          >
            <Layers size={20} />
          </button>
          {showVastuLayers && (
            <div className="absolute left-full top-0 ml-2 z-50 w-64 bg-card border rounded-lg shadow-lg p-2 flex flex-col gap-1 max-h-[450px] overflow-y-auto">
              
              {/* Modern Vastu */}
              <div className="text-xs text-muted-foreground px-2 py-1 font-medium">
                Modern Vastu
              </div>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  vastuLayers.mvastuSquareGrid &&
                    "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleVastuLayer("mvastuSquareGrid")}
              >
                M-Vastu Square Grid
              </button>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  vastuLayers.advanceMarma && "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleVastuLayer("advanceMarma")}
              >
                Advance Marma
              </button>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  vastuLayers.shubhDwar && "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleVastuLayer("shubhDwar")}
              >
                Shubh Dwar
              </button>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  vastuLayers.vpm && "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleVastuLayer("vpm")}
              >
                VPM (81 Zones)
              </button>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  vastuLayers.shaktiChakra && "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleVastuLayer("shaktiChakra")}
              >
                Shakti Chakra
              </button>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  vastuLayers.mvastuChakra && "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleVastuLayer("mvastuChakra")}
              >
                M-Vastu Chakra
              </button>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  vastuLayers.triDoshaDevision &&
                    "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleVastuLayer("triDoshaDevision")}
              >
                Tri Dosha Division
              </button>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  vastuLayers.triGunaDevision &&
                    "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleVastuLayer("triGunaDevision")}
              >
                Tri Guna Division
              </button>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  vastuLayers.panchtattvaDevision &&
                    "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleVastuLayer("panchtattvaDevision")}
              >
                Panchtatva Division
              </button>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  vastuLayers.menna && "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleVastuLayer("menna")}
              >
                Menna
              </button>

              {/* 8 Division */}
              <div className="text-xs text-muted-foreground px-2 py-1 font-medium mt-2">
                8 Division (Octagon)
              </div>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  vastuLayers.devtaKhanj && "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleVastuLayer("devtaKhanj")}
              >
                Devta Khanj
              </button>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  vastuLayers.mahuratVichar &&
                    "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleVastuLayer("mahuratVichar")}
              >
                Mahurat Vichar
              </button>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  vastuLayers.dishaGandh && "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleVastuLayer("dishaGandh")}
              >
                Disha Gandh
              </button>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  vastuLayers.nineXNineZones &&
                    "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleVastuLayer("nineXNineZones")}
              >
                9×9 Zones
              </button>

              {/* 16 Division */}
              <div className="text-xs text-muted-foreground px-2 py-1 font-medium mt-2">
                16 Division (Square)
              </div>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  vastuLayers.devtaBhojan && "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleVastuLayer("devtaBhojan")}
              >
                Devta Bhojan
              </button>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  vastuLayers.nighathuArth && "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleVastuLayer("nighathuArth")}
              >
                Nighathu Arth
              </button>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  vastuLayers.khanjDhatu && "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleVastuLayer("khanjDhatu")}
              >
                Khanj Dhatu
              </button>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  vastuLayers.devtaNighath && "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleVastuLayer("devtaNighath")}
              >
                Devta Nighath
              </button>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  vastuLayers.devtaChintha && "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleVastuLayer("devtaChintha")}
              >
                Devta Chintha
              </button>

              {/* 32 Division */}
              <div className="text-xs text-muted-foreground px-2 py-1 font-medium mt-2">
                32 Division (Circular)
              </div>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  vastuLayers.devtaChinhaAadi &&
                    "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleVastuLayer("devtaChinhaAadi")}
              >
                Devta Chinha Aadi
              </button>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  vastuLayers.circleGrid && "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleVastuLayer("circleGrid")}
              >
                Circle Grid
              </button>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  vastuLayers.seharumukh && "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleVastuLayer("seharumukh")}
              >
                Seharumukh
              </button>
              <button
                className={cn(
                  "text-sm text-left px-2 py-1.5 rounded hover:bg-accent",
                  vastuLayers.devtaBhojanAadi &&
                    "bg-accent text-accent-foreground"
                )}
                onClick={() => toggleVastuLayer("devtaBhojanAadi")}
              >
                Devta Bhojan Aadi
              </button>
            </div>
          )}
        </div>
        <div className="relative group">
          <button
            className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors w-full"
            title="Report"
            onClick={() => {
              setShowReportMenu(!showReportMenu);
              setShowCompass(false);
              setShowGrids(false);
              setShowVastuLayers(false);
            }}
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
          onFullReport?.(options);
        }}
      />
    </div>
  );
}
