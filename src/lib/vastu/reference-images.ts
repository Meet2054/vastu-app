/**
 * Vastu Reference Images
 * 
 * Manages reference images for each Vastu layer type.
 * These images are displayed between the floormap and the chakra overlay.
 */

export type VastuLayerType =
  | "mvastuSquareGrid"
  | "advanceMarma"
  | "shunyabhanti"
  | "shubhDwar"
  | "vpm"
  | "shaktiChakra"
  | "mvastuChakra"
  | "triDoshaDevision"
  | "triGunaDevision"
  | "panchtattvaDevision"
  | "menna"
  | "devtaChinhaAadi"
  | "circleGrid"
  | "seharumukh"
  | "devtaBhojanAadi"
  | "devtaKhanj"
  | "mahuratVichar"
  | "dishaGandh"
  | "nineXNineZones"
  | "devtaBhojan"
  | "nighathuArth"
  | "khanjDhatu"
  | "devtaNighath"
  | "devtaChintha";

export interface VastuReferenceImage {
  layerType: VastuLayerType;
  imagePath: string;
  name: string;
}

/**
 * Reference images for each Vastu layer
 * Place your reference images in public/vastu-references/
 */
export const VASTU_REFERENCE_IMAGES: Record<VastuLayerType, string> = {
  mvastuSquareGrid: "/vastu-references/mvastu-square-grid.png",
  advanceMarma: "/vastu-references/advance-marma.png",
  shunyabhanti: "/vastu-references/shunyabhanti.png",
  shubhDwar: "/vastu-references/shubh-dwar.png",
  vpm: "/vastu-references/vpm.png",
  shaktiChakra: "/vastu-references/shakti-chakra.png",
  mvastuChakra: "/vastu-references/mvastu-chakra.png",
  triDoshaDevision: "/vastu-references/tri-dosha.png",
  triGunaDevision: "/vastu-references/tri-guna.png",
  panchtattvaDevision: "/vastu-references/panchtatva.png",
  menna: "/vastu-references/menna.png",
  devtaChinhaAadi: "/vastu-references/devta-chinha-aadi.png",
  circleGrid: "/vastu-references/circle-grid.png",
  seharumukh: "/vastu-references/seharumukh.png",
  devtaBhojanAadi: "/vastu-references/devta-bhojan-aadi.png",
  devtaKhanj: "/vastu-references/devta-khanj.png",
  mahuratVichar: "/vastu-references/mahurat-vichar.png",
  dishaGandh: "/vastu-references/disha-gandh.png",
  nineXNineZones: "/vastu-references/nine-x-nine-zones.png",
  devtaBhojan: "/vastu-references/devta-bhojan.png",
  nighathuArth: "/vastu-references/nighathu-arth.png",
  khanjDhatu: "/vastu-references/khanj-dhatu.png",
  devtaNighath: "/vastu-references/devta-nighath.png",
  devtaChintha: "/vastu-references/devta-chintha.png",
};

/**
 * Get reference image path for a specific layer type
 */
export function getReferenceImage(layerType: VastuLayerType): string {
  return VASTU_REFERENCE_IMAGES[layerType];
}

/**
 * Get all active reference images based on active layers
 */
export function getActiveReferenceImages(
  activeLayers: Partial<Record<VastuLayerType, boolean>>
): VastuLayerType[] {
  return Object.entries(activeLayers)
    .filter(([_, isActive]) => isActive)
    .map(([layerType]) => layerType as VastuLayerType);
}
