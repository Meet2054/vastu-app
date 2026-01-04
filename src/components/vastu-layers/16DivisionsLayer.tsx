/**
 * Circle 16 Divisions Layer
 *
 * Renders a circle with 16 radial divisions.
 * Used for Vedic Vastu 16-division analyses.
 */

import React from "react";
import { Group, Line, Text, Circle as KonvaCircle } from "react-konva";

interface Circle16DivisionsLayerProps {
  centerX: number;
  centerY: number;
  radius: number;
  northRotation?: number;
  opacity?: number;
  showLabels?: boolean;
  strokeColor?: string;
  labelColor?: string;
}

export const Circle16DivisionsLayer: React.FC<Circle16DivisionsLayerProps> = ({
  centerX,
  centerY,
  radius,
  northRotation = 0,
  opacity = 0.7,
  showLabels = true,
  strokeColor = "#8B4513",
  labelColor = "#654321",
}) => {
  // 16 directional divisions (22.5° each)
  const directions = [
    { angle: 0, label: "N" },
    { angle: 22.5, label: "NNE" },
    { angle: 45, label: "NE" },
    { angle: 67.5, label: "ENE" },
    { angle: 90, label: "E" },
    { angle: 112.5, label: "ESE" },
    { angle: 135, label: "SE" },
    { angle: 157.5, label: "SSE" },
    { angle: 180, label: "S" },
    { angle: 202.5, label: "SSW" },
    { angle: 225, label: "SW" },
    { angle: 247.5, label: "WSW" },
    { angle: 270, label: "W" },
    { angle: 292.5, label: "WNW" },
    { angle: 315, label: "NW" },
    { angle: 337.5, label: "NNW" },
  ];

  const getPointOnCircle = (angle: number, distance: number) => {
    const adjustedAngle = angle + northRotation - 90;
    const rad = (adjustedAngle * Math.PI) / 180;
    return {
      x: centerX + Math.cos(rad) * distance,
      y: centerY + Math.sin(rad) * distance,
    };
  };

  return (
    <Group opacity={opacity}>
      {/* Outer circle */}
      <KonvaCircle
        x={centerX}
        y={centerY}
        radius={radius}
        stroke={strokeColor}
        strokeWidth={2}
      />

      {/* 16 radial lines from center to circle edge */}
      {directions.map((dir, index) => {
        const outerPoint = getPointOnCircle(dir.angle, radius);

        return (
          <Line
            key={`radial-${index}`}
            points={[centerX, centerY, outerPoint.x, outerPoint.y]}
            stroke={strokeColor}
            strokeWidth={1.5}
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
              fontSize={14}
              fill={labelColor}
              fontStyle="bold"
              offsetX={15}
              offsetY={7}
            />
          );
        })}

      {/* Center point */}
      <KonvaCircle x={centerX} y={centerY} radius={4} fill={strokeColor} />
    </Group>
  );
};
