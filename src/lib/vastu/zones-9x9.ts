/**
 * 9×9 Zones Division Analysis
 * 
 * Advanced directional micro-zoning system.
 * Subdivides the entire floor plan into an 81-zone grid (9×9) for fine-grained analysis.
 * 
 * Features:
 * - 9×9 grid creating 81 micro-zones
 * - Each main direction subdivided into multiple zones
 * - Per-zone area calculation and coverage analysis
 * - Fine-grained imbalance detection
 * - Micro-zone specific recommendations
 */

import { Point, BoundingBox, AnalysisResult } from './types';

/**
 * A single zone in the 9×9 grid
 */
export interface Zone9x9 {
  row: number;                    // Row index (0-8, top to bottom)
  col: number;                    // Column index (0-8, left to right)
  zoneNumber: number;             // Unique zone number (1-81)
  direction: string;              // Main direction (N, NE, E, SE, S, SW, W, NW, CENTER)
  subDirection: string;           // Sub-direction within main direction
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    centerX: number;
    centerY: number;
  };
  area: number;                   // Total zone area
  builtArea: number;              // Area covered by structure
  emptyArea: number;              // Area outside structure
  coverage: number;               // Percentage built (0-100)
  status: 'fully-built' | 'partially-built' | 'empty';
  importance: 'critical' | 'high' | 'medium' | 'low';
  idealUsage: string[];
  prohibitedUsage: string[];
}

/**
 * Directional sector grouping multiple zones
 */
export interface DirectionalSector9x9 {
  direction: string;
  zones: Zone9x9[];
  totalArea: number;
  totalBuiltArea: number;
  totalEmptyArea: number;
  overallCoverage: number;
  imbalanceScore: number;         // 0-100, higher means more imbalanced
  imbalanceType: 'excess' | 'deficiency' | 'balanced';
  recommendations: string[];
}

/**
 * 9×9 Zones Division analysis result
 */
export interface Zones9x9AnalysisResult extends AnalysisResult {
  recommendations: string[];
  data: {
    zones: Zone9x9[];
    directionalSectors: DirectionalSector9x9[];
    gridMetrics: {
      totalZones: number;
      fullyBuiltZones: number;
      partiallyBuiltZones: number;
      emptyZones: number;
      overallCoverage: number;
    };
    imbalanceReport: {
      criticalImbalances: Array<{
        zone: Zone9x9;
        issue: string;
        severity: 'critical' | 'high';
        recommendation: string;
      }>;
      excessZones: Zone9x9[];       // Zones with too much coverage
      deficientZones: Zone9x9[];    // Zones with too little coverage
      balancedZones: Zone9x9[];     // Zones with good coverage
    };
    microZoneScore: number;         // Overall balance score (0-100)
  };
}

/**
 * Zone importance based on position
 */
const ZONE_IMPORTANCE_MAP: { [key: string]: 'critical' | 'high' | 'medium' | 'low' } = {
  // Center zones (Brahmasthana)
  '40': 'critical', '41': 'critical', '49': 'critical', '50': 'critical',
  
  // NE corner zones (most critical)
  '3': 'critical', '4': 'critical', '5': 'critical',
  '12': 'critical', '13': 'critical', '14': 'critical',
  '21': 'critical', '22': 'critical', '23': 'critical',
  
  // SW corner zones (high importance for stability)
  '57': 'high', '58': 'high', '59': 'high',
  '66': 'high', '67': 'high', '68': 'high',
  '75': 'high', '76': 'high', '77': 'high',
  
  // Other corner and edge zones
  '1': 'high', '2': 'high', '7': 'high', '8': 'high', '9': 'high',
  '73': 'high', '74': 'high', '79': 'high', '80': 'high', '81': 'high',
};

/**
 * Direction mapping for each zone in 9×9 grid
 */
function getZoneDirection(row: number, col: number): { main: string; sub: string } {
  // Center zones (3×3 in middle)
  if (row >= 3 && row <= 5 && col >= 3 && col <= 5) {
    return { main: 'CENTER', sub: 'Brahmasthana' };
  }
  
  // North zones
  if (row === 0) {
    if (col <= 2) return { main: 'NW', sub: 'NW' + (3 - col) };
    if (col >= 6) return { main: 'NE', sub: 'NE' + (col - 5) };
    return { main: 'N', sub: 'N' + (col - 2) };
  }
  
  if (row === 1) {
    if (col <= 2) return { main: 'NW', sub: 'NW' + (6 - col) };
    if (col >= 6) return { main: 'NE', sub: 'NE' + (col - 2) };
    return { main: 'N', sub: 'N' + (col + 1) };
  }
  
  if (row === 2) {
    if (col === 0) return { main: 'NW', sub: 'NW7' };
    if (col === 1) return { main: 'NW', sub: 'NW8' };
    if (col === 2) return { main: 'NW', sub: 'NW9' };
    if (col === 3) return { main: 'N', sub: 'N7' };
    if (col === 4) return { main: 'N', sub: 'N8' };
    if (col === 5) return { main: 'N', sub: 'N9' };
    if (col === 6) return { main: 'NE', sub: 'NE7' };
    if (col === 7) return { main: 'NE', sub: 'NE8' };
    if (col === 8) return { main: 'NE', sub: 'NE9' };
  }
  
  // Middle rows (3-5) with east and west zones
  if (row >= 3 && row <= 5) {
    if (col <= 2) return { main: 'W', sub: 'W' + ((row - 2) * 3 - 2 + col) };
    if (col >= 6) return { main: 'E', sub: 'E' + ((row - 2) * 3 - 2 + (col - 6)) };
  }
  
  // South zones
  if (row === 6) {
    if (col === 0) return { main: 'SW', sub: 'SW1' };
    if (col === 1) return { main: 'SW', sub: 'SW2' };
    if (col === 2) return { main: 'SW', sub: 'SW3' };
    if (col === 3) return { main: 'S', sub: 'S1' };
    if (col === 4) return { main: 'S', sub: 'S2' };
    if (col === 5) return { main: 'S', sub: 'S3' };
    if (col === 6) return { main: 'SE', sub: 'SE1' };
    if (col === 7) return { main: 'SE', sub: 'SE2' };
    if (col === 8) return { main: 'SE', sub: 'SE3' };
  }
  
  if (row === 7) {
    if (col <= 2) return { main: 'SW', sub: 'SW' + (col + 4) };
    if (col >= 6) return { main: 'SE', sub: 'SE' + (col - 2) };
    return { main: 'S', sub: 'S' + (col - 2) };
  }
  
  if (row === 8) {
    if (col <= 2) return { main: 'SW', sub: 'SW' + (col + 7) };
    if (col >= 6) return { main: 'SE', sub: 'SE' + (col + 1) };
    return { main: 'S', sub: 'S' + (col + 4) };
  }
  
  return { main: 'CENTER', sub: 'C' };
}

/**
 * Get ideal and prohibited usage for a zone based on direction
 */
function getZoneUsageGuidelines(direction: string): { ideal: string[]; prohibited: string[] } {
  const guidelines: { [key: string]: { ideal: string[]; prohibited: string[] } } = {
    'N': {
      ideal: ['Office', 'Study', 'Treasury', 'Financial Planning'],
      prohibited: ['Toilet', 'Garbage', 'Heavy Storage']
    },
    'NE': {
      ideal: ['Puja Room', 'Meditation', 'Open Space', 'Water Feature'],
      prohibited: ['Toilet', 'Kitchen', 'Heavy Storage', 'Shoe Rack']
    },
    'E': {
      ideal: ['Living Room', 'Social Area', 'Exercise', 'Fresh Air'],
      prohibited: ['Toilet', 'Store Room', 'Dark Spaces']
    },
    'SE': {
      ideal: ['Kitchen', 'Electrical Room', 'Fire Activities'],
      prohibited: ['Water Tank', 'Bathroom', 'Cold Storage']
    },
    'S': {
      ideal: ['Master Bedroom', 'Study', 'Heavy Work', 'Storage'],
      prohibited: ['Main Entrance', 'Puja Room', 'Light Spaces']
    },
    'SW': {
      ideal: ['Master Bedroom', 'Heavy Storage', 'Safe Room', 'Strong Walls'],
      prohibited: ['Main Entrance', 'Water Tank', 'Kitchen', 'Toilet']
    },
    'W': {
      ideal: ['Dining Room', 'Children Room', 'Guest Room', 'Storage'],
      prohibited: ['Kitchen', 'Fire Place', 'Boiler']
    },
    'NW': {
      ideal: ['Guest Room', 'Garage', 'Vehicle Parking', 'Store Room'],
      prohibited: ['Puja Room', 'Master Bedroom', 'Safe', 'Treasury']
    },
    'CENTER': {
      ideal: ['Open Space', 'Courtyard', 'Light Usage'],
      prohibited: ['Heavy Construction', 'Closed Rooms', 'Basement']
    }
  };
  
  return guidelines[direction] || { ideal: [], prohibited: [] };
}

/**
 * Calculate bounding box
 */
function calculateBoundingBox(points: Point[]): BoundingBox {
  if (points.length === 0) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0, centerX: 0, centerY: 0 };
  }
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  return {
    minX, maxX, minY, maxY,
    width: maxX - minX, height: maxY - minY,
    centerX: (minX + maxX) / 2, centerY: (minY + maxY) / 2
  };
}

/**
 * Check if point is inside polygon
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
 * Calculate zone coverage using sampling
 */
function calculateZoneCoverage(
  zoneBounds: { minX: number; maxX: number; minY: number; maxY: number },
  boundary: Point[]
): { coverage: number; builtArea: number; totalArea: number } {
  const samplesX = 20;
  const samplesY = 20;
  let totalSamples = 0;
  let insideSamples = 0;
  
  const { minX, maxX, minY, maxY } = zoneBounds;
  const stepX = (maxX - minX) / samplesX;
  const stepY = (maxY - minY) / samplesY;
  
  for (let i = 0; i < samplesX; i++) {
    for (let j = 0; j < samplesY; j++) {
      const point: Point = {
        x: minX + (i + 0.5) * stepX,
        y: minY + (j + 0.5) * stepY
      };
      totalSamples++;
      if (isPointInPolygon(point, boundary)) {
        insideSamples++;
      }
    }
  }
  
  const totalArea = (maxX - minX) * (maxY - minY);
  const coverage = totalSamples > 0 ? (insideSamples / totalSamples) * 100 : 0;
  const builtArea = (totalArea * coverage) / 100;
  
  return { coverage, builtArea, totalArea };
}

/**
 * Determine zone status
 */
function getZoneStatus(coverage: number): 'fully-built' | 'partially-built' | 'empty' {
  if (coverage >= 80) return 'fully-built';
  if (coverage >= 20) return 'partially-built';
  return 'empty';
}

/**
 * Calculate imbalance score for a directional sector
 */
function calculateDirectionalImbalance(
  direction: string,
  zones: Zone9x9[]
): { score: number; type: 'excess' | 'deficiency' | 'balanced' } {
  const avgCoverage = zones.reduce((sum, z) => sum + z.coverage, 0) / zones.length;
  
  // Ideal coverage varies by direction
  const idealCoverage: { [key: string]: number } = {
    'N': 60, 'NE': 30, 'E': 60, 'SE': 70,
    'S': 75, 'SW': 80, 'W': 65, 'NW': 50, 'CENTER': 20
  };
  
  const ideal = idealCoverage[direction] || 60;
  const deviation = Math.abs(avgCoverage - ideal);
  const imbalanceScore = Math.min(100, deviation * 2);
  
  let type: 'excess' | 'deficiency' | 'balanced';
  if (avgCoverage > ideal + 15) {
    type = 'excess';
  } else if (avgCoverage < ideal - 15) {
    type = 'deficiency';
  } else {
    type = 'balanced';
  }
  
  return { score: Math.round(imbalanceScore), type };
}

/**
 * Generate zone recommendations
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateZoneRecommendations(zone: Zone9x9): string[] {
  const recs: string[] = [];
  
  if (zone.importance === 'critical') {
    if (zone.direction === 'NE' && zone.coverage > 40) {
      recs.push(`⚠️ CRITICAL: NE zone ${zone.zoneNumber} over-built (${zone.coverage.toFixed(1)}%). Keep light and open.`);
    }
    if (zone.direction === 'CENTER' && zone.coverage > 30) {
      recs.push(`⚠️ CRITICAL: Central zone ${zone.zoneNumber} should remain open. Remove heavy structures.`);
    }
    if (zone.direction === 'SW' && zone.coverage < 60) {
      recs.push(`⚠️ HIGH: SW zone ${zone.zoneNumber} needs more weight (${zone.coverage.toFixed(1)}%). Add heavy structures.`);
    }
  }
  
  if (zone.status === 'empty' && zone.importance === 'high') {
    recs.push(`Zone ${zone.zoneNumber} in ${zone.direction} is empty. Consider: ${zone.idealUsage.slice(0, 2).join(', ')}.`);
  }
  
  if (zone.status === 'fully-built' && zone.prohibitedUsage.length > 0) {
    recs.push(`Avoid using zone ${zone.zoneNumber} for: ${zone.prohibitedUsage.slice(0, 2).join(', ')}.`);
  }
  
  return recs;
}

/**
 * Generate directional sector recommendations
 */
function generateSectorRecommendations(sector: DirectionalSector9x9): string[] {
  const recs: string[] = [];
  
  if (sector.imbalanceType === 'excess') {
    recs.push(
      `${sector.direction} sector has excess construction (${sector.overallCoverage.toFixed(1)}%). Reduce density or create open spaces.`
    );
  } else if (sector.imbalanceType === 'deficiency') {
    recs.push(
      `${sector.direction} sector lacks adequate structure (${sector.overallCoverage.toFixed(1)}%). Add appropriate construction.`
    );
  } else {
    recs.push(
      `${sector.direction} sector is well-balanced (${sector.overallCoverage.toFixed(1)}%). Maintain current distribution.`
    );
  }
  
  // Special direction guidance
  if (sector.direction === 'NE' && sector.imbalanceScore > 30) {
    recs.push('NE sector critical: Keep light, open, and elevated. Add water features if possible.');
  }
  
  if (sector.direction === 'SW' && sector.imbalanceScore > 30) {
    recs.push('SW sector needs strengthening: Add heavy walls, storage, and master bedroom.');
  }
  
  if (sector.direction === 'CENTER' && sector.overallCoverage > 25) {
    recs.push('Central Brahmasthana should remain open. Consider creating courtyard or skylight.');
  }
  
  return recs;
}

/**
 * Options for 9×9 analysis
 */
export interface Zones9x9AnalysisOptions {
  highlightImbalances?: boolean;
}

/**
 * Generate 9×9 Zones Division analysis
 */
export function generateZones9x9(
  boundaryPoints: Point[],
): Zones9x9AnalysisResult {
  const bbox = calculateBoundingBox(boundaryPoints);
  
  // Create 9×9 grid
  const zones: Zone9x9[] = [];
  const cellWidth = bbox.width / 9;
  const cellHeight = bbox.height / 9;
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const zoneNumber = row * 9 + col + 1;
      const { main, sub } = getZoneDirection(row, col);
      const usage = getZoneUsageGuidelines(main);
      
      const zoneBounds = {
        minX: bbox.minX + col * cellWidth,
        maxX: bbox.minX + (col + 1) * cellWidth,
        minY: bbox.minY + row * cellHeight,
        maxY: bbox.minY + (row + 1) * cellHeight,
        centerX: bbox.minX + (col + 0.5) * cellWidth,
        centerY: bbox.minY + (row + 0.5) * cellHeight
      };
      
      const { coverage, builtArea, totalArea } = calculateZoneCoverage(zoneBounds, boundaryPoints);
      const emptyArea = totalArea - builtArea;
      const status = getZoneStatus(coverage);
      const importance = ZONE_IMPORTANCE_MAP[zoneNumber.toString()] || 'medium';
      
      zones.push({
        row,
        col,
        zoneNumber,
        direction: main,
        subDirection: sub,
        bounds: zoneBounds,
        area: totalArea,
        builtArea,
        emptyArea,
        coverage,
        status,
        importance,
        idealUsage: usage.ideal,
        prohibitedUsage: usage.prohibited
      });
    }
  }
  
  // Group zones by direction
  const directionGroups: { [key: string]: Zone9x9[] } = {};
  for (const zone of zones) {
    if (!directionGroups[zone.direction]) {
      directionGroups[zone.direction] = [];
    }
    directionGroups[zone.direction].push(zone);
  }
  
  // Analyze directional sectors
  const directionalSectors: DirectionalSector9x9[] = [];
  for (const [direction, dirZones] of Object.entries(directionGroups)) {
    const totalArea = dirZones.reduce((sum, z) => sum + z.area, 0);
    const totalBuiltArea = dirZones.reduce((sum, z) => sum + z.builtArea, 0);
    const totalEmptyArea = dirZones.reduce((sum, z) => sum + z.emptyArea, 0);
    const overallCoverage = totalArea > 0 ? (totalBuiltArea / totalArea) * 100 : 0;
    
    const { score, type } = calculateDirectionalImbalance(direction, dirZones);
    
    const sector: DirectionalSector9x9 = {
      direction,
      zones: dirZones,
      totalArea,
      totalBuiltArea,
      totalEmptyArea,
      overallCoverage,
      imbalanceScore: score,
      imbalanceType: type,
      recommendations: []
    };
    
    sector.recommendations = generateSectorRecommendations(sector);
    directionalSectors.push(sector);
  }
  
  // Grid metrics
  const gridMetrics = {
    totalZones: 81,
    fullyBuiltZones: zones.filter(z => z.status === 'fully-built').length,
    partiallyBuiltZones: zones.filter(z => z.status === 'partially-built').length,
    emptyZones: zones.filter(z => z.status === 'empty').length,
    overallCoverage: zones.reduce((sum, z) => sum + z.coverage, 0) / 81
  };
  
  // Imbalance report
  const criticalImbalances: Array<{
    zone: Zone9x9;
    issue: string;
    severity: 'critical' | 'high';
    recommendation: string;
  }> = [];
  
  for (const zone of zones) {
    if (zone.importance === 'critical') {
      if (zone.direction === 'NE' && zone.coverage > 40) {
        criticalImbalances.push({
          zone,
          issue: `NE zone ${zone.zoneNumber} over-built (${zone.coverage.toFixed(1)}%)`,
          severity: 'critical',
          recommendation: 'Remove structures, create open space or water feature'
        });
      }
      if (zone.direction === 'CENTER' && zone.coverage > 30) {
        criticalImbalances.push({
          zone,
          issue: `Brahmasthana zone ${zone.zoneNumber} blocked (${zone.coverage.toFixed(1)}%)`,
          severity: 'critical',
          recommendation: 'Keep central area open for energy circulation'
        });
      }
      if (zone.direction === 'SW' && zone.coverage < 50) {
        criticalImbalances.push({
          zone,
          issue: `SW zone ${zone.zoneNumber} insufficient (${zone.coverage.toFixed(1)}%)`,
          severity: 'high',
          recommendation: 'Add heavy structures for stability'
        });
      }
    }
  }
  
  const excessZones = zones.filter(z => {
    const idealCoverage = { 'N': 60, 'NE': 30, 'E': 60, 'SE': 70, 'S': 75, 'SW': 80, 'W': 65, 'NW': 50, 'CENTER': 20 };
    const ideal = idealCoverage[z.direction as keyof typeof idealCoverage] || 60;
    return z.coverage > ideal + 20;
  });
  
  const deficientZones = zones.filter(z => {
    const idealCoverage = { 'N': 60, 'NE': 30, 'E': 60, 'SE': 70, 'S': 75, 'SW': 80, 'W': 65, 'NW': 50, 'CENTER': 20 };
    const ideal = idealCoverage[z.direction as keyof typeof idealCoverage] || 60;
    return z.coverage < ideal - 20 && z.importance !== 'low';
  });
  
  const balancedZones = zones.filter(z => 
    !excessZones.includes(z) && !deficientZones.includes(z)
  );
  
  // Calculate micro zone score
  const balanceScore = (balancedZones.length / 81) * 100;
  const criticalPenalty = criticalImbalances.length * 10;
  const microZoneScore = Math.max(0, Math.round(balanceScore - criticalPenalty));
  
  // Overall recommendations
  const recommendations: string[] = [];
  
  recommendations.push(
    `9×9 Micro-Zone Analysis Complete: ${gridMetrics.totalZones} zones analyzed.`
  );
  
  recommendations.push(
    `Overall Coverage: ${gridMetrics.overallCoverage.toFixed(1)}% | Micro-Zone Balance Score: ${microZoneScore}/100`
  );
  
  recommendations.push(
    `Zone Distribution: ${gridMetrics.fullyBuiltZones} fully built, ${gridMetrics.partiallyBuiltZones} partial, ${gridMetrics.emptyZones} empty`
  );
  
  if (criticalImbalances.length > 0) {
    recommendations.push(
      `⚠️ ${criticalImbalances.length} CRITICAL imbalances detected requiring immediate attention.`
    );
  }
  
  if (excessZones.length > 10) {
    recommendations.push(
      `Over-construction detected in ${excessZones.length} zones. Consider reducing density.`
    );
  }
  
  if (deficientZones.length > 10) {
    recommendations.push(
      `Under-construction in ${deficientZones.length} zones. Plan additional structures strategically.`
    );
  }
  
  if (microZoneScore >= 70) {
    recommendations.push('Excellent micro-zone balance! Maintain current distribution.');
  } else if (microZoneScore >= 50) {
    recommendations.push('Moderate balance. Focus on critical imbalances for improvement.');
  } else {
    recommendations.push('Significant imbalances detected. Comprehensive Vastu remediation recommended.');
  }
  
  recommendations.push(
    'Use micro-zone analysis for precise room placement and furniture arrangement.'
  );
  
  return {
    type: '9x9-zones',
    timestamp: new Date(),
    boundaryPoints,
    recommendations,
    data: {
      zones,
      directionalSectors,
      gridMetrics,
      imbalanceReport: {
        criticalImbalances,
        excessZones,
        deficientZones,
        balancedZones
      },
      microZoneScore
    }
  };
}

