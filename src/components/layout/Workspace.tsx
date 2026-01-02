import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Upload, Loader2 } from "lucide-react";
import { useProject } from "../../lib/project-context";
import { Canvas } from "../canvas/Canvas";
import type { GridWedge } from "../../lib/grids/grid-math";
import Konva from "konva";
import { createRoot } from "react-dom/client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ReportTemplate } from "../report/ReportTemplate";
import { FullReportTemplate } from "../report/FullReportTemplate";
import {
  generateComprehensiveAnalysis,
} from "../../lib/full-vastu-analysis";

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
      return stageRef.current.toDataURL({ pixelRatio: 2 });
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

      setReportProgress("Preparing analyses...");

      // Get base stage image
      const stageDataURL = getStageDataURL();
      if (!stageDataURL) {
        alert("Failed to get floor plan data. Please try again.");
        return;
      }

      setReportProgress("Running Vastu analyses...");

      // Generate comprehensive Vastu analysis using all selected modules
      const analysisResults = await generateComprehensiveAnalysis(
        boundaryPoints,
        options
      );

      if (analysisResults.length === 0) {
        alert("Please select at least one analysis option.");
        return;
      }

      setReportProgress(
        `Processed ${analysisResults.length} analyses. Generating PDF...`
      );

      // Create temporary container
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "0";
      document.body.appendChild(container);

      // Render full report template with actual analysis results
      const root = createRoot(container);
      const dateStr = new Date().toLocaleDateString();

      await new Promise<void>((resolve) => {
        root.render(
          <FullReportTemplate
            projectName={projectName}
            clientName={clientName}
            date={dateStr}
            floorPlanImage={stageDataURL}
            analysisResults={analysisResults}
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

      setReportProgress("Generating PDF document...");

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
            {/* <CellInfoPanel 
              data={selectedCell} 
              onClose={() => setSelectedCell(null)} 
            /> */}
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
