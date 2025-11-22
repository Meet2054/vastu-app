import React from 'react';
import { Group, Wedge, Text, Line } from 'react-konva';
import { useProject } from '../../lib/project-context';
import { get16ZoneWedges, get32DoorWedges, getPolygonCentroid, getPolygonBounds, getSquareGrid } from '../../lib/grids/grid-math';

interface GridLayerProps {
  width: number;
  height: number;
  onCellClick?: (data: any) => void;
}

export function GridLayer({ width, height, onCellClick }: GridLayerProps) {
  const { activeGrids, northOrientation, floorplanDimensions, boundaryPoints } = useProject();
  
  let centerX = width / 2;
  let centerY = height / 2;
  let radius = Math.min(width, height) / 2 * 0.9;

  // If boundary points exist, use them for center and radius
  if (boundaryPoints && boundaryPoints.length > 2) {
    const centroid = getPolygonCentroid(boundaryPoints);
    centerX = centroid.x;
    centerY = centroid.y;
    
    // Calculate radius to cover the farthest point of the boundary
    const bounds = getPolygonBounds(boundaryPoints);
    // Use diagonal of bounding box for coverage
    const diagonal = Math.sqrt(bounds.width * bounds.width + bounds.height * bounds.height);
    radius = diagonal / 2 * 1.2; // 20% padding
  } else {
    // Fallback to floorplan dimensions if no boundary
    const fpWidth = floorplanDimensions.width || width;
    const fpHeight = floorplanDimensions.height || height;
    const diagonal = Math.sqrt(fpWidth * fpWidth + fpHeight * fpHeight);
    radius = diagonal / 2 * 1.1;
  }

  const wedges16 = get16ZoneWedges(radius);
  const wedges32 = get32DoorWedges(radius);

  return (
    <>
      <Group x={centerX} y={centerY}>
        {activeGrids.grid16 && (
          <Group rotation={northOrientation}>
            {wedges16.map((wedge, i) => (
              <React.Fragment key={i}>
                <Wedge
                  x={0}
                  y={0}
                  radius={radius}
                  angle={wedge.angle}
                  rotation={wedge.rotation}
                  fill={wedge.color}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth={1}
                  opacity={0.5}
                  onClick={(e) => {
                    e.cancelBubble = true;
                    onCellClick?.(wedge);
                  }}
                  onMouseEnter={(e) => {
                    const container = e.target.getStage()?.container();
                    if (container) container.style.cursor = 'pointer';
                  }}
                  onMouseLeave={(e) => {
                    const container = e.target.getStage()?.container();
                    if (container) container.style.cursor = 'default';
                  }}
                />
                {/* Label */}
                <Text
                  x={Math.cos((wedge.rotation + wedge.angle / 2) * Math.PI / 180) * wedge.labelRadius}
                  y={Math.sin((wedge.rotation + wedge.angle / 2) * Math.PI / 180) * wedge.labelRadius}
                  text={wedge.name}
                  fontSize={24}
                  fontStyle="bold"
                  fill="black"
                  align="center"
                  verticalAlign="middle"
                  listening={false} // Pass clicks through text
                  offsetX={10}
                  offsetY={7}
                />
              </React.Fragment>
            ))}
          </Group>
        )}

        {activeGrids.grid32 && (
          <Group rotation={northOrientation}>
            {wedges32.map((wedge, i) => (
              <React.Fragment key={i}>
                <Wedge
                  x={0}
                  y={0}
                  radius={radius}
                  angle={wedge.angle}
                  rotation={wedge.rotation}
                  fill={wedge.color}
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth={1}
                  opacity={0.7}
                  // Make it a donut/ring
                  innerRadius={radius * 0.85}
                  onClick={(e) => {
                    e.cancelBubble = true;
                    onCellClick?.(wedge);
                  }}
                  onMouseEnter={(e) => {
                    const container = e.target.getStage()?.container();
                    if (container) container.style.cursor = 'pointer';
                  }}
                  onMouseLeave={(e) => {
                    const container = e.target.getStage()?.container();
                    if (container) container.style.cursor = 'default';
                  }}
                />
                {/* Label */}
                <Text
                  x={Math.cos((wedge.rotation + wedge.angle / 2) * Math.PI / 180) * (radius * 0.92)}
                  y={Math.sin((wedge.rotation + wedge.angle / 2) * Math.PI / 180) * (radius * 0.92)}
                  text={wedge.name}
                  fontSize={24}
                  fontStyle="bold"
                  fill="black"
                  align="center"
                  verticalAlign="middle"
                  rotation={wedge.rotation + wedge.angle / 2 + 90} // Rotate text to align with wedge
                  listening={false} // Pass clicks through text
                  offsetX={0}
                  offsetY={0}
                />
              </React.Fragment>
            ))}
          </Group>
        )}
      </Group>

      {/* Square Grids (64/81) */}
      {(activeGrids.grid64 || activeGrids.grid81) && (
        <Group>
          {(() => {
            let bounds;
            if (boundaryPoints && boundaryPoints.length > 2) {
              bounds = getPolygonBounds(boundaryPoints);
            } else {
              const fpWidth = floorplanDimensions.width || width;
              const fpHeight = floorplanDimensions.height || height;
              bounds = { minX: 0, maxX: fpWidth, minY: 0, maxY: fpHeight, width: fpWidth, height: fpHeight };
              // Center it if using default dimensions
              if (!boundaryPoints) {
                  bounds.minX = (width - fpWidth) / 2;
                  bounds.maxX = bounds.minX + fpWidth;
                  bounds.minY = (height - fpHeight) / 2;
                  bounds.maxY = bounds.minY + fpHeight;
              }
            }

            const lines64 = activeGrids.grid64 ? getSquareGrid(bounds, 8) : [];
            const lines81 = activeGrids.grid81 ? getSquareGrid(bounds, 9) : [];

            return (
              <>
                {lines64.map((line, i) => (
                  <Line
                    key={`64-${i}`}
                    points={line.points}
                    stroke="blue"
                    strokeWidth={1}
                    dash={[5, 5]}
                    opacity={0.5}
                  />
                ))}
                {lines81.map((line, i) => (
                  <Line
                    key={`81-${i}`}
                    points={line.points}
                    stroke="red"
                    strokeWidth={1}
                    dash={[2, 2]}
                    opacity={0.5}
                  />
                ))}
              </>
            );
          })()}
        </Group>
      )}
    </>
  );
}
