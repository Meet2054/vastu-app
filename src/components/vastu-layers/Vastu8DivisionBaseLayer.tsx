/**
 * Vastu 8-Division Base Layer
 *
 * Combines reference image with octagon 8-directions layer.
 * Used for Vedic Vastu 8-division analyses.
 */

import React from "react";
import { Group, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { Octagon8DirectionsLayer } from "./8DivisionLayer";
import { VastuLayerType } from "../../lib/vastu/reference-images";

interface Vastu8DivisionBaseLayerProps {
  layerType: VastuLayerType;
  referenceImagePath: string;
  centerX: number;
  centerY: number;
  radius: number;
  northRotation?: number;
  opacity?: number;
  showOctagon?: boolean;
  showLabels?: boolean;
}

export const Vastu8DivisionBaseLayer: React.FC<
  Vastu8DivisionBaseLayerProps
> = ({
  referenceImagePath,
  centerX,
  centerY,
  radius,
  northRotation = 0,
  opacity = 0.6,
  showOctagon = true,
  showLabels = true,
}) => {
  const [referenceImage] = useImage(referenceImagePath);

  return (
    <Group>
      {/* Reference Image Layer */}
      {referenceImage && (
        <KonvaImage
          image={referenceImage}
          x={centerX}
          y={centerY}
          offsetX={referenceImage.width / 2}
          offsetY={referenceImage.height / 2}
          width={radius * 2}
          height={radius * 2}
          opacity={opacity * 0.5}
          rotation={northRotation}
        />
      )}

      {/* Octagon 8 Directions Layer */}
      {showOctagon && (
        <Octagon8DirectionsLayer
          centerX={centerX}
          centerY={centerY}
          radius={radius}
          northRotation={northRotation}
          opacity={opacity}
          showLabels={showLabels}
        />
      )}
    </Group>
  );
};
