import { useRef, forwardRef, useImperativeHandle } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { useProject } from "../../lib/project-context";
import { GridLayer } from "./GridLayer";
import { BoundaryLayer } from "./BoundaryLayer";
import { Circle32ZonesLayer } from "./Circle32ZonesLayer";
import { generate32CircleZones } from "../../lib/vastu/circle-zones";
import Konva from "konva";

interface CanvasProps {
  width: number;
  height: number;
  onCellClick?: (data: any) => void;
}

const URLImage = ({
  src,
  x,
  y,
  rotation,
}: {
  src: string;
  x: number;
  y: number;
  rotation: number;
}) => {
  const [image] = useImage(src);
  return (
    <KonvaImage
      image={image}
      x={x}
      y={y}
      offsetX={image ? image.width / 2 : 0}
      offsetY={image ? image.height / 2 : 0}
      rotation={rotation}
    />
  );
};

export const Canvas = forwardRef<Konva.Stage, CanvasProps>(
  ({ width, height, onCellClick }, ref) => {
    const {
      floorplanImage,
      northOrientation,
      boundaryPoints,
      setBoundaryPoints,
      isEditingBoundary,
      activeGrids,
    } = useProject();
    const stageRef = useRef<Konva.Stage>(null);

    useImperativeHandle(ref, () => stageRef.current!, []);

    const handleStageClick = (e: any) => {
      // Only handle clicks when pen tool is active
      if (!isEditingBoundary) return;

      // If polygon is already closed (3+ points), don't add more points from stage clicks
      if (boundaryPoints.length >= 3) return;

      // Only add points when clicking on the stage background (not on shapes)
      const clickedOnBackground =
        e.target === e.target.getStage() || e.target.getClassName() === "Image";
      if (!clickedOnBackground) return;

      const stage = stageRef.current;
      if (!stage) return;

      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const scale = stage.scaleX();
      const stagePos = stage.position();

      // Convert pointer to local coordinates
      const x = (pointer.x - stagePos.x) / scale;
      const y = (pointer.y - stagePos.y) / scale;

      // Add new point
      setBoundaryPoints([...boundaryPoints, { x, y }]);
    };

    const handleWheel = (e: any) => {
      e.evt.preventDefault();
      const stage = stageRef.current;
      if (!stage) return;

      const scaleBy = 1.1;
      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();

      if (!pointer) return;

      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      const newScale =
        e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

      stage.scale({ x: newScale, y: newScale });

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };

      stage.position(newPos);
    };

    // Generate circle zones if boundary is defined and grid32 is active
    const circleZones =
      boundaryPoints.length >= 3 && activeGrids.grid32
        ? (() => {
            const minX = Math.min(...boundaryPoints.map((p) => p.x));
            const maxX = Math.max(...boundaryPoints.map((p) => p.x));
            const minY = Math.min(...boundaryPoints.map((p) => p.y));
            const maxY = Math.max(...boundaryPoints.map((p) => p.y));
            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;
            const radius = Math.min(maxX - minX, maxY - minY) / 2;
            return generate32CircleZones(
              centerX,
              centerY,
              radius,
              northOrientation
            );
          })()
        : null;

    return (
      <div className="bg-muted/20 w-full h-full overflow-hidden">
        <Stage
          width={width}
          height={height}
          onWheel={handleWheel}
          onClick={handleStageClick}
          draggable={!isEditingBoundary || boundaryPoints.length >= 3}
          ref={stageRef}
          className="bg-gray-100"
          style={{
            cursor:
              isEditingBoundary && boundaryPoints.length < 3
                ? "crosshair"
                : "default",
          }}
        >
          <Layer>
            {floorplanImage && (
              <URLImage
                src={floorplanImage}
                x={width / 2}
                y={height / 2}
                rotation={northOrientation}
              />
            )}
          </Layer>
          <Layer>
            <GridLayer
              width={width}
              height={height}
              onCellClick={onCellClick}
            />
          </Layer>
          {circleZones && (
            <Layer>
              <Circle32ZonesLayer
                circleZones={circleZones}
                showLabels={true}
                showZoneNumbers={true}
                opacity={0.4}
              />
            </Layer>
          )}
          <Layer>
            <BoundaryLayer />
          </Layer>
        </Stage>
      </div>
    );
  }
);

Canvas.displayName = "Canvas";
