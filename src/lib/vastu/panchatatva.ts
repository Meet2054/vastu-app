/**
 * Panchatatva Division (Five Elements) Analysis
 * 
 * Analyzes the balance of five elements (Water, Air, Fire, Earth, Space)
 * across directional sectors and detects element conflicts.
 */

import { Point, AnalysisResult } from './types';
import { 
  generate32CircleZones, 
  calculateBoundingBox,
  Circle32Zones,
  CircleZone 
} from './circle-zones';

export type ElementType = 'Water' | 'Air' | 'Fire' | 'Earth' | 'Space';

export interface ElementZone {
  element: ElementType;
  zones: CircleZone[];
  directions: string[];
  qualities: string[];
  bodyAssociation: string[];
  sensoryAssociation: string;
  color: string;
  idealUsage: string[];
  prohibitedUsage: string[];
  conflictElements: ElementType[];
  harmonizingElements: ElementType[];
  remedyMaterials: string[];
  remedyColors: string[];
}

export interface ElementAnalysis {
  element: ElementType;
  dominanceScore: number; // 0-100
  idealDominance: number; // Ideal percentage (20%)
  variance: number;
  isBalanced: boolean;
  structuralWeight: number;
  usageConflicts: {
    zone: number;
    currentUsage: string;
    conflictType: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
  }[];
  recommendations: string[];
}

export interface PanchatatvaOptions {
  northRotation?: number;
  roomUsage?: Map<number, string>; // Zone number -> room type
}

export interface PanchatatvaResult extends AnalysisResult {
  type: 'panchatatva';
  data: {
    elementZones: ElementZone[];
    elementAnalysis: ElementAnalysis[];
    overallBalance: number; // 0-100
    elementConflicts: {
      element: ElementType;
      conflictZones: number[];
      conflictType: string;
      severity: 'critical' | 'high' | 'medium' | 'low';
      remedy: string;
    }[];
    materialRemedies: string[];
    colorRemedies: string[];
    recommendations: string[];
    circleZones: Circle32Zones;
  };
}

// Element-Direction mapping based on the Panchatatva image
const ELEMENT_ZONE_DEFINITIONS: ElementZone[] = [
  {
    element: 'Water',
    zones: [],
    directions: ['N', 'NNE', 'NE'],
    qualities: ['Flowing', 'Cooling', 'Cleansing', 'Nourishing', 'Fluid', 'Adaptable'],
    bodyAssociation: ['Blood', 'Lymph', 'All fluids', 'Reproductive system'],
    sensoryAssociation: 'Taste',
    color: '#87CEEB', // Sky blue
    idealUsage: ['Water tank', 'Well', 'Bathroom', 'Washing area', 'Kitchen sink', 'Swimming pool'],
    prohibitedUsage: ['Kitchen fire', 'Electrical panel', 'Boiler', 'Fireplace'],
    conflictElements: ['Fire'],
    harmonizingElements: ['Earth', 'Space'],
    remedyMaterials: ['Water features', 'Fountains', 'Aquarium', 'Glass', 'Mirrors'],
    remedyColors: ['Blue', 'Aqua', 'White', 'Black']
  },
  {
    element: 'Air',
    zones: [],
    directions: ['ENE', 'E', 'ESE'],
    qualities: ['Movement', 'Lightness', 'Freshness', 'Change', 'Communication', 'Breath'],
    bodyAssociation: ['Respiratory system', 'Circulation', 'Nervous system'],
    sensoryAssociation: 'Touch',
    color: '#E6F9E6', // Light green
    idealUsage: ['Windows', 'Balcony', 'Ventilation', 'Living room', 'Study', 'Open spaces'],
    prohibitedUsage: ['Closed storage', 'Basement', 'Windowless rooms', 'Heavy blockages'],
    conflictElements: [],
    harmonizingElements: ['Space', 'Fire'],
    remedyMaterials: ['Wind chimes', 'Fans', 'Plants', 'Light fabrics', 'Feathers'],
    remedyColors: ['Green', 'Light blue', 'White', 'Sky blue']
  },
  {
    element: 'Fire',
    zones: [],
    directions: ['SE', 'SSE', 'S'],
    qualities: ['Heat', 'Transformation', 'Light', 'Energy', 'Digestion', 'Intensity'],
    bodyAssociation: ['Digestive system', 'Metabolism', 'Body heat', 'Vision'],
    sensoryAssociation: 'Sight',
    color: '#FFB6C1', // Light pink/red
    idealUsage: ['Kitchen', 'Fireplace', 'Electrical panel', 'Boiler', 'Solar panels', 'Stove'],
    prohibitedUsage: ['Toilet', 'Bathroom', 'Water tank', 'Well', 'Puja room'],
    conflictElements: ['Water'],
    harmonizingElements: ['Air', 'Earth'],
    remedyMaterials: ['Candles', 'Lamps', 'Pyramid', 'Crystals', 'Copper'],
    remedyColors: ['Red', 'Orange', 'Yellow', 'Pink', 'Maroon']
  },
  {
    element: 'Earth',
    zones: [],
    directions: ['SSW', 'SW', 'WSW'],
    qualities: ['Stability', 'Heaviness', 'Solidity', 'Grounding', 'Support', 'Structure'],
    bodyAssociation: ['Bones', 'Muscles', 'Tissues', 'Skin', 'Physical body'],
    sensoryAssociation: 'Smell',
    color: '#D2B48C', // Tan/brown
    idealUsage: ['Master bedroom', 'Heavy storage', 'Strong walls', 'Safe', 'Heavy furniture', 'Underground tank'],
    prohibitedUsage: ['Open spaces', 'Balcony', 'Light construction', 'Windows only'],
    conflictElements: [],
    harmonizingElements: ['Water', 'Fire'],
    remedyMaterials: ['Stone', 'Crystals', 'Clay', 'Terracotta', 'Heavy metals', 'Rocks'],
    remedyColors: ['Brown', 'Yellow', 'Orange', 'Beige', 'Earth tones']
  },
  {
    element: 'Space',
    zones: [],
    directions: ['W', 'WNW', 'NW', 'NNW'],
    qualities: ['Emptiness', 'Expansion', 'Potential', 'Connection', 'Sound', 'Ether'],
    bodyAssociation: ['Hollow organs', 'Cavities', 'Channels', 'Ears'],
    sensoryAssociation: 'Sound',
    color: '#F5F5F5', // Light gray/white
    idealUsage: ['Open hall', 'Courtyard', 'Passage', 'Communication areas', 'Guest room', 'Movement spaces'],
    prohibitedUsage: ['Heavy storage', 'Clutter', 'Over-construction', 'Blockages'],
    conflictElements: [],
    harmonizingElements: ['Water', 'Air'],
    remedyMaterials: ['Bells', 'Singing bowls', 'Hollow items', 'Open structures'],
    remedyColors: ['White', 'Silver', 'Light gray', 'Transparent']
  }
];

/**
 * Map zones to elements based on their direction
 */
function assignZonesToElements(circleZones: Circle32Zones): ElementZone[] {
  const elementZones = ELEMENT_ZONE_DEFINITIONS.map(def => ({ ...def, zones: [] as CircleZone[] }));
  
  for (const zone of circleZones.zones) {
    for (const elementZone of elementZones) {
      if (elementZone.directions.includes(zone.direction) || 
          elementZone.directions.includes(zone.directionCode)) {
        elementZone.zones.push(zone);
      }
    }
  }
  
  return elementZones;
}

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
 * Calculate structural weight for an element zone
 */
function calculateStructuralWeight(
  elementZone: ElementZone,
  centerX: number,
  centerY: number,
  radius: number,
  boundaryPoints: Point[]
): number {
  const samples = 50;
  let totalSamples = 0;
  let insideSamples = 0;
  
  for (const zone of elementZone.zones) {
    for (let r = 0; r < samples; r++) {
      const rad = (r / samples) * radius;
      const angle = zone.centerAngle * (Math.PI / 180);
      
      const x = centerX + rad * Math.sin(angle);
      const y = centerY - rad * Math.cos(angle);
      
      totalSamples++;
      if (isPointInPolygon({ x, y }, boundaryPoints)) {
        insideSamples++;
      }
    }
  }
  
  return totalSamples > 0 ? (insideSamples / totalSamples) * 100 : 0;
}

/**
 * Check for usage conflicts with element nature
 */
function checkUsageConflicts(
  elementZone: ElementZone,
  roomUsage: Map<number, string>
): ElementAnalysis['usageConflicts'] {
  const conflicts: ElementAnalysis['usageConflicts'] = [];
  
  for (const zone of elementZone.zones) {
    const usage = roomUsage.get(zone.zoneNumber);
    if (!usage) continue;
    
    const usageLower = usage.toLowerCase();
    
    // Check for prohibited usage
    for (const prohibited of elementZone.prohibitedUsage) {
      if (usageLower.includes(prohibited.toLowerCase())) {
        let severity: 'critical' | 'high' | 'medium' | 'low' = 'medium';
        let conflictType = '';
        
        // Critical conflicts
        if (elementZone.element === 'Water' && (usageLower.includes('kitchen') || usageLower.includes('fire'))) {
          severity = 'critical';
          conflictType = 'Fire in Water zone - severe element clash';
        } else if (elementZone.element === 'Fire' && (usageLower.includes('toilet') || usageLower.includes('bath'))) {
          severity = 'critical';
          conflictType = 'Water in Fire zone - severe element clash';
        } else if (elementZone.element === 'Earth' && usageLower.includes('open')) {
          severity = 'high';
          conflictType = 'Openness in Earth zone - stability compromised';
        } else if (elementZone.element === 'Air' && usageLower.includes('closed')) {
          severity = 'high';
          conflictType = 'Blockage in Air zone - circulation restricted';
        } else {
          severity = 'medium';
          conflictType = `${prohibited} not ideal in ${elementZone.element} zone`;
        }
        
        conflicts.push({
          zone: zone.zoneNumber,
          currentUsage: usage,
          conflictType,
          severity
        });
      }
    }
  }
  
  return conflicts;
}

/**
 * Analyze element balance
 */
function analyzeElementBalance(
  elementZone: ElementZone,
  structuralWeight: number,
  totalZones: number,
  roomUsage: Map<number, string>
): ElementAnalysis {
  const idealDominance = 20; // Each element should be 20% (5 elements)
  const dominanceScore = (elementZone.zones.length / totalZones) * 100;
  const variance = dominanceScore - idealDominance;
  
  const isBalanced = Math.abs(variance) <= 5; // Within 5% is considered balanced
  const usageConflicts = checkUsageConflicts(elementZone, roomUsage);
  
  const recommendations: string[] = [];
  
  if (!isBalanced) {
    if (variance > 5) {
      recommendations.push(`${elementZone.element} is over-dominant (${dominanceScore.toFixed(1)}% vs ideal 20%)`);
    } else {
      recommendations.push(`${elementZone.element} is deficient (${dominanceScore.toFixed(1)}% vs ideal 20%)`);
    }
  } else {
    recommendations.push(`✅ ${elementZone.element} is well-balanced (${dominanceScore.toFixed(1)}%)`);
  }
  
  // Structural recommendations
  if (elementZone.element === 'Water' && structuralWeight > 40) {
    recommendations.push(`Too much construction in Water zone (${elementZone.directions.join(', ')}). Keep more open.`);
  } else if (elementZone.element === 'Earth' && structuralWeight < 60) {
    recommendations.push(`Earth zone (${elementZone.directions.join(', ')}) needs more substantial construction.`);
  } else if (elementZone.element === 'Air' && structuralWeight > 50) {
    recommendations.push(`Air zone blocked. Increase ventilation and openings in ${elementZone.directions.join(', ')}.`);
  } else if (elementZone.element === 'Fire' && structuralWeight < 30) {
    recommendations.push(`Fire zone under-utilized. Place kitchen or heat sources in ${elementZone.directions.join(', ')}.`);
  }
  
  // Conflict recommendations
  if (usageConflicts.length > 0) {
    recommendations.push(`⚠️ ${usageConflicts.length} element conflict(s) detected`);
    recommendations.push(`Use ${elementZone.remedyMaterials.slice(0, 2).join(', ')} for remedy`);
    recommendations.push(`Apply colors: ${elementZone.remedyColors.slice(0, 2).join(', ')}`);
  }
  
  return {
    element: elementZone.element,
    dominanceScore,
    idealDominance,
    variance,
    isBalanced,
    structuralWeight,
    usageConflicts,
    recommendations
  };
}

/**
 * Generate Panchatatva Division analysis
 */
export function generatePanchatatva(
  boundaryPoints: Point[],
  options: PanchatatvaOptions = {}
): PanchatatvaResult {
  const {
    northRotation = 0,
    roomUsage = new Map()
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
  
  // Assign zones to elements
  const elementZones = assignZonesToElements(circleZones);
  
  // Analyze each element
  const elementAnalysis: ElementAnalysis[] = [];
  const elementConflicts: PanchatatvaResult['data']['elementConflicts'] = [];
  const materialRemedies = new Set<string>();
  const colorRemedies = new Set<string>();
  
  for (const elementZone of elementZones) {
    const structuralWeight = calculateStructuralWeight(
      elementZone,
      bbox.centerX,
      bbox.centerY,
      radius,
      boundaryPoints
    );
    
    const analysis = analyzeElementBalance(
      elementZone,
      structuralWeight,
      circleZones.zones.length,
      roomUsage
    );
    
    elementAnalysis.push(analysis);
    
    // Collect conflicts
    if (analysis.usageConflicts.length > 0) {
      const criticalConflicts = analysis.usageConflicts.filter(c => c.severity === 'critical');
      if (criticalConflicts.length > 0) {
        elementConflicts.push({
          element: elementZone.element,
          conflictZones: criticalConflicts.map(c => c.zone),
          conflictType: criticalConflicts[0].conflictType,
          severity: 'critical',
          remedy: `Remove conflicting element. Use ${elementZone.remedyMaterials[0]} and ${elementZone.remedyColors[0]} color.`
        });
      }
      
      // Collect remedies
      elementZone.remedyMaterials.forEach(m => materialRemedies.add(m));
      elementZone.remedyColors.forEach(c => colorRemedies.add(c));
    }
  }
  
  // Calculate overall balance
  const avgVariance = elementAnalysis.reduce((sum, a) => sum + Math.abs(a.variance), 0) / elementAnalysis.length;
  const overallBalance = Math.max(0, 100 - avgVariance * 4);
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (overallBalance < 60) {
    recommendations.push(`⚠️ Significant element imbalance (${overallBalance.toFixed(0)}/100). Health and prosperity affected.`);
  } else if (overallBalance >= 85) {
    recommendations.push(`✅ Excellent element balance (${overallBalance.toFixed(0)}/100). Harmonious five-element distribution.`);
  }
  
  // Critical conflicts
  const criticalConflicts = elementConflicts.filter(c => c.severity === 'critical');
  if (criticalConflicts.length > 0) {
    recommendations.push(`🔴 CRITICAL: ${criticalConflicts.length} severe element clash(es). Immediate correction required.`);
    recommendations.push(`Most critical: ${criticalConflicts[0].conflictType}`);
  }
  
  // Element-specific issues
  const waterAnalysis = elementAnalysis.find(a => a.element === 'Water');
  const fireAnalysis = elementAnalysis.find(a => a.element === 'Fire');
  
  if (waterAnalysis && fireAnalysis) {
    if (waterAnalysis.dominanceScore > 25 && fireAnalysis.dominanceScore > 25) {
      recommendations.push(`⚠️ Both Water and Fire are strong. Ensure they are not in adjacent zones.`);
    }
  }
  
  // Remedies summary
  if (materialRemedies.size > 0) {
    recommendations.push(`Material remedies: ${Array.from(materialRemedies).slice(0, 5).join(', ')}`);
  }
  
  if (colorRemedies.size > 0) {
    recommendations.push(`Color remedies: ${Array.from(colorRemedies).slice(0, 5).join(', ')}`);
  }
  
  return {
    type: 'panchatatva',
    timestamp: new Date(),
    boundaryPoints,
    data: {
      elementZones,
      elementAnalysis,
      overallBalance,
      elementConflicts,
      materialRemedies: Array.from(materialRemedies),
      colorRemedies: Array.from(colorRemedies),
      recommendations,
      circleZones
    }
  };
}
