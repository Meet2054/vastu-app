/**
 * Circle 32 Zones Layer - Konva Component
 *
 * Renders a circle divided into 32 equal zones (11.25° each) aligned to North.
 * Used by multiple Vastu analysis visualizations.
 */

import React from "react";
import { Group, Circle as KonvaCircle, Line, Text, Arc } from "react-konva";
import { Circle32Zones, CircleZone } from "../../lib/vastu/circle-zones";

interface Circle32ZonesLayerProps {
  circleZones: Circle32Zones;
  highlightedZones?: number[]; // Zone numbers to highlight
  highlightColor?: string;
  showLabels?: boolean;
  showZoneNumbers?: boolean;
  opacity?: number;
}

export const Circle32ZonesLayer: React.FC<Circle32ZonesLayerProps> = ({
  circleZones,
  highlightedZones = [],
  highlightColor = "rgba(255, 200, 0, 0.3)",
  showLabels = true,
  showZoneNumbers = false,
  opacity = 0.6,
}) => {
  const { centerX, centerY, radius, zones } = circleZones;

  // Helper to convert angle to radians
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  // Helper to get point on circle
  const getPointOnCircle = (angle: number, r: number) => ({
    x: centerX + r * Math.sin(toRadians(angle)),
    y: centerY - r * Math.cos(toRadians(angle)),
  });

  // Get color for a zone
  const getZoneColor = (zone: CircleZone): string => {
    if (highlightedZones.includes(zone.zoneNumber)) {
      return highlightColor;
    }

    // Default color by sector
    const sectorColors: Record<string, string> = {
      North: "rgba(100, 150, 255, 0.2)",
      Northeast: "rgba(255, 255, 100, 0.2)",
      East: "rgba(150, 255, 150, 0.2)",
      Southeast: "rgba(255, 150, 100, 0.2)",
      South: "rgba(255, 100, 100, 0.2)",
      Southwest: "rgba(200, 150, 100, 0.2)",
      West: "rgba(200, 200, 200, 0.2)",
      Northwest: "rgba(180, 180, 220, 0.2)",
    };

    return sectorColors[zone.sector] || "rgba(200, 200, 200, 0.2)";
  };

  return (
    <Group opacity={opacity}>
      {/* Outer circle */}
      <KonvaCircle
        x={centerX}
        y={centerY}
        radius={radius}
        stroke="black"
        strokeWidth={2}
        fill="transparent"
      />

      {/* Radial lines dividing 32 zones */}
      {zones.map((zone) => {
        const angle = zone.startAngle;
        const outerPoint = getPointOnCircle(angle, radius);

        return (
          <Line
            key={`radial-${zone.zoneNumber}`}
            points={[centerX, centerY, outerPoint.x, outerPoint.y]}
            stroke="black"
            strokeWidth={1}
            opacity={0.5}
          />
        );
      })}

      {/* Zone fills (arcs) */}
      {zones.map((zone) => {
        // For filled zones, we'll use wedge shapes

        return (
          <Arc
            key={`arc-${zone.zoneNumber}`}
            x={centerX}
            y={centerY}
            innerRadius={0}
            outerRadius={radius}
            angle={zone.endAngle - zone.startAngle}
            rotation={zone.startAngle}
            fill={getZoneColor(zone)}
            stroke="transparent"
          />
        );
      })}

      {/* Concentric circles for reference */}
      {[0.33, 0.66].map((ratio, index) => (
        <KonvaCircle
          key={`circle-${index}`}
          x={centerX}
          y={centerY}
          radius={radius * ratio}
          stroke="gray"
          strokeWidth={1}
          opacity={0.3}
          dash={[5, 5]}
        />
      ))}

      {/* Direction labels */}
      {showLabels &&
        zones
          .filter((z) => z.zoneNumber % 4 === 1)
          .map((zone) => {
            const labelRadius = radius * 1.1;
            const labelPoint = getPointOnCircle(zone.centerAngle, labelRadius);

            return (
              <Text
                key={`label-${zone.zoneNumber}`}
                x={labelPoint.x}
                y={labelPoint.y}
                text={zone.direction}
                fontSize={14}
                fontStyle="bold"
                fill="black"
                align="center"
                verticalAlign="middle"
                offsetX={20}
                offsetY={10}
              />
            );
          })}

      {/* Zone numbers */}
      {showZoneNumbers &&
        zones.map((zone) => {
          const numberRadius = radius * 0.85;
          const numberPoint = getPointOnCircle(zone.centerAngle, numberRadius);

          return (
            <Text
              key={`number-${zone.zoneNumber}`}
              x={numberPoint.x}
              y={numberPoint.y}
              text={zone.zoneNumber.toString()}
              fontSize={10}
              fill="black"
              align="center"
              verticalAlign="middle"
              offsetX={10}
              offsetY={8}
            />
          );
        })}

      {/* Cardinal direction markers (larger) */}
      {[
        { angle: 0, label: "N", color: "blue" },
        { angle: 90, label: "E", color: "green" },
        { angle: 180, label: "S", color: "red" },
        { angle: 270, label: "W", color: "gray" },
      ].map((cardinal) => {
        const markerPoint = getPointOnCircle(cardinal.angle, radius * 1.15);

        return (
          <React.Fragment key={`cardinal-${cardinal.label}`}>
            <KonvaCircle
              x={markerPoint.x}
              y={markerPoint.y}
              radius={8}
              fill={cardinal.color}
              opacity={0.7}
            />
            <Text
              x={markerPoint.x}
              y={markerPoint.y}
              text={cardinal.label}
              fontSize={12}
              fontStyle="bold"
              fill="white"
              align="center"
              verticalAlign="middle"
              offsetX={6}
              offsetY={8}
            />
          </React.Fragment>
        );
      })}

      {/* Center point */}
      <KonvaCircle x={centerX} y={centerY} radius={4} fill="black" />
    </Group>
  );
};

export default Circle32ZonesLayer;
