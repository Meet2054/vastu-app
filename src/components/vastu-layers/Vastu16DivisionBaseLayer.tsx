/**
 * Vastu 16-Division Base Layer
 *
 * Combines reference image with square 16-divisions layer.
 * Used for Vedic Vastu 16-division analyses.
 */

import React from "react";
import { Group, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { Circle16DivisionsLayer } from "./16DivisionsLayer";
import { VastuLayerType } from "../../lib/vastu/reference-images";

interface Vastu16DivisionBaseLayerProps {
  layerType: VastuLayerType;
  referenceImagePath: string;
  centerX: number;
  centerY: number;
  radius: number;
  northRotation?: number;
  opacity?: number;
  showLabels?: boolean;
}

export const Vastu16DivisionBaseLayer: React.FC<
  Vastu16DivisionBaseLayerProps
> = ({
  referenceImagePath,
  centerX,
  centerY,
  radius,
  northRotation = 0,
  opacity = 0.6,
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

      {/* Circle 16 Divisions Layer */}
      <Circle16DivisionsLayer
        centerX={centerX}
        centerY={centerY}
        radius={radius}
        northRotation={northRotation}
        opacity={opacity}
        showLabels={showLabels}
      />
    </Group>
  );
};
