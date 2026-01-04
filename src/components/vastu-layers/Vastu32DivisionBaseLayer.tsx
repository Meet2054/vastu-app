/**
 * Vastu Base Layer with Reference Image
 *
 * Combines the reference image with the 32-division chakra.
 * This creates the base visualization for all Vastu layers.
 */

import React from "react";
import { Group, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { Circle32DivisionLayer } from "./32DivisionLayer";
import { VastuLayerType } from "../../lib/vastu/reference-images";

interface VastuBaseLayerProps {
  layerType: VastuLayerType;
  referenceImagePath: string;
  centerX: number;
  centerY: number;
  radius: number;
  northRotation?: number;
  opacity?: number;
  showChakra?: boolean;
  showLabels?: boolean;
}

export const VastuBaseLayer: React.FC<VastuBaseLayerProps> = ({
  referenceImagePath,
  centerX,
  centerY,
  radius,
  northRotation = 0,
  opacity = 0.6,
  showChakra = true,
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
          opacity={opacity * 0.5} // Make reference image semi-transparent
          rotation={northRotation}
        />
      )}

      {/* 32 Division Chakra Layer */}
      {showChakra && (
        <Circle32DivisionLayer
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
