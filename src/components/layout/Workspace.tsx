import { useState, useRef, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { useProject } from '../../lib/project-context';
import { Canvas } from '../canvas/Canvas';
import { CellInfoPanel } from '../canvas/CellInfoPanel';
import type { GridWedge } from '../../lib/grids/grid-math';
import { ReportButton } from '../report/ReportButton';
import Konva from 'konva';

export function Workspace() {
  const { floorplanImage, setFloorplanImage } = useProject();
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

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const img = new Image();
          img.onload = () => {
            setFloorplanImage(event.target!.result as string, img.width, img.height);
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

  return (
    <div className="flex-1 relative bg-gray-100 overflow-hidden flex flex-col">
      {/* Toolbar */}
      {floorplanImage && (
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <ReportButton getStageDataURL={getStageDataURL} />
        </div>
      )}

      <div 
        ref={containerRef}
        className="flex-1 relative"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
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
                        setFloorplanImage(event.target!.result as string, img.width, img.height);
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
