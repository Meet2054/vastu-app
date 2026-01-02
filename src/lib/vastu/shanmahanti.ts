/**
 * Shanmahanti (Six Major Zones) Analysis
 * 
 * Evaluates six major directional stress zones influencing health, 
 * finance, stability, growth, relationships, and peace.
 */

import { Point, AnalysisResult } from './types';
import { 
  generate32CircleZones, 
  getZonesBySector, 
  calculateBoundingBox,
  Circle32Zones,
  CircleZone 
} from './circle-zones';

export interface ShanmahantiSector {
  name: string;
  sector: string; // North, Northeast, East, Southeast, South, Southwest, West, Northwest
  lifeDomain: string;
  zones: CircleZone[];
  obstructionScore: number; // 0-100 (higher = more obstruction)
  excessScore: number; // 0-100 (higher = more excess)
  balanceScore: number; // 0-100 (higher = better balance)
  isStressed: boolean;
  priority: number; // 1 (highest) to 6 (lowest)
  recommendations: string[];
}

export interface ShanmahantiOptions {
  northRotation?: number;
  obstructionThreshold?: number; // % of sector that's obstructed to consider it stressed
  excessThreshold?: number; // % of sector that's over-built to consider it excess
}

export interface ShanmahantiResult extends AnalysisResult {
  type: 'shanmahanti';
  data: {
    sectors: ShanmahantiSector[];
    stressedDomains: string[];
    correctivePriorities: {
      priority: number;
      domain: string;
      sector: string;
      issue: string;
      action: string;
    }[];
    overallBalance: number; // 0-100
    circleZones: Circle32Zones;
  };
}

// Six major sectors and their life domain mappings
const SHANMAHANTI_SECTORS = [
  {
    sector: 'North',
    lifeDomain: 'Career & Wealth',
    idealBalance: 'Open with water element',
    stressIndicators: ['Heavy construction', 'High walls', 'Clutter'],
    remedies: ['Keep area open', 'Add water features', 'Use blue/black colors']
  },
  {
    sector: 'Northeast',
    lifeDomain: 'Spirituality & Peace',
    idealBalance: 'Most open, light, elevated',
    stressIndicators: ['Toilets', 'Kitchen', 'Storage', 'Heavy furniture'],
    remedies: ['Remove obstructions', 'Add light', 'Keep clean and sacred', 'Use white/yellow']
  },
  {
    sector: 'East',
    lifeDomain: 'Health & Growth',
    idealBalance: 'Open with morning sunlight',
    stressIndicators: ['Blocked sunlight', 'Dark areas', 'Waste'],
    remedies: ['Maximize openings', 'Add plants', 'Use green colors']
  },
  {
    sector: 'Southeast',
    lifeDomain: 'Finance & Energy',
    idealBalance: 'Fire element, kitchen placement',
    stressIndicators: ['Water elements', 'Toilets', 'Overhead tanks'],
    remedies: ['Place kitchen here', 'Add fire element', 'Use red/orange']
  },
  {
    sector: 'Southwest',
    lifeDomain: 'Stability & Relationships',
    idealBalance: 'Heavy, elevated, closed',
    stressIndicators: ['Open areas', 'Water', 'Light construction'],
    remedies: ['Add weight', 'Build walls', 'Master bedroom here', 'Use brown/yellow']
  },
  {
    sector: 'Northwest',
    lifeDomain: 'Support & Networking',
    idealBalance: 'Moderate, guest areas',
    stressIndicators: ['Main bedroom', 'Puja room', 'Excess weight'],
    remedies: ['Guest rooms here', 'Movement-related activities', 'Use white/gray']
  }
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
 * Calculate how much of a sector is covered by the boundary
 */
function calculateSectorCoverage(
  zones: CircleZone[],
  centerX: number,
  centerY: number,
  radius: number,
  boundaryPoints: Point[]
): { obstruction: number; excess: number; balance: number } {
  let totalSamples = 0;
  let insideSamples = 0;
  let nearBoundarySamples = 0;
  
  // Sample points in each zone of the sector
  for (const zone of zones) {
    const samples = 50; // Sample points per zone
    
    for (let i = 0; i < samples; i++) {
      // Sample at different radii
      const r = (radius * (i + 1)) / samples;
      const angle = zone.centerAngle * (Math.PI / 180);
      
      const x = centerX + r * Math.sin(angle);
      const y = centerY - r * Math.cos(angle);
      
      const isInside = isPointInPolygon({ x, y }, boundaryPoints);
      totalSamples++;
      
      if (isInside) {
        insideSamples++;
        
        // Check if near boundary (obstruction indicator)
        const distanceToBoundary = calculateDistanceToBoundary({ x, y }, boundaryPoints);
        if (distanceToBoundary < radius * 0.1) {
          nearBoundarySamples++;
        }
      }
    }
  }
  
  const coveragePercent = (insideSamples / totalSamples) * 100;
  const obstructionPercent = (nearBoundarySamples / totalSamples) * 100;
  
  // Balance score: ideal is sector-specific
  // For North, Northeast, East: prefer open (low coverage)
  // For Southwest: prefer closed (high coverage)
  let balanceScore = 0;
  
  if (coveragePercent >= 30 && coveragePercent <= 70) {
    balanceScore = 100 - Math.abs(50 - coveragePercent) * 2;
  } else {
    balanceScore = 100 - Math.abs(50 - coveragePercent);
  }
  
  return {
    obstruction: obstructionPercent,
    excess: coveragePercent > 80 ? coveragePercent : 0,
    balance: balanceScore
  };
}

/**
 * Calculate minimum distance from point to boundary
 */
function calculateDistanceToBoundary(point: Point, boundary: Point[]): number {
  let minDistance = Infinity;
  
  for (let i = 0; i < boundary.length; i++) {
    const p1 = boundary[i];
    const p2 = boundary[(i + 1) % boundary.length];
    
    const distance = distanceToSegment(point, p1, p2);
    minDistance = Math.min(minDistance, distance);
  }
  
  return minDistance;
}

/**
 * Calculate distance from point to line segment
 */
function distanceToSegment(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  const l2 = dx * dx + dy * dy;
  
  if (l2 === 0) {
    return Math.sqrt((point.x - lineStart.x) ** 2 + (point.y - lineStart.y) ** 2);
  }
  
  let t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  
  const projX = lineStart.x + t * dx;
  const projY = lineStart.y + t * dy;
  
  return Math.sqrt((point.x - projX) ** 2 + (point.y - projY) ** 2);
}

/**
 * Generate recommendations for a stressed sector
 */
function generateRecommendations(
  sectorDef: typeof SHANMAHANTI_SECTORS[0],
  obstruction: number,
  excess: number,
  balance: number
): string[] {
  const recommendations: string[] = [];
  
  if (obstruction > 30) {
    recommendations.push(
      `${sectorDef.sector} has significant obstruction affecting ${sectorDef.lifeDomain}.`
    );
    recommendations.push(`Remove: ${sectorDef.stressIndicators.join(', ')}`);
  }
  
  if (excess > 70) {
    recommendations.push(
      `${sectorDef.sector} is over-built, creating imbalance in ${sectorDef.lifeDomain}.`
    );
  }
  
  if (balance < 50) {
    recommendations.push(`Ideal state: ${sectorDef.idealBalance}`);
    recommendations.push(`Remedies: ${sectorDef.remedies.join(', ')}`);
  }
  
  return recommendations;
}

/**
 * Generate Shanmahanti analysis
 */
export function generateShanmahanti(
  boundaryPoints: Point[],
  options: ShanmahantiOptions = {}
): ShanmahantiResult {
  const {
    northRotation = 0,
    obstructionThreshold = 30,
    excessThreshold = 70
  } = options;
  
  if (boundaryPoints.length < 3) {
    throw new Error('At least 3 boundary points required');
  }
  
  const bbox = calculateBoundingBox(boundaryPoints);
  const radius = Math.min(bbox.width, bbox.height) / 2;
  
  const circleZones = generate32CircleZones(
    bbox.centerX,
    bbox.centerY,
    radius,
    northRotation
  );
  
  const sectors: ShanmahantiSector[] = [];
  const stressedDomains: string[] = [];
  
  // Analyze each of the 6 major sectors
  for (const sectorDef of SHANMAHANTI_SECTORS) {
    const zones = getZonesBySector(sectorDef.sector, circleZones);
    const { obstruction, excess, balance } = calculateSectorCoverage(
      zones,
      bbox.centerX,
      bbox.centerY,
      radius,
      boundaryPoints
    );
    
    const isStressed = 
      obstruction > obstructionThreshold || 
      excess > excessThreshold || 
      balance < 50;
    
    if (isStressed) {
      stressedDomains.push(sectorDef.lifeDomain);
    }
    
    const recommendations = generateRecommendations(
      sectorDef,
      obstruction,
      excess,
      balance
    );
    
    sectors.push({
      name: sectorDef.sector,
      sector: sectorDef.sector,
      lifeDomain: sectorDef.lifeDomain,
      zones,
      obstructionScore: obstruction,
      excessScore: excess,
      balanceScore: balance,
      isStressed,
      priority: 0, // Will be calculated later
      recommendations
    });
  }
  
  // Calculate priorities (1 = most urgent)
  const sortedByStress = [...sectors]
    .sort((a, b) => {
      // Critical sectors (Northeast, Southwest) get higher priority
      const criticalSectors = ['Northeast', 'Southwest'];
      const aIsCritical = criticalSectors.includes(a.sector);
      const bIsCritical = criticalSectors.includes(b.sector);
      
      if (aIsCritical && !bIsCritical) return -1;
      if (!aIsCritical && bIsCritical) return 1;
      
      // Otherwise sort by balance score (lower = worse)
      return a.balanceScore - b.balanceScore;
    });
  
  sortedByStress.forEach((sector, index) => {
    sector.priority = index + 1;
  });
  
  // Create corrective priorities list
  const correctivePriorities = sortedByStress
    .filter(s => s.isStressed)
    .map(s => ({
      priority: s.priority,
      domain: s.lifeDomain,
      sector: s.sector,
      issue: s.obstructionScore > obstructionThreshold 
        ? 'Obstruction' 
        : s.excessScore > excessThreshold 
        ? 'Excess construction' 
        : 'Imbalance',
      action: s.recommendations[0] || 'Review sector layout'
    }));
  
  // Calculate overall balance
  const overallBalance = 
    sectors.reduce((sum, s) => sum + s.balanceScore, 0) / sectors.length;
  
  return {
    type: 'shanmahanti',
    timestamp: new Date(),
    boundaryPoints,
    data: {
      sectors,
      stressedDomains,
      correctivePriorities,
      overallBalance,
      circleZones
    }
  };
}
