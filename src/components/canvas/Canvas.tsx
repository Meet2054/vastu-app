import { useRef, forwardRef, useImperativeHandle } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { useProject } from "../../lib/vastu/project-context";
import { GridLayer } from "./GridLayer";
import { BoundaryLayer } from "./BoundaryLayer";
import { Circle32ZonesLayer } from "./Circle32ZonesLayer";
import { VastuBaseLayer } from "../vastu-layers/Vastu32DivisionBaseLayer";
import { Vastu8DivisionBaseLayer } from "../vastu-layers/Vastu8DivisionBaseLayer";
import { Vastu16DivisionBaseLayer } from "../vastu-layers/Vastu16DivisionBaseLayer";
import { generate32CircleZones } from "../../lib/vastu/circle-zones";
import {
  getReferenceImage,
  getActiveReferenceImages,
  type VastuLayerType,
} from "../../lib/vastu/reference-images";
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
      vastuLayers,
    } = useProject();
    const stageRef = useRef<Konva.Stage>(null);

    useImperativeHandle(ref, () => stageRef.current!, []);

    const handleStageClick = (e: any) => {
      // Only handle clicks when pen tool is active
      if (!isEditingBoundary) return;

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

    // Calculate center data from boundary points using polygon centroid
    const centerData =
      boundaryPoints.length >= 3
        ? (() => {
            // Calculate polygon centroid (geometric center)
            let areaSum = 0;
            let centroidX = 0;
            let centroidY = 0;

            for (let i = 0; i < boundaryPoints.length; i++) {
              const p1 = boundaryPoints[i];
              const p2 = boundaryPoints[(i + 1) % boundaryPoints.length];

              const crossProduct = p1.x * p2.y - p2.x * p1.y;
              areaSum += crossProduct;
              centroidX += (p1.x + p2.x) * crossProduct;
              centroidY += (p1.y + p2.y) * crossProduct;
            }

            areaSum /= 2;
            const centerX = centroidX / (6 * areaSum);
            const centerY = centroidY / (6 * areaSum);

            // Calculate radius as distance to farthest boundary point
            const radius = Math.max(
              ...boundaryPoints.map((p) =>
                Math.sqrt(
                  Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2)
                )
              )
            );

            return { centerX, centerY, radius };
          })()
        : null;

    // Generate circle zones if boundary is defined and grid32 is active
    const circleZones =
      centerData && activeGrids.grid32
        ? generate32CircleZones(
            centerData.centerX,
            centerData.centerY,
            centerData.radius,
            northOrientation
          )
        : null;

    // Get active Vastu layers with reference images
    const activeVastuLayers = getActiveReferenceImages(vastuLayers);

    // Separate layers into 8-division, 16-division, and 32-division types
    const octagon8Layers: VastuLayerType[] = [];
    const square16Layers: VastuLayerType[] = [];
    const other32Layers: VastuLayerType[] = [];

    activeVastuLayers.forEach((layerType) => {
      // These 4 use octagon 8-division layout
      if (
        layerType === "devtaKhanj" ||
        layerType === "mahuratVichar" ||
        layerType === "dishaGandh" ||
        layerType === "nineXNineZones"
      ) {
        octagon8Layers.push(layerType);
      }
      // These 5 use square 16-division layout
      else if (
        layerType === "devtaBhojan" ||
        layerType === "nighathuArth" ||
        layerType === "khanjDhatu" ||
        layerType === "devtaNighath" ||
        layerType === "devtaChintha"
      ) {
        square16Layers.push(layerType);
      }
      // All others use 32-division chakra
      else {
        other32Layers.push(layerType);
      }
    });

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
          {/* Vastu Layers with 8-Division Octagon (Vedic 8-Division Analyses) */}
          {centerData &&
            octagon8Layers.map((layerType) => (
              <Layer key={layerType}>
                <Vastu8DivisionBaseLayer
                  layerType={layerType}
                  referenceImagePath={getReferenceImage(layerType)}
                  centerX={centerData.centerX}
                  centerY={centerData.centerY}
                  radius={centerData.radius}
                  northRotation={northOrientation}
                  opacity={0.7}
                  showOctagon={true}
                  showLabels={true}
                />
              </Layer>
            ))}
          {/* Vastu Layers with 16-Division Square Grid (Vedic 16-Division Analyses) */}
          {centerData &&
            square16Layers.map((layerType) => (
              <Layer key={layerType}>
                <Vastu16DivisionBaseLayer
                  layerType={layerType}
                  referenceImagePath={getReferenceImage(layerType)}
                  centerX={centerData.centerX}
                  centerY={centerData.centerY}
                  radius={centerData.radius}
                  northRotation={northOrientation}
                  opacity={0.7}
                  showLabels={true}
                />
              </Layer>
            ))}
          {/* Vastu Layers with Reference Images and 32-Division Chakra */}
          {centerData &&
            other32Layers.map((layerType) => (
              <Layer key={layerType}>
                <VastuBaseLayer
                  layerType={layerType}
                  referenceImagePath={getReferenceImage(layerType)}
                  centerX={centerData.centerX}
                  centerY={centerData.centerY}
                  radius={centerData.radius}
                  northRotation={northOrientation}
                  opacity={0.7}
                  showChakra={true}
                  showLabels={true}
                />
              </Layer>
            ))}
          <Layer>
            <BoundaryLayer />
          </Layer>
        </Stage>
      </div>
    );
  }
);

Canvas.displayName = "Canvas";
