import React from "react";
import { Group, Rect, Text, Line } from "react-konva";
import { VastuGrid } from "../../lib/vastu-analysis";

interface VastuGridLayerProps {
  grid: VastuGrid;
  boundaryPoints: { x: number; y: number }[];
  opacity?: number;
}

export function VastuGridLayer({
  grid,
  boundaryPoints,
  opacity = 0.3,
}: VastuGridLayerProps) {
  if (!boundaryPoints || boundaryPoints.length < 3) return null;

  // Calculate bounding box
  const minX = Math.min(...boundaryPoints.map((p) => p.x));
  const maxX = Math.max(...boundaryPoints.map((p) => p.x));
  const minY = Math.min(...boundaryPoints.map((p) => p.y));
  const maxY = Math.max(...boundaryPoints.map((p) => p.y));

  const width = maxX - minX;
  const height = maxY - minY;

  const cellWidth = width / grid.cols;
  const cellHeight = height / grid.rows;

  return (
    <Group>
      {/* Draw grid cells */}
      {grid.zones.map((zone, index) => {
        const x = minX + zone.col * cellWidth;
        const y = minY + zone.row * cellHeight;

        return (
          <Group key={index}>
            {/* Cell background */}
            <Rect
              x={x}
              y={y}
              width={cellWidth}
              height={cellHeight}
              fill={zone.color || "#F5F5F5"}
              opacity={opacity}
              stroke="#666"
              strokeWidth={1}
            />

            {/* Cell text - deity or name */}
            {zone.deity && (
              <Text
                x={x}
                y={y + cellHeight / 2 - 10}
                width={cellWidth}
                text={zone.deity}
                fontSize={Math.min(cellWidth, cellHeight) / 6}
                fontStyle="bold"
                fill="#000"
                align="center"
              />
            )}

            {/* Cell text - element or property */}
            {(zone.element || zone.property) && (
              <Text
                x={x}
                y={y + cellHeight / 2 + 5}
                width={cellWidth}
                text={zone.element || zone.property}
                fontSize={Math.min(cellWidth, cellHeight) / 8}
                fill="#333"
                align="center"
              />
            )}
          </Group>
        );
      })}

      {/* Draw grid lines */}
      {Array.from({ length: grid.rows + 1 }).map((_, i) => (
        <Line
          key={`h-${i}`}
          points={[minX, minY + i * cellHeight, maxX, minY + i * cellHeight]}
          stroke="#666"
          strokeWidth={i === 0 || i === grid.rows ? 2 : 1}
        />
      ))}

      {Array.from({ length: grid.cols + 1 }).map((_, i) => (
        <Line
          key={`v-${i}`}
          points={[minX + i * cellWidth, minY, minX + i * cellWidth, maxY]}
          stroke="#666"
          strokeWidth={i === 0 || i === grid.cols ? 2 : 1}
        />
      ))}
    </Group>
  );
}
