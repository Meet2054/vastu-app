/**
 * Circle 32 Division Layer - Common Base Layer
 *
 * Renders the standard 32-division chakra used across all Vastu analyses.
 * This provides the foundational directional framework.
 */

import React from "react";
import { Group, Circle as KonvaCircle, Line, Text } from "react-konva";

interface Circle32DivisionLayerProps {
  centerX: number;
  centerY: number;
  radius: number;
  northRotation?: number;
  opacity?: number;
  showLabels?: boolean;
  strokeColor?: string;
  labelColor?: string;
}

export const Circle32DivisionLayer: React.FC<Circle32DivisionLayerProps> = ({
  centerX,
  centerY,
  radius,
  northRotation = 0,
  opacity = 0.6,
  showLabels = true,
  strokeColor = "#FF69B4",
  labelColor = "#FF1493",
}) => {
  // 32 directional divisions with proper naming (starts from N5 at 0°)
  const directions = [
    { angle: 0, label: "N (N5)" },
    { angle: 11.25, label: "NNE (N6)" },
    { angle: 22.5, label: "NNE (N7)" },
    { angle: 33.75, label: "NNE (N8)" },
    { angle: 45, label: "NE (E1)" },
    { angle: 56.25, label: "ENE (E2)" },
    { angle: 67.5, label: "ENE (E3)" },
    { angle: 78.75, label: "ENE (E4)" },
    { angle: 90, label: "E (E5)" },
    { angle: 101.25, label: "ESE (E6)" },
    { angle: 112.5, label: "ESE (E7)" },
    { angle: 123.75, label: "ESE (E8)" },
    { angle: 135, label: "SE (S1)" },
    { angle: 146.25, label: "SSE (S2)" },
    { angle: 157.5, label: "SSE (S3)" },
    { angle: 168.75, label: "SSE (S4)" },
    { angle: 180, label: "S (S5)" },
    { angle: 191.25, label: "SSW (S6)" },
    { angle: 202.5, label: "SSW (S7)" },
    { angle: 213.75, label: "SSW (S8)" },
    { angle: 225, label: "SW (W1)" },
    { angle: 236.25, label: "WSW (W2)" },
    { angle: 247.5, label: "WSW (W3)" },
    { angle: 258.75, label: "WSW (W4)" },
    { angle: 270, label: "W (W5)" },
    { angle: 281.25, label: "WNW (W6)" },
    { angle: 292.5, label: "WNW (W7)" },
    { angle: 303.75, label: "WNW (W8)" },
    { angle: 315, label: "NW (N1)" },
    { angle: 326.25, label: "NNW (N2)" },
    { angle: 337.5, label: "NNW (N3)" },
    { angle: 348.75, label: "NNW (N4)" },
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

      {/* 32 radial lines */}
      {directions.map((dir, index) => {
        const innerPoint = getPointOnCircle(dir.angle, 0);
        const outerPoint = getPointOnCircle(dir.angle, radius);

        return (
          <Line
            key={`radial-${index}`}
            points={[innerPoint.x, innerPoint.y, outerPoint.x, outerPoint.y]}
            stroke={strokeColor}
            strokeWidth={1}
          />
        );
      })}

      {/* Direction labels */}
      {showLabels &&
        directions.map((dir, index) => {
          const labelPoint = getPointOnCircle(dir.angle, radius + 20);

          return (
            <Text
              key={`label-${index}`}
              x={labelPoint.x}
              y={labelPoint.y}
              text={dir.label}
              fontSize={12}
              fill={labelColor}
              fontStyle="bold"
              offsetX={15}
              offsetY={6}
            />
          );
        })}

      {/* Center point */}
      <KonvaCircle x={centerX} y={centerY} radius={4} fill={strokeColor} />
    </Group>
  );
};
