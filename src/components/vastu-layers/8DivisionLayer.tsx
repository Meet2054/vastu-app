/**
 * Octagon 8 Directions Layer
 *
 * Renders an octagon (8-sided polygon) with 8 main directional divisions.
 * Used for Vedic Vastu 8-division analyses.
 */

import React from "react";
import { Group, Line, Text, Circle as KonvaCircle } from "react-konva";

interface Octagon8DirectionsLayerProps {
  centerX: number;
  centerY: number;
  radius: number;
  northRotation?: number;
  opacity?: number;
  showLabels?: boolean;
  strokeColor?: string;
  labelColor?: string;
}

export const Octagon8DirectionsLayer: React.FC<
  Octagon8DirectionsLayerProps
> = ({
  centerX,
  centerY,
  radius,
  northRotation = 0,
  opacity = 0.7,
  showLabels = true,
  strokeColor = "#4A90E2",
  labelColor = "#2E5C8A",
}) => {
  // 8 main directional divisions (45° each)
  const directions = [
    { angle: 0, label: "N" },
    { angle: 45, label: "NE" },
    { angle: 90, label: "E" },
    { angle: 135, label: "SE" },
    { angle: 180, label: "S" },
    { angle: 225, label: "SW" },
    { angle: 270, label: "W" },
    { angle: 315, label: "NW" },
  ];

  const getPointOnCircle = (angle: number, distance: number) => {
    const adjustedAngle = angle + northRotation - 90;
    const rad = (adjustedAngle * Math.PI) / 180;
    return {
      x: centerX + Math.cos(rad) * distance,
      y: centerY + Math.sin(rad) * distance,
    };
  };

  // Calculate octagon vertices
  const octagonPoints: number[] = [];
  directions.forEach((dir) => {
    const point = getPointOnCircle(dir.angle, radius);
    octagonPoints.push(point.x, point.y);
  });
  // Close the octagon
  const firstPoint = getPointOnCircle(directions[0].angle, radius);
  octagonPoints.push(firstPoint.x, firstPoint.y);

  return (
    <Group opacity={opacity}>
      {/* Octagon perimeter */}
      <Line
        points={octagonPoints}
        stroke={strokeColor}
        strokeWidth={3}
        closed={true}
      />

      {/* 8 radial lines from center to vertices */}
      {directions.map((dir, index) => {
        const outerPoint = getPointOnCircle(dir.angle, radius);

        return (
          <Line
            key={`radial-${index}`}
            points={[centerX, centerY, outerPoint.x, outerPoint.y]}
            stroke={strokeColor}
            strokeWidth={2}
          />
        );
      })}

      {/* Direction labels */}
      {showLabels &&
        directions.map((dir, index) => {
          const labelPoint = getPointOnCircle(dir.angle, radius + 25);

          return (
            <Text
              key={`label-${index}`}
              x={labelPoint.x}
              y={labelPoint.y}
              text={dir.label}
              fontSize={16}
              fill={labelColor}
              fontStyle="bold"
              offsetX={10}
              offsetY={8}
            />
          );
        })}

      {/* Center point */}
      <KonvaCircle x={centerX} y={centerY} radius={5} fill={strokeColor} />
    </Group>
  );
};
