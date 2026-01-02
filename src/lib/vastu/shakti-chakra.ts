/**
 * Shakti Chakra (Energy Flow) Analysis
 * 
 * Measures energy flow intensity from center to periphery using radial divisions.
 * Analyzes area distribution per sector and compares with ideal energy curves.
 */

import { Point, AnalysisResult } from './types';
import { 
  generate32CircleZones, 
  getZonesBySector,
  calculateBoundingBox,
  Circle32Zones,
  CircleZone 
} from './circle-zones';

export interface EnergyRing {
  ringNumber: number; // 1 (innermost) to N (outermost)
  innerRadius: number; // normalized 0-1
  outerRadius: number; // normalized 0-1
  idealEnergy: number; // 0-100 (ideal energy level for this ring)
  actualEnergy: number; // 0-100 (measured energy based on construction)
  variance: number; // difference from ideal
  zones: {
    zone: CircleZone;
    coverage: number; // % of zone covered by boundary
    energyLevel: number; // 0-100
  }[];
}

export interface SectorEnergy {
  sector: string; // North, Northeast, East, etc.
  zones: CircleZone[];
  totalEnergy: number; // 0-100
  idealEnergy: number; // 0-100
  excess: number; // positive = too much energy
  deficiency: number; // positive = too little energy
  flowBalance: number; // 0-100 (100 = perfect)
  recommendations: string[];
}

export interface ShaktiChakraOptions {
  northRotation?: number;
  ringCount?: number; // Number of concentric rings (default 5)
}

export interface ShaktiChakraResult extends AnalysisResult {
  type: 'shakti-chakra';
  data: {
    rings: EnergyRing[];
    sectors: SectorEnergy[];
    overallFlow: number; // 0-100
    energyExcess: string[]; // Directions with excess energy
    energyDeficiency: string[]; // Directions with energy deficiency
    flowImbalance: {
      direction: string;
      issue: string;
      severity: 'high' | 'medium' | 'low';
      remedy: string;
    }[];
    circleZones: Circle32Zones;
  };
}

// Ideal energy distribution by sector (based on Vastu principles)
const IDEAL_SECTOR_ENERGY: Record<string, number> = {
  'North': 70,      // High energy for prosperity
  'Northeast': 95,  // Maximum energy - most sacred
  'East': 80,       // High energy for health and growth
  'Southeast': 60,  // Moderate-high for fire energy
  'South': 40,      // Lower energy, stable
  'Southwest': 30,  // Lowest energy, grounded
  'West': 50,       // Moderate energy
  'Northwest': 60   // Moderate-high for movement
};

// Ideal energy curve from center to periphery
// Center should be relatively open (medium energy)
// Periphery should vary by direction
const IDEAL_RING_ENERGY_BASE = [
  { ring: 1, energy: 50 },  // Center - Brahma sthana (should be open)
  { ring: 2, energy: 60 },  // Inner ring
  { ring: 3, energy: 70 },  // Middle ring
  { ring: 4, energy: 75 },  // Outer-middle ring
  { ring: 5, energy: 80 }   // Outer ring (periphery)
];

/**
 * Check if a point is inside a polygon
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
 * Calculate coverage of a zone at a specific ring
 */
function calculateZoneRingCoverage(
  zone: CircleZone,
  ringInnerRadius: number,
  ringOuterRadius: number,
  centerX: number,
  centerY: number,
  maxRadius: number,
  boundaryPoints: Point[]
): number {
  const samples = 30; // Sample points
  let insideCount = 0;
  let totalCount = 0;
  
  // Sample points in the zone's angular range at this ring's radii
  for (let r = 0; r < samples; r++) {
    const radius = ringInnerRadius + (r / samples) * (ringOuterRadius - ringInnerRadius);
    const actualRadius = radius * maxRadius;
    
    for (let a = 0; a < samples; a++) {
      const angle = zone.startAngle + (a / samples) * (zone.endAngle - zone.startAngle);
      const angleRad = angle * (Math.PI / 180);
      
      const x = centerX + actualRadius * Math.sin(angleRad);
      const y = centerY - actualRadius * Math.cos(angleRad);
      
      totalCount++;
      if (isPointInPolygon({ x, y }, boundaryPoints)) {
        insideCount++;
      }
    }
  }
  
  return totalCount > 0 ? (insideCount / totalCount) * 100 : 0;
}

/**
 * Calculate energy level for a zone based on construction coverage
 * Higher coverage = higher energy (more construction/activity)
 */
function calculateEnergyLevel(coverage: number): number {
  // Energy is directly proportional to coverage
  // 0% coverage = 0 energy (completely open)
  // 100% coverage = 100 energy (completely built)
  return coverage;
}

/**
 * Get ideal energy for a ring, adjusted by direction
 */
function getIdealRingEnergy(
  ringNumber: number,
  zone: CircleZone,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ringCount: number
): number {
  // Base energy from ring position
  const ringIndex = Math.min(ringNumber - 1, IDEAL_RING_ENERGY_BASE.length - 1);
  const baseEnergy = IDEAL_RING_ENERGY_BASE[ringIndex]?.energy || 70;
  
  // Adjust based on direction
  const sectorIdeal = IDEAL_SECTOR_ENERGY[zone.sector] || 60;
  
  // Weight: 60% ring position, 40% direction
  return baseEnergy * 0.6 + sectorIdeal * 0.4;
}

/**
 * Generate Shakti Chakra analysis
 */
export function generateShaktiChakra(
  boundaryPoints: Point[],
  options: ShaktiChakraOptions = {}
): ShaktiChakraResult {
  const {
    northRotation = 0,
    ringCount = 5
  } = options;
  
  if (boundaryPoints.length < 3) {
    throw new Error('At least 3 boundary points required');
  }
  
  const bbox = calculateBoundingBox(boundaryPoints);
  const maxRadius = Math.min(bbox.width, bbox.height) / 2;
  
  const circleZones = generate32CircleZones(
    bbox.centerX,
    bbox.centerY,
    maxRadius,
    northRotation
  );
  
  // Generate concentric rings
  const rings: EnergyRing[] = [];
  
  for (let r = 1; r <= ringCount; r++) {
    const innerRadius = (r - 1) / ringCount;
    const outerRadius = r / ringCount;
    
    const zoneEnergies: EnergyRing['zones'] = [];
    let totalActualEnergy = 0;
    let totalIdealEnergy = 0;
    
    for (const zone of circleZones.zones) {
      const coverage = calculateZoneRingCoverage(
        zone,
        innerRadius,
        outerRadius,
        bbox.centerX,
        bbox.centerY,
        maxRadius,
        boundaryPoints
      );
      
      const energyLevel = calculateEnergyLevel(coverage);
      const idealEnergy = getIdealRingEnergy(r, zone, ringCount);
      
      zoneEnergies.push({
        zone,
        coverage,
        energyLevel
      });
      
      totalActualEnergy += energyLevel;
      totalIdealEnergy += idealEnergy;
    }
    
    const avgActualEnergy = totalActualEnergy / circleZones.zones.length;
    const avgIdealEnergy = totalIdealEnergy / circleZones.zones.length;
    const variance = avgActualEnergy - avgIdealEnergy;
    
    rings.push({
      ringNumber: r,
      innerRadius,
      outerRadius,
      idealEnergy: avgIdealEnergy,
      actualEnergy: avgActualEnergy,
      variance,
      zones: zoneEnergies
    });
  }
  
  // Analyze by sector
  const sectors: SectorEnergy[] = [];
  const energyExcess: string[] = [];
  const energyDeficiency: string[] = [];
  const flowImbalance: ShaktiChakraResult['data']['flowImbalance'] = [];
  
  for (const [sectorName, idealEnergy] of Object.entries(IDEAL_SECTOR_ENERGY)) {
    const sectorZones = getZonesBySector(sectorName, circleZones);
    
    // Calculate total energy across all rings for this sector
    let totalEnergy = 0;
    let sampleCount = 0;
    
    for (const ring of rings) {
      for (const zoneData of ring.zones) {
        if (sectorZones.find(sz => sz.zoneNumber === zoneData.zone.zoneNumber)) {
          totalEnergy += zoneData.energyLevel;
          sampleCount++;
        }
      }
    }
    
    const avgEnergy = sampleCount > 0 ? totalEnergy / sampleCount : 0;
    const excess = Math.max(0, avgEnergy - idealEnergy);
    const deficiency = Math.max(0, idealEnergy - avgEnergy);
    const flowBalance = Math.max(0, 100 - Math.abs(avgEnergy - idealEnergy) * 2);
    
    const recommendations: string[] = [];
    
    if (excess > 20) {
      energyExcess.push(sectorName);
      recommendations.push(`Reduce construction density in ${sectorName}. Create more open space.`);
      
      flowImbalance.push({
        direction: sectorName,
        issue: 'Excess energy/over-construction',
        severity: excess > 40 ? 'high' : excess > 30 ? 'medium' : 'low',
        remedy: `Remove heavy structures, create openings, use calming colors (blues, whites)`
      });
    }
    
    if (deficiency > 20) {
      energyDeficiency.push(sectorName);
      recommendations.push(`Increase presence in ${sectorName}. Add appropriate structures or elements.`);
      
      flowImbalance.push({
        direction: sectorName,
        issue: 'Energy deficiency/under-utilized',
        severity: deficiency > 40 ? 'high' : deficiency > 30 ? 'medium' : 'low',
        remedy: `Add construction, use energizing colors, place active elements`
      });
    }
    
    // Special recommendations for critical sectors
    if (sectorName === 'Northeast' && avgEnergy > 30) {
      recommendations.push(`⚠️ Northeast should be most open and light. Current energy is too high.`);
    }
    
    if (sectorName === 'Southwest' && avgEnergy < 60) {
      recommendations.push(`⚠️ Southwest should be heavy and closed. Current energy is too low.`);
    }
    
    sectors.push({
      sector: sectorName,
      zones: sectorZones,
      totalEnergy: avgEnergy,
      idealEnergy,
      excess,
      deficiency,
      flowBalance,
      recommendations
    });
  }
  
  // Calculate overall flow score
  const overallFlow = sectors.reduce((sum, s) => sum + s.flowBalance, 0) / sectors.length;
  
  return {
    type: 'shakti-chakra',
    timestamp: new Date(),
    boundaryPoints,
    data: {
      rings,
      sectors,
      overallFlow,
      energyExcess,
      energyDeficiency,
      flowImbalance,
      circleZones
    }
  };
}
