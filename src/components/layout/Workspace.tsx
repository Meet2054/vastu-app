import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Upload, Loader2 } from "lucide-react";
import { useProject } from "../../lib/vastu/project-context";
import { Canvas } from "../canvas/Canvas";
import type { GridWedge } from "../../lib/vastu/grid-math";
import Konva from "konva";
import { createRoot } from "react-dom/client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ReportTemplate } from "../report/QuickReportTemplate";
import { FullReportTemplate } from "../report/FullReportTemplate";

export interface WorkspaceRef {
  generateQuickReport: () => void;
  generateFullReport: (options: any) => void;
}

export const Workspace = forwardRef<WorkspaceRef, {}>((props, ref) => {
  const {
    floorplanImage,
    setFloorplanImage,
    projectName,
    clientName,
    boundaryPoints,
    vastuLayers,
    toggleVastuLayer,
  } = useProject();
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedCell, setSelectedCell] = useState<GridWedge | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportProgress, setReportProgress] = useState("");

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const img = new Image();
          img.onload = () => {
            setFloorplanImage(
              event.target!.result as string,
              img.width,
              img.height
            );
          };
          img.src = event.target!.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getStageDataURL = () => {
    if (stageRef.current) {
      const stage = stageRef.current;

      // Save current state
      const originalScale = stage.scaleX();
      const originalPosition = stage.position();

      // Calculate boundary bounds
      if (boundaryPoints.length >= 3) {
        const xs = boundaryPoints.map((p) => p.x);
        const ys = boundaryPoints.map((p) => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        // Calculate boundary dimensions
        const boundWidth = maxX - minX;
        const boundHeight = maxY - minY;
        const boundCenterX = (minX + maxX) / 2;
        const boundCenterY = (minY + maxY) / 2;

        // Calculate scale with padding (15% on each side = 30% total, so content is 70% of canvas)
        const paddingFactor = 1.43; // 1 / 0.7 = 1.43 to make content 70% of canvas
        const scaleX = stage.width() / (boundWidth * paddingFactor);
        const scaleY = stage.height() / (boundHeight * paddingFactor);
        const fitScale = Math.min(scaleX, scaleY);

        // Center the boundary
        const newX = stage.width() / 2 - boundCenterX * fitScale;
        const newY = stage.height() / 2 - boundCenterY * fitScale;

        // Apply temporary framing
        stage.scale({ x: fitScale, y: fitScale });
        stage.position({ x: newX, y: newY });
        stage.batchDraw();
      } else {
        // No boundary, reset to default view
        stage.scale({ x: 1, y: 1 });
        stage.position({ x: 0, y: 0 });
        stage.batchDraw();
      }

      // Capture the framed view
      const dataURL = stage.toDataURL({ pixelRatio: 2 });

      // Restore original state
      stage.scale({ x: originalScale, y: originalScale });
      stage.position(originalPosition);
      stage.batchDraw();

      return dataURL;
    }
    return null;
  };

  const generateQuickReport = async () => {
    try {
      // Get the floorplan image from the stage
      const stageDataURL = getStageDataURL();
      if (!stageDataURL) {
        console.error("Failed to get stage data URL");
        return;
      }

      // Create a temporary container for the report
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "0";
      document.body.appendChild(container);

      // Render the template
      const root = createRoot(container);
      const dateStr = new Date().toLocaleDateString();

      // Wait for render
      await new Promise<void>((resolve) => {
        root.render(
          <ReportTemplate
            projectName={projectName}
            clientName={clientName}
            image={stageDataURL}
            date={dateStr}
            ref={(el) => {
              if (el) {
                setTimeout(resolve, 500);
              }
            }}
          />
        );
      });

      // Capture with html2canvas
      const element = container.firstElementChild as HTMLElement;
      if (!element) throw new Error("Report element not found");

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // Generate PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${projectName.replace(/\s+/g, "_")}_Quick_Report.pdf`);

      // Cleanup
      root.unmount();
      document.body.removeChild(container);
    } catch (error) {
      console.error("Error generating quick report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const generateFullReport = async (options: any) => {
    try {
      setIsGeneratingReport(true);
      setReportProgress("Checking boundary points...");

      // Validate boundary points
      if (!boundaryPoints || boundaryPoints.length < 3) {
        alert(
          "Please draw boundary points on the floor plan before generating report."
        );
        return;
      }

      setReportProgress("Collecting active Vastu layers...");

      // Get all active Vastu layers from the modal options instead of sidebar state
      const activeLayerEntries = Object.entries(options).filter(
        ([_, isActive]) => isActive
      );

      if (activeLayerEntries.length === 0) {
        alert(
          "Please select at least one Vastu layer from the report options."
        );
        return;
      }

      setReportProgress(
        `Capturing ${activeLayerEntries.length} layer overlays...`
      );

      // Capture canvas image for each active layer
      const vastuLayerImages: { name: string; image: string }[] = [];

      for (const [layerKey, _] of activeLayerEntries) {
        // Temporarily enable this layer on the canvas
        if (vastuLayers.hasOwnProperty(layerKey)) {
          toggleVastuLayer(layerKey as keyof typeof vastuLayers);

          // Wait a bit for the canvas to update
          await new Promise((resolve) => setTimeout(resolve, 200));

          // Get canvas with current layer visible
          const layerImage = getStageDataURL();
          if (layerImage) {
            // Convert camelCase to readable name
            const readableName = layerKey
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())
              .trim();

            vastuLayerImages.push({
              name: readableName,
              image: layerImage,
            });
          }

          // Disable the layer after capture
          toggleVastuLayer(layerKey as keyof typeof vastuLayers);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      if (vastuLayerImages.length === 0) {
        alert("Failed to capture layer images. Please try again.");
        return;
      }

      setReportProgress("Generating PDF document...");

      // Create temporary container
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "0";
      document.body.appendChild(container);

      // Render full report template with layer images
      const root = createRoot(container);
      const dateStr = new Date().toLocaleDateString();

      await new Promise<void>((resolve) => {
        root.render(
          <FullReportTemplate
            projectName={projectName}
            clientName={clientName}
            date={dateStr}
            vastuLayerImages={vastuLayerImages}
            ref={(el) => {
              if (el) {
                setTimeout(resolve, 1000);
              }
            }}
          />
        );
      });

      // Capture with html2canvas
      const element = container.firstElementChild as HTMLElement;
      if (!element) throw new Error("Report element not found");

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      // Generate multi-page PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${projectName.replace(/\s+/g, "_")}_Full_Report.pdf`);

      // Cleanup
      root.unmount();
      document.body.removeChild(container);
      setReportProgress("");
    } catch (error) {
      console.error("Error generating full report:", error);
      alert(
        `Failed to generate full report: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsGeneratingReport(false);
      setReportProgress("");
    }
  };

  useImperativeHandle(ref, () => ({
    generateQuickReport,
    generateFullReport,
  }));

  return (
    <div
      className="flex-1 relative bg-gray-100 overflow-hidden flex flex-col"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div ref={containerRef} className="flex-1 relative">
        {floorplanImage ? (
          <>
            <Canvas
              ref={stageRef}
              width={dimensions.width}
              height={dimensions.height}
              onCellClick={setSelectedCell}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 m-8 rounded-lg">
            <Upload size={48} className="mb-4" />
            <p className="text-lg">Drag and drop floorplan image here</p>
            <p className="text-sm mt-2">or click to upload</p>
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    if (event.target?.result) {
                      const img = new Image();
                      img.onload = () => {
                        setFloorplanImage(
                          event.target!.result as string,
                          img.width,
                          img.height
                        );
                      };
                      img.src = event.target!.result as string;
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isGeneratingReport && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-3 min-w-[300px]">
            <Loader2 size={32} className="animate-spin text-primary" />
            <p className="text-lg font-medium">Generating Report...</p>
            {reportProgress && (
              <p className="text-sm text-gray-600 text-center">
                {reportProgress}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

Workspace.displayName = "Workspace";
