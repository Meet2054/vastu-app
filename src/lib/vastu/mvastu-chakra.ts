/**
 * M-Vastu Chakra (Circular Energy Interpretation)
 * 
 * A circular energy interpretation combining direction and movement.
 * Uses circular zoning instead of square grids, analyzing rooms by 
 * circular sectors and angular dominance.
 */

import { Point, AnalysisResult } from './types';
import { 
  generate32CircleZones, 
  getZonesByMainDirection,
  calculateBoundingBox,
  Circle32Zones,
  CircleZone 
} from './circle-zones';

export interface ChakraRing {
  ringNumber: number; // 1 (innermost) to N (outermost)
  name: string; // Ring name (Core, Inner, Middle, Outer, Peripheral)
  innerRadius: number; // normalized 0-1
  outerRadius: number; // normalized 0-1
  idealUsage: string[]; // Recommended room types
  prohibitedUsage: string[]; // Forbidden room types
  energyQuality: string; // Energy description
  zones: {
    zone: CircleZone;
    coverage: number; // % covered by boundary
    currentUsage?: string;
    harmonyScore: number; // 0-100
  }[];
}

export interface DirectionalDominance {
  direction: string; // N, NE, E, SE, S, SW, W, NW
  dominanceScore: number; // 0-100 (how much this direction influences the space)
  angularWeight: number; // Angular coverage (0-360°)
  areaWeight: number; // Area percentage
  isBalanced: boolean;
  recommendations: string[];
}

export interface RoomPlacement {
  roomType: string;
  suggestedZones: number[]; // Zone numbers where this room should be
  currentZone?: number;
  harmonyScore: number; // 0-100
  reasoning: string;
}

export interface MVastuChakraOptions {
  northRotation?: number;
  ringCount?: number; // Default 4
  roomUsage?: Map<number, string>; // Zone number -> room type
}

export interface MVastuChakraResult extends AnalysisResult {
  type: 'mvastu-chakra';
  data: {
    rings: ChakraRing[];
    directionalDominance: DirectionalDominance[];
    circularHarmonyScore: number; // 0-100
    movementFlow: {
      direction: string;
      flowQuality: 'excellent' | 'good' | 'moderate' | 'poor';
      blockages: string[];
    }[];
    roomPlacements: RoomPlacement[];
    recommendations: string[];
    circleZones: Circle32Zones;
  };
}

// Ring definitions with ideal characteristics
const CHAKRA_RING_DEFINITIONS = [
  {
    name: 'Core (Brahmasthana)',
    idealUsage: ['Courtyard', 'Open Space', 'Puja Room', 'Hall'],
    prohibitedUsage: ['Toilet', 'Kitchen', 'Storage', 'Heavy Furniture', 'Bedroom'],
    energyQuality: 'Divine center - should be light, open, and sacred'
  },
  {
    name: 'Inner Ring',
    idealUsage: ['Living Room', 'Prayer Room', 'Study', 'Hall'],
    prohibitedUsage: ['Toilet', 'Heavy Storage', 'Garage'],
    energyQuality: 'Sacred inner space - clean and elevated activities'
  },
  {
    name: 'Middle Ring',
    idealUsage: ['Living Room', 'Dining', 'Bedroom', 'Study', 'Kitchen (SE only)'],
    prohibitedUsage: ['Heavy Storage', 'Waste'],
    energyQuality: 'Active living space - balanced energy'
  },
  {
    name: 'Outer Ring',
    idealUsage: ['Bedroom', 'Kitchen', 'Study', 'Storage', 'Entrance'],
    prohibitedUsage: ['Toilet (except NW)', 'Heavy loads (except SW)'],
    energyQuality: 'Functional periphery - direction-specific usage'
  }
];

// Ideal room placements by direction
const ROOM_DIRECTION_MAP: Record<string, {
  directions: string[];
  reasoning: string;
  zones: number[]; // Zone numbers (1-32)
}> = {
  'Master Bedroom': {
    directions: ['SW'],
    reasoning: 'Southwest promotes stability, rest, and authority',
    zones: [23, 24, 25, 26, 27] // SW zones
  },
  'Children Bedroom': {
    directions: ['W', 'NW'],
    reasoning: 'West and Northwest support growth and learning',
    zones: [29, 30, 31, 32, 33, 34, 35] // W, NW zones
  },
  'Kitchen': {
    directions: ['SE'],
    reasoning: 'Southeast is the fire corner (Agni), ideal for kitchen',
    zones: [13, 14, 15, 16, 17] // SE zones
  },
  'Puja Room': {
    directions: ['NE'],
    reasoning: 'Northeast is most sacred direction (Ishanya)',
    zones: [5, 6, 7] // NE zones
  },
  'Living Room': {
    directions: ['N', 'E', 'NE'],
    reasoning: 'North and East receive positive energy and light',
    zones: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] // N, NE, E zones
  },
  'Study Room': {
    directions: ['NE', 'E', 'N'],
    reasoning: 'Northeast and East enhance concentration and knowledge',
    zones: [1, 2, 3, 4, 5, 6, 7, 8, 9] // NE, E, N zones
  },
  'Dining Room': {
    directions: ['W', 'E'],
    reasoning: 'West or East promote healthy eating habits',
    zones: [9, 10, 11, 12, 29, 30, 31, 32] // E or W zones
  },
  'Bathroom': {
    directions: ['NW', 'W'],
    reasoning: 'Northwest is ideal for water drainage',
    zones: [32, 33, 34, 35, 36] // NW, W zones
  },
  'Store Room': {
    directions: ['SW', 'W'],
    reasoning: 'Southwest for heavy storage, supports stability',
    zones: [23, 24, 25, 26, 27, 28, 29] // SW, W zones
  },
  'Entrance': {
    directions: ['N', 'NE', 'E'],
    reasoning: 'North, Northeast, and East are auspicious entry directions',
    zones: [1, 2, 3, 4, 5, 6, 7, 8, 9] // N, NE, E zones
  }
};

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
  const samples = 25;
  let insideCount = 0;
  let totalCount = 0;
  
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
 * Calculate harmony score for a zone based on usage
 */
function calculateZoneHarmonyScore(
  zone: CircleZone,
  ring: ChakraRing,
  usage?: string
): number {
  if (!usage) return 70; // Neutral if no usage specified
  
  const usageLower = usage.toLowerCase();
  
  // Check if usage is ideal for this ring
  const isIdeal = ring.idealUsage.some(ideal => 
    usageLower.includes(ideal.toLowerCase())
  );
  
  if (isIdeal) return 95;
  
  // Check if usage is prohibited
  const isProhibited = ring.prohibitedUsage.some(prohibited => 
    usageLower.includes(prohibited.toLowerCase())
  );
  
  if (isProhibited) {
    // Center rings are more critical
    if (ring.ringNumber === 1) return 10; // Critical violation
    if (ring.ringNumber === 2) return 30; // High severity
    return 50; // Moderate
  }
  
  // Check directional appropriateness
  for (const [roomType, config] of Object.entries(ROOM_DIRECTION_MAP)) {
    if (usageLower.includes(roomType.toLowerCase())) {
      const isCorrectDirection = config.zones.includes(zone.zoneNumber);
      return isCorrectDirection ? 85 : 60;
    }
  }
  
  return 70; // Acceptable
}

/**
 * Calculate directional dominance
 */
function calculateDirectionalDominance(
  direction: string,
  zones: CircleZone[],
  rings: ChakraRing[]
): DirectionalDominance {
  // Calculate angular weight (degrees covered)
  const angularWeight = zones.length * (360 / 32);
  
  // Calculate area weight (percentage of total covered area)
  let totalCoverage = 0;
  let sampleCount = 0;
  
  for (const ring of rings) {
    for (const zoneData of ring.zones) {
      if (zones.find(z => z.zoneNumber === zoneData.zone.zoneNumber)) {
        totalCoverage += zoneData.coverage;
        sampleCount++;
      }
    }
  }
  
  const areaWeight = sampleCount > 0 ? totalCoverage / sampleCount : 0;
  
  // Dominance score combines angular and area weights
  const dominanceScore = (angularWeight / 360) * 50 + (areaWeight / 100) * 50;
  
  // Check if balanced (ideal is 12.5% for each of 8 directions)
  const idealDominance = 12.5;
  const isBalanced = Math.abs(dominanceScore - idealDominance) < 5;
  
  const recommendations: string[] = [];
  
  if (dominanceScore < 8) {
    recommendations.push(`${direction} is under-represented. Consider expanding construction in this direction.`);
  } else if (dominanceScore > 18) {
    recommendations.push(`${direction} is over-dominant. Balance with other directions.`);
  }
  
  return {
    direction,
    dominanceScore,
    angularWeight,
    areaWeight,
    isBalanced,
    recommendations
  };
}

/**
 * Analyze movement flow quality
 */
function analyzeMovementFlow(
  direction: string,
  zones: CircleZone[],
  rings: ChakraRing[]
): {
  direction: string;
  flowQuality: 'excellent' | 'good' | 'moderate' | 'poor';
  blockages: string[];
} {
  const blockages: string[] = [];
  let flowScore = 100;
  
  // Check if inner rings are blocked in this direction
  for (const ring of rings.slice(0, 2)) { // Check first 2 rings
    const dirZones = ring.zones.filter(z => 
      zones.find(dz => dz.zoneNumber === z.zone.zoneNumber)
    );
    
    for (const zoneData of dirZones) {
      if (zoneData.coverage > 80) {
        blockages.push(`${ring.name} is blocked in ${direction}`);
        flowScore -= 20;
      }
    }
  }
  
  // Special checks for auspicious directions
  if (['N', 'NE', 'E'].includes(direction)) {
    if (blockages.length > 0) {
      flowScore -= 10;
      blockages.push(`Auspicious direction ${direction} should be more open`);
    }
  }
  
  const flowQuality: 'excellent' | 'good' | 'moderate' | 'poor' = 
    flowScore >= 90 ? 'excellent' :
    flowScore >= 70 ? 'good' :
    flowScore >= 50 ? 'moderate' : 'poor';
  
  return { direction, flowQuality, blockages };
}

/**
 * Generate M-Vastu Chakra analysis
 */
export function generateMVastuChakra(
  boundaryPoints: Point[],
  options: MVastuChakraOptions = {}
): MVastuChakraResult {
  const {
    northRotation = 0,
    ringCount = 4,
    roomUsage = new Map()
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
  
  // Generate rings
  const rings: ChakraRing[] = [];
  
  for (let r = 1; r <= ringCount; r++) {
    const innerRadius = (r - 1) / ringCount;
    const outerRadius = r / ringCount;
    const ringDef = CHAKRA_RING_DEFINITIONS[Math.min(r - 1, CHAKRA_RING_DEFINITIONS.length - 1)];
    
    const zoneData: ChakraRing['zones'] = [];
    
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
      
      const usage = roomUsage.get(zone.zoneNumber);
      const harmonyScore = calculateZoneHarmonyScore(
        zone,
        { ringNumber: r, ...ringDef } as ChakraRing,
        usage
      );
      
      zoneData.push({
        zone,
        coverage,
        currentUsage: usage,
        harmonyScore
      });
    }
    
    rings.push({
      ringNumber: r,
      name: ringDef.name,
      innerRadius,
      outerRadius,
      idealUsage: ringDef.idealUsage,
      prohibitedUsage: ringDef.prohibitedUsage,
      energyQuality: ringDef.energyQuality,
      zones: zoneData
    });
  }
  
  // Calculate directional dominance
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const directionalDominance: DirectionalDominance[] = directions.map(dir => {
    const zones = getZonesByMainDirection(dir, circleZones);
    return calculateDirectionalDominance(dir, zones, rings);
  });
  
  // Analyze movement flow
  const movementFlow = directions.map(dir => {
    const zones = getZonesByMainDirection(dir, circleZones);
    return analyzeMovementFlow(dir, zones, rings);
  });
  
  // Calculate circular harmony score
  let totalHarmony = 0;
  let zoneCount = 0;
  
  for (const ring of rings) {
    for (const zoneData of ring.zones) {
      totalHarmony += zoneData.harmonyScore;
      zoneCount++;
    }
  }
  
  const circularHarmonyScore = zoneCount > 0 ? totalHarmony / zoneCount : 0;
  
  // Analyze room placements
  const roomPlacements: RoomPlacement[] = [];
  
  for (const [roomType, config] of Object.entries(ROOM_DIRECTION_MAP)) {
    const currentZone = Array.from(roomUsage.entries()).find(
      ([usage]) => usage.toLowerCase().includes(roomType.toLowerCase())
    )?.[0];
    
    const harmonyScore = currentZone && config.zones.includes(currentZone) ? 90 : 
                        currentZone ? 50 : 70;
    
    roomPlacements.push({
      roomType,
      suggestedZones: config.zones,
      currentZone,
      harmonyScore,
      reasoning: config.reasoning
    });
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (circularHarmonyScore < 60) {
    recommendations.push(`⚠️ Circular harmony is low (${circularHarmonyScore.toFixed(0)}/100). Major Vastu adjustments recommended.`);
  } else if (circularHarmonyScore >= 85) {
    recommendations.push(`✅ Excellent circular harmony (${circularHarmonyScore.toFixed(0)}/100). Layout follows Vastu principles.`);
  }
  
  // Check core ring
  const coreRing = rings[0];
  const coreBlocked = coreRing.zones.filter(z => z.coverage > 50).length;
  if (coreBlocked > 8) {
    recommendations.push(`⚠️ Brahmasthana (core) is blocked. Keep center open for energy flow.`);
  }
  
  // Check flow issues
  const poorFlows = movementFlow.filter(f => f.flowQuality === 'poor' || f.flowQuality === 'moderate');
  if (poorFlows.length > 0) {
    recommendations.push(`Energy flow issues in: ${poorFlows.map(f => f.direction).join(', ')}`);
  }
  
  // Check imbalanced directions
  const imbalanced = directionalDominance.filter(d => !d.isBalanced);
  if (imbalanced.length > 4) {
    recommendations.push(`Directional imbalance detected in ${imbalanced.length} directions. Aim for balanced distribution.`);
  }
  
  return {
    type: 'mvastu-chakra',
    timestamp: new Date(),
    boundaryPoints,
    data: {
      rings,
      directionalDominance,
      circularHarmonyScore,
      movementFlow,
      roomPlacements,
      recommendations,
      circleZones
    }
  };
}
