/**
 * M-Vastu Square Grid Analysis
 * 
 * Divides the plot into equal square zones aligned to true North.
 * Each square maps to a specific direction and energetic quality.
 */

import { Point, BoundingBox, ZoneCell, AnalysisResult } from './types';

// 32 directional divisions (based on the image showing 32 divisions)
const DIRECTIONS_32 = [
  { angle: 0, label: 'N', code: 'N' },
  { angle: 11.25, label: 'NNE', code: 'N1' },
  { angle: 22.5, label: 'NNE', code: 'N2' },
  { angle: 33.75, label: 'NNE', code: 'N3' },
  { angle: 45, label: 'NE', code: 'NE' },
  { angle: 56.25, label: 'ENE', code: 'E1' },
  { angle: 67.5, label: 'ENE', code: 'E2' },
  { angle: 78.75, label: 'ENE', code: 'E3' },
  { angle: 90, label: 'E', code: 'E' },
  { angle: 101.25, label: 'ESE', code: 'E4' },
  { angle: 112.5, label: 'ESE', code: 'E5' },
  { angle: 123.75, label: 'ESE', code: 'E6' },
  { angle: 135, label: 'SE', code: 'SE' },
  { angle: 146.25, label: 'SSE', code: 'S1' },
  { angle: 157.5, label: 'SSE', code: 'S2' },
  { angle: 168.75, label: 'SSE', code: 'S3' },
  { angle: 180, label: 'S', code: 'S' },
  { angle: 191.25, label: 'SSW', code: 'S4' },
  { angle: 202.5, label: 'SSW', code: 'S5' },
  { angle: 213.75, label: 'SSW', code: 'S6' },
  { angle: 225, label: 'SW', code: 'SW' },
  { angle: 236.25, label: 'WSW', code: 'W1' },
  { angle: 247.5, label: 'WSW', code: 'W2' },
  { angle: 258.75, label: 'WSW', code: 'W3' },
  { angle: 270, label: 'W', code: 'W' },
  { angle: 281.25, label: 'WNW', code: 'W4' },
  { angle: 292.5, label: 'WNW', code: 'W5' },
  { angle: 303.75, label: 'WNW', code: 'W6' },
  { angle: 315, label: 'NW', code: 'NW' },
  { angle: 326.25, label: 'NNW', code: 'N6' },
  { angle: 337.5, label: 'NNW', code: 'N7' },
  { angle: 348.75, label: 'NNW', code: 'N8' }
];

export interface MVastuSquareGridOptions {
  gridSize?: number; // Default 8x8 or 9x9
  northRotation?: number; // Rotation offset to align to true North (degrees)
  builtAreaThreshold?: number; // % threshold to consider a zone as built
}

export interface MVastuSquareGridResult extends AnalysisResult {
  type: 'mvastu-square-grid';
  data: {
    gridSize: number;
    zones: ZoneCell[];
    imbalances: {
      direction: string;
      builtPercentage: number;
      recommendation: string;
    }[];
    missingZones: ZoneCell[];
    extendedZones: ZoneCell[];
    northRotation: number;
  };
}

/**
 * Calculate bounding box from boundary points
 */
function calculateBoundingBox(points: Point[]): BoundingBox {
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  
  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2
  };
}

/**
 * Get direction for a cell based on its position from center
 */
function getDirectionForCell(
  cellCenterX: number,
  cellCenterY: number,
  plotCenterX: number,
  plotCenterY: number,
  northRotation: number
): { direction: string; directionCode: string } {
  // Calculate angle from center (0° = North, clockwise)
  const dx = cellCenterX - plotCenterX;
  const dy = cellCenterY - plotCenterY;
  
  // Convert to angle (0° = East in standard math, need to convert to North = 0°)
  let angle = Math.atan2(-dy, dx) * (180 / Math.PI); // Negative dy because y increases downward
  angle = 90 - angle; // Convert from East=0 to North=0
  angle = (angle + northRotation + 360) % 360; // Apply north rotation and normalize
  
  // Find closest direction
  let closestDir = DIRECTIONS_32[0];
  let minDiff = Math.abs(angle - closestDir.angle);
  
  for (const dir of DIRECTIONS_32) {
    const diff = Math.min(
      Math.abs(angle - dir.angle),
      Math.abs(angle - (dir.angle + 360)),
      Math.abs(angle - (dir.angle - 360))
    );
    
    if (diff < minDiff) {
      minDiff = diff;
      closestDir = dir;
    }
  }
  
  return {
    direction: closestDir.label,
    directionCode: closestDir.code
  };
}

/**
 * Check if a point is inside a polygon (boundary)
 */
function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    
    const intersect = ((yi > point.y) !== (yj > point.y))
      && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Calculate built area percentage for a cell
 */
function calculateBuiltAreaPercentage(
  cellX: number,
  cellY: number,
  cellWidth: number,
  cellHeight: number,
  boundaryPoints: Point[]
): number {
  // Sample points within the cell to estimate built area
  const samplePoints = 20; // 20x20 grid
  let insideCount = 0;
  
  for (let i = 0; i < samplePoints; i++) {
    for (let j = 0; j < samplePoints; j++) {
      const x = cellX + (i / samplePoints) * cellWidth;
      const y = cellY + (j / samplePoints) * cellHeight;
      
      if (isPointInPolygon({ x, y }, boundaryPoints)) {
        insideCount++;
      }
    }
  }
  
  return (insideCount / (samplePoints * samplePoints)) * 100;
}

/**
 * Generate M-Vastu Square Grid analysis
 */
export function generateMVastuSquareGrid(
  boundaryPoints: Point[],
  options: MVastuSquareGridOptions = {}
): MVastuSquareGridResult {
  const {
    gridSize = 8,
    northRotation = 0,
    builtAreaThreshold = 10
  } = options;
  
  if (boundaryPoints.length < 3) {
    throw new Error('At least 3 boundary points required');
  }
  
  const bbox = calculateBoundingBox(boundaryPoints);
  const cellWidth = bbox.width / gridSize;
  const cellHeight = bbox.height / gridSize;
  
  const zones: ZoneCell[] = [];
  const missingZones: ZoneCell[] = [];
  const extendedZones: ZoneCell[] = [];
  
  // Generate grid cells
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x = bbox.minX + col * cellWidth;
      const y = bbox.minY + row * cellHeight;
      const cellCenterX = x + cellWidth / 2;
      const cellCenterY = y + cellHeight / 2;
      
      const { direction, directionCode } = getDirectionForCell(
        cellCenterX,
        cellCenterY,
        bbox.centerX,
        bbox.centerY,
        northRotation
      );
      
      const builtArea = calculateBuiltAreaPercentage(
        x, y, cellWidth, cellHeight, boundaryPoints
      );
      const emptyArea = 100 - builtArea;
      
      const isMissing = builtArea < builtAreaThreshold;
      const isExtended = builtArea > 90;
      const isBalanced = builtArea >= 30 && builtArea <= 70;
      
      const zone: ZoneCell = {
        row,
        col,
        x,
        y,
        width: cellWidth,
        height: cellHeight,
        direction,
        directionCode,
        builtArea,
        emptyArea,
        isBalanced,
        isMissing,
        isExtended
      };
      
      zones.push(zone);
      
      if (isMissing) missingZones.push(zone);
      if (isExtended) extendedZones.push(zone);
    }
  }
  
  // Calculate imbalances by direction
  const directionStats = new Map<string, { total: number; built: number }>();
  
  for (const zone of zones) {
    const stats = directionStats.get(zone.direction) || { total: 0, built: 0 };
    stats.total += 1;
    stats.built += zone.builtArea / 100;
    directionStats.set(zone.direction, stats);
  }
  
  const imbalances = Array.from(directionStats.entries()).map(([direction, stats]) => {
    const builtPercentage = (stats.built / stats.total) * 100;
    let recommendation = '';
    
    if (builtPercentage < 20) {
      recommendation = `${direction} direction is highly deficient. Consider adding construction or elements in this zone.`;
    } else if (builtPercentage > 80) {
      recommendation = `${direction} direction is over-built. Consider creating open space or removing obstructions.`;
    } else if (builtPercentage < 40) {
      recommendation = `${direction} direction could benefit from more substantial construction.`;
    } else if (builtPercentage > 60) {
      recommendation = `${direction} direction has good coverage but monitor for over-construction.`;
    } else {
      recommendation = `${direction} direction is well-balanced.`;
    }
    
    return {
      direction,
      builtPercentage,
      recommendation
    };
  });
  
  return {
    type: 'mvastu-square-grid',
    timestamp: new Date(),
    boundaryPoints,
    data: {
      gridSize,
      zones,
      imbalances,
      missingZones,
      extendedZones,
      northRotation
    }
  };
}
