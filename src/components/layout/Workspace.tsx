import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Upload } from "lucide-react";
import { useProject } from "../../lib/project-context";
import { Canvas } from "../canvas/Canvas";
import type { GridWedge } from "../../lib/grids/grid-math";
import Konva from "konva";
import { createRoot } from "react-dom/client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ReportTemplate } from "../report/ReportTemplate";

export const Workspace = forwardRef<{ generateQuickReport: () => void }>(
  (props, ref) => {
    const { floorplanImage, setFloorplanImage, projectName, clientName } =
      useProject();
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<Konva.Stage>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [selectedCell, setSelectedCell] = useState<GridWedge | null>(null);

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
      }
    };

    useImperativeHandle(ref, () => ({
      generateQuickReport,
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
      </div>
    );
  }
);

Workspace.displayName = "Workspace";
