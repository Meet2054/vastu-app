/**
 * Common types for Vastu analysis modules
 */

export interface Point {
  x: number;
  y: number;
}

export interface BoundingBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export interface Direction {
  name: string;
  angle: number; // degrees from North (0°)
  label: string; // N, NE, E, SE, S, SW, W, NW, etc.
}

export interface ZoneCell {
  row: number;
  col: number;
  x: number;
  y: number;
  width: number;
  height: number;
  direction: string;
  directionCode: string; // N1, NE2, E3, etc.
  builtArea: number; // percentage
  emptyArea: number; // percentage
  isBalanced: boolean;
  isMissing: boolean;
  isExtended: boolean;
}

export interface MarmaPoint {
  id: string;
  name: string;
  angle: number; // polar angle from North (degrees)
  distance: number; // distance from center (0-1, normalized)
  x: number; // calculated cartesian coordinates
  y: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  isAffected: boolean;
  affectedBy?: string[]; // types of overlaps: 'wall', 'toilet', 'pillar', 'stairs'
  severityScore: number; // 0-100
}

export interface AnalysisResult {
  type: string;
  timestamp: Date;
  boundaryPoints: Point[];
  data: any;
}
