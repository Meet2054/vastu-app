/**
 * Common 32-Zone Circle Division Utility
 * 
 * This utility provides functions for dividing a circle into 32 equal zones (11.25° each)
 * aligned to true North. Used by multiple Vastu analysis modules.
 */

import { Point, BoundingBox } from '../../lib/vastu/types';

export interface CircleZone {
  zoneNumber: number; // 1-32
  startAngle: number; // degrees from North (0°)
  endAngle: number; // degrees from North (0°)
  centerAngle: number; // mid-point angle
  direction: string; // N, NNE, NE, ENE, E, ESE, SE, SSE, S, SSW, SW, WSW, W, WNW, NW, NNW
  directionCode: string; // N, N1, N2, N3, NE, E1, E2, E3, etc.
  mainDirection: string; // N, NE, E, SE, S, SW, W, NW (8 cardinal + intercardinal)
  sector: string; // For grouping zones into larger sectors
}

export interface Circle32Zones {
  zones: CircleZone[];
  centerX: number;
  centerY: number;
  radius: number;
  northRotation: number;
}

// 32 directional divisions (11.25° each)
const ZONE_DEFINITIONS = [
  { num: 1, dir: 'N', code: 'N', main: 'N', sector: 'North' },
  { num: 2, dir: 'NNE', code: 'N1', main: 'N', sector: 'North' },
  { num: 3, dir: 'NNE', code: 'N2', main: 'NE', sector: 'Northeast' },
  { num: 4, dir: 'NNE', code: 'N3', main: 'NE', sector: 'Northeast' },
  { num: 5, dir: 'NE', code: 'NE', main: 'NE', sector: 'Northeast' },
  { num: 6, dir: 'NNE', code: 'N6', main: 'NE', sector: 'Northeast' },
  { num: 7, dir: 'NNE', code: 'N7', main: 'NE', sector: 'Northeast' },
  { num: 8, dir: 'NNE', code: 'N8', main: 'E', sector: 'East' },
  { num: 9, dir: 'E', code: 'E', main: 'E', sector: 'East' },
  { num: 10, dir: 'ENE', code: 'E1', main: 'E', sector: 'East' },
  { num: 11, dir: 'ENE', code: 'E2', main: 'E', sector: 'East' },
  { num: 12, dir: 'ENE', code: 'E3', main: 'SE', sector: 'Southeast' },
  { num: 13, dir: 'E', code: 'E4', main: 'SE', sector: 'Southeast' },
  { num: 14, dir: 'ESE', code: 'E5', main: 'SE', sector: 'Southeast' },
  { num: 15, dir: 'ESE', code: 'E6', main: 'SE', sector: 'Southeast' },
  { num: 16, dir: 'ESE', code: 'E7', main: 'SE', sector: 'Southeast' },
  { num: 17, dir: 'SE', code: 'SE', main: 'SE', sector: 'Southeast' },
  { num: 18, dir: 'ESE', code: 'E8', main: 'S', sector: 'South' },
  { num: 19, dir: 'SSE', code: 'S1', main: 'S', sector: 'South' },
  { num: 20, dir: 'SSE', code: 'S2', main: 'S', sector: 'South' },
  { num: 21, dir: 'SSE', code: 'S3', main: 'S', sector: 'South' },
  { num: 22, dir: 'S', code: 'S', main: 'S', sector: 'South' },
  { num: 23, dir: 'SSE', code: 'S4', main: 'SW', sector: 'Southwest' },
  { num: 24, dir: 'SSW', code: 'S5', main: 'SW', sector: 'Southwest' },
  { num: 25, dir: 'SSW', code: 'S6', main: 'SW', sector: 'Southwest' },
  { num: 26, dir: 'SSW', code: 'S7', main: 'SW', sector: 'Southwest' },
  { num: 27, dir: 'SW', code: 'SW', main: 'SW', sector: 'Southwest' },
  { num: 28, dir: 'SSW', code: 'S8', main: 'W', sector: 'West' },
  { num: 29, dir: 'WSW', code: 'W1', main: 'W', sector: 'West' },
  { num: 30, dir: 'WSW', code: 'W2', main: 'W', sector: 'West' },
  { num: 31, dir: 'WSW', code: 'W3', main: 'W', sector: 'West' },
  { num: 32, dir: 'W', code: 'W', main: 'W', sector: 'West' },
  { num: 33, dir: 'WSW', code: 'W4', main: 'NW', sector: 'Northwest' },
  { num: 34, dir: 'WNW', code: 'W5', main: 'NW', sector: 'Northwest' },
  { num: 35, dir: 'WNW', code: 'W6', main: 'NW', sector: 'Northwest' },
  { num: 36, dir: 'NW', code: 'NW', main: 'NW', sector: 'Northwest' },
  { num: 37, dir: 'NNW', code: 'N1', main: 'NW', sector: 'Northwest' },
  { num: 38, dir: 'NNW', code: 'N2', main: 'N', sector: 'North' }
];

/**
 * Generate 32 circular zones aligned to North
 */
export function generate32CircleZones(
  centerX: number,
  centerY: number,
  radius: number,
  northRotation: number = 0
): Circle32Zones {
  const zones: CircleZone[] = [];
  const degreesPerZone = 360 / 32; // 11.25°
  
  for (let i = 0; i < 32; i++) {
    const startAngle = i * degreesPerZone;
    const endAngle = (i + 1) * degreesPerZone;
    const centerAngle = startAngle + degreesPerZone / 2;
    
    const def = ZONE_DEFINITIONS[i];
    
    zones.push({
      zoneNumber: i + 1,
      startAngle: (startAngle + northRotation) % 360,
      endAngle: (endAngle + northRotation) % 360,
      centerAngle: (centerAngle + northRotation) % 360,
      direction: def.dir,
      directionCode: def.code,
      mainDirection: def.main,
      sector: def.sector
    });
  }
  
  return {
    zones,
    centerX,
    centerY,
    radius,
    northRotation
  };
}

/**
 * Find which zone a point belongs to based on angle from center
 */
export function findZoneForPoint(
  pointX: number,
  pointY: number,
  circleZones: Circle32Zones
): CircleZone | null {
  const { centerX, centerY, zones } = circleZones;
  
  // Calculate angle from center
  const dx = pointX - centerX;
  const dy = pointY - centerY;
  
  // Convert to angle (0° = North, clockwise)
  let angle = Math.atan2(dx, -dy) * (180 / Math.PI);
  angle = (angle + 360) % 360;
  
  // Find matching zone
  for (const zone of zones) {
    const start = zone.startAngle;
    const end = zone.endAngle;
    
    // Handle wrap-around at 360°/0°
    if (start <= end) {
      if (angle >= start && angle < end) {
        return zone;
      }
    } else {
      if (angle >= start || angle < end) {
        return zone;
      }
    }
  }
  
  return null;
}

/**
 * Get zone by number (1-32)
 */
export function getZoneByNumber(
  zoneNumber: number,
  circleZones: Circle32Zones
): CircleZone | null {
  return circleZones.zones.find(z => z.zoneNumber === zoneNumber) || null;
}

/**
 * Get all zones belonging to a sector
 */
export function getZonesBySector(
  sector: string,
  circleZones: Circle32Zones
): CircleZone[] {
  return circleZones.zones.filter(z => z.sector === sector);
}

/**
 * Get all zones belonging to a main direction
 */
export function getZonesByMainDirection(
  mainDirection: string,
  circleZones: Circle32Zones
): CircleZone[] {
  return circleZones.zones.filter(z => z.mainDirection === mainDirection);
}

/**
 * Convert angle to zone number
 */
export function angleToZoneNumber(angle: number): number {
  const normalized = ((angle % 360) + 360) % 360;
  const zoneNumber = Math.floor(normalized / 11.25) + 1;
  return zoneNumber > 32 ? 1 : zoneNumber;
}

/**
 * Get cartesian point on circle perimeter at given angle
 */
export function getPointOnCircle(
  centerX: number,
  centerY: number,
  radius: number,
  angle: number
): Point {
  const rad = angle * (Math.PI / 180);
  return {
    x: centerX + radius * Math.sin(rad),
    y: centerY - radius * Math.cos(rad)
  };
}

/**
 * Calculate bounding box from boundary points
 */
export function calculateBoundingBox(points: Point[]): BoundingBox {
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
