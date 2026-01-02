/**
 * Menna (Area Balance) Analysis
 * 
 * Comprehensive area distribution and balance analysis across all directions.
 * Generates bar charts and identifies priority correction zones.
 * 
 * Features:
 * - Area calculation per direction (32 zones)
 * - Normalization to average
 * - Upper/lower balance thresholds
 * - Visual imbalance detection
 * - Priority correction zone identification
 * - Color-coded balance indicators
 */

import { Point, BoundingBox, AnalysisResult } from './types';
import { generate32CircleZones, CircleZone } from './circle-zones';

/**
 * Direction area data
 */
export interface DirectionAreaData {
  direction: string;
  directionCode: string;
  zone: CircleZone;
  absoluteArea: number;           // Actual area in square units
  percentageArea: number;         // Percentage of total plot area
  normalizedValue: number;        // Normalized to average (average = 1.0)
  deviationFromAverage: number;   // Positive or negative deviation
  balanceStatus: 'excessive' | 'above-average' | 'balanced' | 'below-average' | 'deficient';
  colorCode: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  priority: number;               // 1-10, higher = more urgent correction needed
}

/**
 * Balance thresholds
 */
export interface BalanceThresholds {
  upperBalanceThreshold: number;    // e.g., 1.5x average
  lowerBalanceThreshold: number;    // e.g., 0.5x average
  averageArea: number;
  idealRange: {
    min: number;
    max: number;
  };
}

/**
 * Main direction group (8 cardinal directions)
 */
export interface MainDirectionGroup {
  direction: string;
  directionCode: string;
  zones: DirectionAreaData[];
  totalArea: number;
  averageArea: number;
  normalizedValue: number;
  balanceStatus: 'excessive' | 'above-average' | 'balanced' | 'below-average' | 'deficient';
  colorCode: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
}

/**
 * Priority correction zone
 */
export interface PriorityCorrectionZone {
  zone: DirectionAreaData;
  priority: number;                 // 1-10
  issue: string;
  currentArea: number;
  targetArea: number;
  correction: 'reduce' | 'increase';
  correctionAmount: number;
  impact: 'critical' | 'high' | 'medium' | 'low';
  reasoning: string;
  remedialAction: string;
}

/**
 * Menna analysis result
 */
export interface MennaAnalysisResult extends AnalysisResult {
  recommendations: string[];
  data: {
    // Individual zone data
    directionAreas: DirectionAreaData[];
    
    // Main direction groups (8 directions)
    mainDirectionGroups: MainDirectionGroup[];
    
    // Balance thresholds
    thresholds: BalanceThresholds;
    
    // Statistics
    totalPlotArea: number;
    averageZoneArea: number;
    areaStandardDeviation: number;
    balanceIndex: number;             // 0-100, higher = better balance
    
    // Imbalance analysis
    excessiveZones: DirectionAreaData[];
    deficientZones: DirectionAreaData[];
    balancedZones: DirectionAreaData[];
    
    // Priority corrections
    priorityCorrectionZones: PriorityCorrectionZone[];
    
    // Visual chart data
    barChartData: {
      labels: string[];
      values: number[];
      colors: string[];
      thresholds: {
        upper: number;
        average: number;
        lower: number;
      };
    };
    
    // Directional balance summary
    directionalBalanceSummary: {
      northernQuadrant: { status: string; area: number; balance: number };
      easternQuadrant: { status: string; area: number; balance: number };
      southernQuadrant: { status: string; area: number; balance: number };
      westernQuadrant: { status: string; area: number; balance: number };
    };
  };
}

/**
 * Options for Menna analysis
 */
export interface MennaAnalysisOptions {
  northRotation?: number;
  upperThresholdMultiplier?: number;    // Default 1.5 (150% of average)
  lowerThresholdMultiplier?: number;    // Default 0.5 (50% of average)
  samplesPerZone?: number;              // Default 50
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
 * Check if point is in polygon
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
 * Calculate zone area coverage
 */
function calculateZoneArea(
  zone: CircleZone,
  boundary: Point[],
  center: Point,
  radius: number,
  samplesPerZone: number
): number {
  let insideCount = 0;
  
  for (let i = 0; i < samplesPerZone; i++) {
    // Random angle within zone
    const angle = (zone.startAngle + (zone.endAngle - zone.startAngle) * Math.random()) * Math.PI / 180;
    
    // Random radius (full radius for area calculation)
    const dist = radius * Math.sqrt(Math.random()); // Use sqrt for uniform area distribution
    
    const point: Point = {
      x: center.x + dist * Math.sin(angle),
      y: center.y - dist * Math.cos(angle)
    };
    
    if (isPointInPolygon(point, boundary)) {
      insideCount++;
    }
  }
  
  // Calculate area: (insideCount / totalSamples) * theoretical zone area
  const coverage = insideCount / samplesPerZone;
  const zoneAngleRadians = ((zone.endAngle - zone.startAngle) * Math.PI) / 180;
  const theoreticalZoneArea = 0.5 * radius * radius * zoneAngleRadians;
  
  return coverage * theoreticalZoneArea;
}

/**
 * Get main direction from zone
 */
function getMainDirection(zone: CircleZone): string {
  const mainDirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  for (const dir of mainDirs) {
    if (zone.directionCode === dir || zone.directionCode.startsWith(dir)) {
      return dir;
    }
  }
  return 'N';
}

/**
 * Determine balance status
 */
function determineBalanceStatus(
  normalizedValue: number,
  upperThreshold: number,
  lowerThreshold: number
): 'excessive' | 'above-average' | 'balanced' | 'below-average' | 'deficient' {
  if (normalizedValue > upperThreshold) return 'excessive';
  if (normalizedValue > 1.2) return 'above-average';
  if (normalizedValue >= 0.8 && normalizedValue <= 1.2) return 'balanced';
  if (normalizedValue >= lowerThreshold) return 'below-average';
  return 'deficient';
}

/**
 * Get color code based on balance status
 */
function getColorCode(status: string): 'blue' | 'green' | 'yellow' | 'red' | 'gray' {
  switch (status) {
    case 'excessive': return 'blue';
    case 'balanced': return 'green';
    case 'above-average': return 'yellow';
    case 'below-average': return 'yellow';
    case 'deficient': return 'gray';
    default: return 'red';
  }
}

/**
 * Calculate priority for correction
 */
function calculatePriority(
  normalizedValue: number,
  direction: string,
  upperThreshold: number,
  lowerThreshold: number
): number {
  let priority = 5; // Base priority
  
  const deviation = Math.abs(normalizedValue - 1.0);
  
  // Higher deviation = higher priority
  if (deviation > 1.0) priority += 4;
  else if (deviation > 0.5) priority += 3;
  else if (deviation > 0.3) priority += 2;
  else if (deviation > 0.2) priority += 1;
  
  // Critical directions get priority boost
  if (direction === 'NE') priority += 2; // NE is critical
  if (direction === 'SW') priority += 1; // SW is important
  if (direction === 'N' || direction === 'E') priority += 1;
  
  // Excessive in NE/N/E is critical
  if ((direction === 'NE' || direction === 'N' || direction === 'E') && normalizedValue > upperThreshold) {
    priority += 2;
  }
  
  // Deficient in SW/S is critical
  if ((direction === 'SW' || direction === 'S') && normalizedValue < lowerThreshold) {
    priority += 2;
  }
  
  return Math.min(10, priority);
}

/**
 * Calculate standard deviation
 */
function calculateStdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Generate Menna (Area Balance) analysis
 */
export function generateMenna(
  boundaryPoints: Point[],
  options: MennaAnalysisOptions = {}
): MennaAnalysisResult {
  const {
    northRotation = 0,
    upperThresholdMultiplier = 1.5,
    lowerThresholdMultiplier = 0.5,
    samplesPerZone = 50
  } = options;
  
  const bbox = calculateBoundingBox(boundaryPoints);
  const center: Point = { x: bbox.centerX, y: bbox.centerY };
  const radius = Math.min(bbox.width, bbox.height) / 2;
  
  const circleZones = generate32CircleZones(center.x, center.y, radius, northRotation);
  const allZones = circleZones.zones;
  
  // Calculate area for each zone
  const directionAreas: DirectionAreaData[] = [];
  let totalArea = 0;
  
  for (const zone of allZones) {
    const absoluteArea = calculateZoneArea(zone, boundaryPoints, center, radius, samplesPerZone);
    totalArea += absoluteArea;
  }
  
  const averageZoneArea = totalArea / allZones.length;
  
  // Create thresholds
  const thresholds: BalanceThresholds = {
    upperBalanceThreshold: averageZoneArea * upperThresholdMultiplier,
    lowerBalanceThreshold: averageZoneArea * lowerThresholdMultiplier,
    averageArea: averageZoneArea,
    idealRange: {
      min: averageZoneArea * 0.8,
      max: averageZoneArea * 1.2
    }
  };
  
  // Analyze each zone
  for (const zone of allZones) {
    const absoluteArea = calculateZoneArea(zone, boundaryPoints, center, radius, samplesPerZone);
    const percentageArea = (absoluteArea / totalArea) * 100;
    const normalizedValue = absoluteArea / averageZoneArea;
    const deviationFromAverage = absoluteArea - averageZoneArea;
    
    const balanceStatus = determineBalanceStatus(
      normalizedValue,
      upperThresholdMultiplier,
      lowerThresholdMultiplier
    );
    
    const colorCode = getColorCode(balanceStatus);
    const mainDir = getMainDirection(zone);
    const priority = calculatePriority(normalizedValue, mainDir, upperThresholdMultiplier, lowerThresholdMultiplier);
    
    directionAreas.push({
      direction: zone.direction,
      directionCode: zone.directionCode,
      zone,
      absoluteArea,
      percentageArea,
      normalizedValue,
      deviationFromAverage,
      balanceStatus,
      colorCode,
      priority
    });
  }
  
  // Group by main directions
  const mainDirectionMap: { [key: string]: DirectionAreaData[] } = {};
  const mainDirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  
  for (const dirArea of directionAreas) {
    const mainDir = getMainDirection(dirArea.zone);
    if (!mainDirectionMap[mainDir]) mainDirectionMap[mainDir] = [];
    mainDirectionMap[mainDir].push(dirArea);
  }
  
  const mainDirectionGroups: MainDirectionGroup[] = [];
  
  for (const dir of mainDirs) {
    const zones = mainDirectionMap[dir] || [];
    const totalArea = zones.reduce((sum, z) => sum + z.absoluteArea, 0);
    const averageArea = zones.length > 0 ? totalArea / zones.length : 0;
    const normalizedValue = averageArea / averageZoneArea;
    const balanceStatus = determineBalanceStatus(normalizedValue, upperThresholdMultiplier, lowerThresholdMultiplier);
    const colorCode = getColorCode(balanceStatus);
    
    mainDirectionGroups.push({
      direction: dir,
      directionCode: dir,
      zones,
      totalArea,
      averageArea,
      normalizedValue,
      balanceStatus,
      colorCode
    });
  }
  
  // Calculate statistics
  const areas = directionAreas.map(d => d.absoluteArea);
  const areaStandardDeviation = calculateStdDev(areas);
  
  // Balance index: lower std dev = better balance
  const coefficientOfVariation = (areaStandardDeviation / averageZoneArea) * 100;
  const balanceIndex = Math.max(0, Math.min(100, 100 - coefficientOfVariation));
  
  // Categorize zones
  const excessiveZones = directionAreas.filter(d => d.balanceStatus === 'excessive');
  const deficientZones = directionAreas.filter(d => d.balanceStatus === 'deficient');
  const balancedZones = directionAreas.filter(d => d.balanceStatus === 'balanced');
  
  // Priority correction zones
  const priorityCorrectionZones: PriorityCorrectionZone[] = [];
  
  // Sort by priority
  const sortedByPriority = [...directionAreas].sort((a, b) => b.priority - a.priority);
  
  for (const zone of sortedByPriority.slice(0, 10)) { // Top 10 priorities
    if (zone.priority >= 6) {
      const correction: 'reduce' | 'increase' = zone.normalizedValue > 1 ? 'reduce' : 'increase';
      const targetArea = averageZoneArea;
      const correctionAmount = Math.abs(zone.absoluteArea - targetArea);
      
      const impact: 'critical' | 'high' | 'medium' | 'low' = 
        zone.priority >= 9 ? 'critical' :
        zone.priority >= 7 ? 'high' :
        zone.priority >= 5 ? 'medium' : 'low';
      
      const mainDir = getMainDirection(zone.zone);
      let reasoning = '';
      let remedialAction = '';
      
      if (correction === 'reduce') {
        reasoning = `Excessive area in ${zone.direction} (${zone.normalizedValue.toFixed(2)}x average) blocks energy flow`;
        remedialAction = `Reduce construction/mass in ${zone.direction} zone. Keep lighter and more open.`;
        
        if (mainDir === 'NE' || mainDir === 'N' || mainDir === 'E') {
          reasoning += '. CRITICAL: These directions must remain light for prosperity and growth.';
          remedialAction += ' URGENT: Remove heavy structures immediately.';
        }
      } else {
        reasoning = `Insufficient area in ${zone.direction} (${zone.normalizedValue.toFixed(2)}x average) weakens structural support`;
        remedialAction = `Increase construction/mass in ${zone.direction} zone. Add structural strength.`;
        
        if (mainDir === 'SW' || mainDir === 'S' || mainDir === 'W') {
          reasoning += '. IMPORTANT: These directions need strength for stability and grounding.';
          remedialAction += ' Recommended: Add heavy walls or structures.';
        }
      }
      
      priorityCorrectionZones.push({
        zone,
        priority: zone.priority,
        issue: `${zone.balanceStatus} area`,
        currentArea: zone.absoluteArea,
        targetArea,
        correction,
        correctionAmount,
        impact,
        reasoning,
        remedialAction
      });
    }
  }
  
  // Bar chart data
  const barChartData = {
    labels: directionAreas.map(d => d.directionCode),
    values: directionAreas.map(d => d.absoluteArea),
    colors: directionAreas.map(d => d.colorCode),
    thresholds: {
      upper: thresholds.upperBalanceThreshold,
      average: thresholds.averageArea,
      lower: thresholds.lowerBalanceThreshold
    }
  };
  
  // Directional balance summary (quadrants)
  const northernQuadrant = mainDirectionGroups.filter(g => ['N', 'NE', 'NW'].includes(g.directionCode));
  const easternQuadrant = mainDirectionGroups.filter(g => ['E', 'NE', 'SE'].includes(g.directionCode));
  const southernQuadrant = mainDirectionGroups.filter(g => ['S', 'SE', 'SW'].includes(g.directionCode));
  const westernQuadrant = mainDirectionGroups.filter(g => ['W', 'NW', 'SW'].includes(g.directionCode));
  
  const directionalBalanceSummary = {
    northernQuadrant: {
      status: northernQuadrant.every(g => g.balanceStatus === 'balanced') ? 'Balanced' : 'Needs adjustment',
      area: northernQuadrant.reduce((sum, g) => sum + g.totalArea, 0),
      balance: Math.round((northernQuadrant.reduce((sum, g) => sum + g.normalizedValue, 0) / northernQuadrant.length) * 100)
    },
    easternQuadrant: {
      status: easternQuadrant.every(g => g.balanceStatus === 'balanced') ? 'Balanced' : 'Needs adjustment',
      area: easternQuadrant.reduce((sum, g) => sum + g.totalArea, 0),
      balance: Math.round((easternQuadrant.reduce((sum, g) => sum + g.normalizedValue, 0) / easternQuadrant.length) * 100)
    },
    southernQuadrant: {
      status: southernQuadrant.every(g => g.balanceStatus === 'balanced') ? 'Balanced' : 'Needs adjustment',
      area: southernQuadrant.reduce((sum, g) => sum + g.totalArea, 0),
      balance: Math.round((southernQuadrant.reduce((sum, g) => sum + g.normalizedValue, 0) / southernQuadrant.length) * 100)
    },
    westernQuadrant: {
      status: westernQuadrant.every(g => g.balanceStatus === 'balanced') ? 'Balanced' : 'Needs adjustment',
      area: westernQuadrant.reduce((sum, g) => sum + g.totalArea, 0),
      balance: Math.round((westernQuadrant.reduce((sum, g) => sum + g.normalizedValue, 0) / westernQuadrant.length) * 100)
    }
  };
  
  // Recommendations
  const recommendations: string[] = [];
  
  recommendations.push(
    `Balance Index: ${Math.round(balanceIndex)}/100 | Balanced Zones: ${balancedZones.length}/32 | Excessive: ${excessiveZones.length} | Deficient: ${deficientZones.length}`
  );
  
  if (balanceIndex >= 80) {
    recommendations.push('✅ Excellent area balance across all directions!');
  } else if (balanceIndex >= 65) {
    recommendations.push('👍 Good area balance with minor adjustments recommended');
  } else if (balanceIndex >= 50) {
    recommendations.push('⚠️ Moderate imbalances detected - corrections recommended');
  } else {
    recommendations.push('🔴 Significant area imbalances - structural corrections needed');
  }
  
  recommendations.push(
    `Average Zone Area: ${averageZoneArea.toFixed(2)} | Std Dev: ${areaStandardDeviation.toFixed(2)}`
  );
  
  if (priorityCorrectionZones.length > 0) {
    const criticalCount = priorityCorrectionZones.filter(p => p.impact === 'critical').length;
    const highCount = priorityCorrectionZones.filter(p => p.impact === 'high').length;
    
    if (criticalCount > 0) {
      recommendations.push(`🔴 ${criticalCount} CRITICAL correction zone(s) requiring immediate action`);
    }
    if (highCount > 0) {
      recommendations.push(`⚠️ ${highCount} high-priority correction zone(s) identified`);
    }
    
    recommendations.push(`Top priority: ${priorityCorrectionZones[0].remedialAction}`);
  }
  
  // Check critical directions
  const neGroup = mainDirectionGroups.find(g => g.directionCode === 'NE');
  if (neGroup && neGroup.balanceStatus === 'excessive') {
    recommendations.push('🔴 CRITICAL: Northeast is excessive - must reduce immediately for prosperity!');
  }
  
  const swGroup = mainDirectionGroups.find(g => g.directionCode === 'SW');
  if (swGroup && swGroup.balanceStatus === 'deficient') {
    recommendations.push('🔴 CRITICAL: Southwest is deficient - increase mass for stability!');
  }
  
  recommendations.push(
    `Quadrant Balance: N ${directionalBalanceSummary.northernQuadrant.balance}% | E ${directionalBalanceSummary.easternQuadrant.balance}% | S ${directionalBalanceSummary.southernQuadrant.balance}% | W ${directionalBalanceSummary.westernQuadrant.balance}%`
  );
  
  return {
    type: 'menna',
    timestamp: new Date(),
    boundaryPoints,
    recommendations,
    data: {
      directionAreas,
      mainDirectionGroups,
      thresholds,
      totalPlotArea: totalArea,
      averageZoneArea,
      areaStandardDeviation,
      balanceIndex: Math.round(balanceIndex),
      excessiveZones,
      deficientZones,
      balancedZones,
      priorityCorrectionZones,
      barChartData,
      directionalBalanceSummary
    }
  };
}
