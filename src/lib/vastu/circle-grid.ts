/**
 * Circle Grid Analysis
 * 
 * Pure circular balance model using concentric rings and radial divisions.
 * Analyzes symmetry, balance, and harmony in circular geometry.
 * 
 * Features:
 * - Concentric ring structure (5 rings from center to periphery)
 * - 32 radial sector divisions
 * - Radial area comparison across all sectors
 * - Ring-wise balance analysis
 * - Overall symmetry scoring
 * - Directional balance assessment
 */

import { Point, BoundingBox, AnalysisResult } from './types';
import { generate32CircleZones, CircleZone } from './circle-zones';

/**
 * Concentric ring definition
 */
export interface ConcentricRing {
  ringNumber: number;
  name: string;
  sanskritName: string;
  innerRadius: number;      // As percentage of total radius (0-100)
  outerRadius: number;      // As percentage of total radius (0-100)
  significance: string;
  energyType: 'core' | 'inner' | 'middle' | 'outer' | 'peripheral';
  idealCoverage: number;    // Percentage of this ring that should be covered
  element: string;
  quality: string;
}

/**
 * Radial sector in a specific ring
 */
export interface RingSectorInfo {
  ring: ConcentricRing;
  zone: CircleZone;
  coverage: number;         // 0-100
  areaPercentage: number;   // Percentage of total plot area
  deviation: number;        // Difference from ideal coverage
  balance: 'excellent' | 'good' | 'moderate' | 'poor' | 'critical';
}

/**
 * Ring analysis result
 */
export interface RingAnalysis {
  ring: ConcentricRing;
  totalCoverage: number;            // Average coverage across all sectors in this ring
  coverageDeviation: number;        // Standard deviation of coverage
  radialBalance: number;            // 0-100, how balanced across all radial sectors
  sectorCoverages: RingSectorInfo[];
  imbalances: Array<{
    direction: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    issue: string;
    impact: string;
    deviation: number;
  }>;
  recommendations: string[];
}

/**
 * Radial sector (across all rings)
 */
export interface RadialSectorAnalysis {
  zone: CircleZone;
  direction: string;
  totalCoverage: number;            // Coverage across all rings for this direction
  ringCoverages: number[];          // Coverage in each ring
  radialSymmetry: number;           // 0-100, how well this sector is balanced
  oppositeDirection: string;
  oppositeBalance: number;          // Balance with opposite direction
  recommendations: string[];
}

/**
 * Circle Grid analysis result
 */
export interface CircleGridAnalysisResult extends AnalysisResult {
  recommendations: string[];
  data: {
    // Ring analysis
    rings: RingAnalysis[];
    ringBalance: number;              // 0-100, overall ring balance
    
    // Radial analysis
    radialSectors: RadialSectorAnalysis[];
    radialSymmetry: number;           // 0-100, overall radial symmetry
    
    // Directional balance (8 main directions)
    directionalBalance: {
      direction: string;
      coverage: number;
      balance: number;
      oppositeDirection: string;
      oppositeBalance: number;
    }[];
    
    // Overall metrics
    overallSymmetryScore: number;     // 0-100, primary output
    concentricBalance: number;        // 0-100, balance across rings
    radialUniformity: number;         // 0-100, uniformity across sectors
    geometricHarmony: number;         // 0-100, overall geometric harmony
    
    // Imbalance detection
    criticalImbalances: Array<{
      type: 'ring' | 'radial' | 'directional';
      location: string;
      severity: 'critical' | 'high' | 'medium' | 'low';
      issue: string;
      impact: string;
      remedy: string;
    }>;
    
    // Balance visualization data
    ringCoverageChart: { ring: string; coverage: number }[];
    radialCoverageChart: { direction: string; coverage: number }[];
  };
}

/**
 * Define 5 concentric rings
 */
const CONCENTRIC_RINGS: ConcentricRing[] = [
  {
    ringNumber: 1,
    name: 'Core Zone',
    sanskritName: 'केंद्र मंडल',
    innerRadius: 0,
    outerRadius: 20,
    significance: 'Brahmasthana - Sacred central space, should remain open and light',
    energyType: 'core',
    idealCoverage: 0,          // Should be completely open
    element: 'Ether (Akasha)',
    quality: 'Pure consciousness, openness, light'
  },
  {
    ringNumber: 2,
    name: 'Inner Zone',
    sanskritName: 'आंतरिक मंडल',
    innerRadius: 20,
    outerRadius: 40,
    significance: 'Primary living space, active daily life',
    energyType: 'inner',
    idealCoverage: 60,         // Moderate coverage
    element: 'Air (Vayu)',
    quality: 'Movement, breath, circulation'
  },
  {
    ringNumber: 3,
    name: 'Middle Zone',
    sanskritName: 'मध्य मंडल',
    innerRadius: 40,
    outerRadius: 60,
    significance: 'Transitional space, balance between inner and outer',
    energyType: 'middle',
    idealCoverage: 70,         // Good coverage
    element: 'Fire (Agni)',
    quality: 'Transformation, energy, activity'
  },
  {
    ringNumber: 4,
    name: 'Outer Zone',
    sanskritName: 'बाह्य मंडल',
    innerRadius: 60,
    outerRadius: 80,
    significance: 'Protective buffer, structural strength',
    energyType: 'outer',
    idealCoverage: 80,         // Strong coverage
    element: 'Water (Jala)',
    quality: 'Protection, containment, stability'
  },
  {
    ringNumber: 5,
    name: 'Peripheral Zone',
    sanskritName: 'परिधि मंडल',
    innerRadius: 80,
    outerRadius: 100,
    significance: 'Boundary zone, maximum structural strength',
    energyType: 'peripheral',
    idealCoverage: 90,         // Maximum coverage
    element: 'Earth (Prithvi)',
    quality: 'Foundation, grounding, boundary'
  }
];

/**
 * Options for Circle Grid analysis
 */
export interface CircleGridAnalysisOptions {
  northRotation?: number;
  ringCount?: number;         // Default 5
  sectorCount?: number;       // Default 32
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
 * Calculate ring sector coverage
 */
function calculateRingSectorCoverage(
  ring: ConcentricRing,
  zone: CircleZone,
  boundary: Point[],
  center: Point,
  radius: number
): number {
  const samples = 30;
  let insideCount = 0;
  
  for (let i = 0; i < samples; i++) {
    // Random angle within zone
    const angle = (zone.startAngle + (zone.endAngle - zone.startAngle) * Math.random()) * Math.PI / 180;
    
    // Random radius within ring
    const minR = (ring.innerRadius / 100) * radius;
    const maxR = (ring.outerRadius / 100) * radius;
    const dist = minR + (maxR - minR) * Math.random();
    
    const point: Point = {
      x: center.x + dist * Math.sin(angle),
      y: center.y - dist * Math.cos(angle)
    };
    
    if (isPointInPolygon(point, boundary)) {
      insideCount++;
    }
  }
  
  return (insideCount / samples) * 100;
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
  return zone.directionCode;
}

/**
 * Get opposite direction
 */
function getOppositeDirection(dir: string): string {
  const opposites: { [key: string]: string } = {
    'N': 'S', 'NE': 'SW', 'E': 'W', 'SE': 'NW',
    'S': 'N', 'SW': 'NE', 'W': 'E', 'NW': 'SE'
  };
  return opposites[dir] || dir;
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
 * Determine balance level
 */
function determineBalance(deviation: number): 'excellent' | 'good' | 'moderate' | 'poor' | 'critical' {
  const absDeviation = Math.abs(deviation);
  if (absDeviation <= 5) return 'excellent';
  if (absDeviation <= 15) return 'good';
  if (absDeviation <= 30) return 'moderate';
  if (absDeviation <= 50) return 'poor';
  return 'critical';
}

/**
 * Analyze a single ring
 */
function analyzeRing(
  ring: ConcentricRing,
  zones: CircleZone[],
  boundary: Point[],
  center: Point,
  radius: number
): RingAnalysis {
  const sectorCoverages: RingSectorInfo[] = [];
  let totalCoverage = 0;
  
  for (const zone of zones) {
    const coverage = calculateRingSectorCoverage(ring, zone, boundary, center, radius);
    const deviation = coverage - ring.idealCoverage;
    const balance = determineBalance(deviation);
    
    const sectorInfo: RingSectorInfo = {
      ring,
      zone,
      coverage,
      areaPercentage: (coverage * (ring.outerRadius - ring.innerRadius)) / 10000,
      deviation,
      balance
    };
    
    sectorCoverages.push(sectorInfo);
    totalCoverage += coverage;
  }
  
  const avgCoverage = totalCoverage / zones.length;
  const coverages = sectorCoverages.map(s => s.coverage);
  const coverageDeviation = calculateStdDev(coverages);
  
  // Calculate radial balance (lower deviation = better balance)
  const radialBalance = Math.max(0, 100 - coverageDeviation * 2);
  
  // Detect imbalances
  const imbalances: Array<{
    direction: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    issue: string;
    impact: string;
    deviation: number;
  }> = [];
  
  for (const sector of sectorCoverages) {
    if (sector.balance === 'critical' || sector.balance === 'poor') {
      const dir = getMainDirection(sector.zone);
      const severity: 'critical' | 'high' | 'medium' | 'low' = 
        sector.balance === 'critical' ? 'critical' : 
        Math.abs(sector.deviation) > 40 ? 'high' : 'medium';
      
      imbalances.push({
        direction: dir,
        severity,
        issue: sector.deviation > 0 
          ? `Excessive coverage in ${ring.name} (${Math.round(sector.coverage)}% vs ideal ${ring.idealCoverage}%)`
          : `Insufficient coverage in ${ring.name} (${Math.round(sector.coverage)}% vs ideal ${ring.idealCoverage}%)`,
        impact: sector.deviation > 0 
          ? `Blocks ${ring.element} energy flow`
          : `Weakens ${ring.element} foundation`,
        deviation: sector.deviation
      });
    }
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (avgCoverage < ring.idealCoverage - 15) {
    recommendations.push(`Increase coverage in ${ring.name} (currently ${Math.round(avgCoverage)}%, ideal ${ring.idealCoverage}%)`);
  } else if (avgCoverage > ring.idealCoverage + 15) {
    recommendations.push(`Reduce coverage in ${ring.name} (currently ${Math.round(avgCoverage)}%, ideal ${ring.idealCoverage}%)`);
  }
  
  if (coverageDeviation > 20) {
    recommendations.push(`Improve radial uniformity in ${ring.name} (deviation: ${Math.round(coverageDeviation)}%)`);
  }
  
  if (ring.ringNumber === 1 && avgCoverage > 10) {
    recommendations.push(`🔴 CRITICAL: Keep ${ring.name} open and light (Brahmasthana principle)`);
  }
  
  if (imbalances.length > 0) {
    recommendations.push(`Address ${imbalances.length} imbalance(s) in ${ring.name}`);
  }
  
  return {
    ring,
    totalCoverage: avgCoverage,
    coverageDeviation,
    radialBalance,
    sectorCoverages,
    imbalances,
    recommendations
  };
}

/**
 * Analyze radial sector across all rings
 */
function analyzeRadialSector(
  zone: CircleZone,
  ringAnalyses: RingAnalysis[]
): RadialSectorAnalysis {
  const direction = getMainDirection(zone);
  const oppositeDirection = getOppositeDirection(direction);
  
  // Get coverage in each ring
  const ringCoverages: number[] = [];
  let totalCoverage = 0;
  
  for (const ringAnalysis of ringAnalyses) {
    const sector = ringAnalysis.sectorCoverages.find(s => s.zone.directionCode === zone.directionCode);
    if (sector) {
      ringCoverages.push(sector.coverage);
      totalCoverage += sector.coverage;
    } else {
      ringCoverages.push(0);
    }
  }
  
  const avgCoverage = totalCoverage / ringCoverages.length;
  
  // Calculate radial symmetry (should increase from center to periphery)
  let radialSymmetry = 100;
  for (let i = 1; i < ringCoverages.length; i++) {
    const expected = CONCENTRIC_RINGS[i].idealCoverage;
    const actual = ringCoverages[i];
    const deviation = Math.abs(actual - expected);
    radialSymmetry -= deviation / 5;
  }
  radialSymmetry = Math.max(0, Math.min(100, radialSymmetry));
  
  // Calculate opposite balance
  const oppositeSector = ringAnalyses[0].sectorCoverages.find(s => getMainDirection(s.zone) === oppositeDirection);
  const oppositeAvgCoverage = oppositeSector ? 
    ringAnalyses.map(r => r.sectorCoverages.find(s => getMainDirection(s.zone) === oppositeDirection)?.coverage || 0)
      .reduce((a, b) => a + b, 0) / ringAnalyses.length : 0;
  
  const oppositeBalance = 100 - Math.abs(avgCoverage - oppositeAvgCoverage);
  
  const recommendations: string[] = [];
  
  if (radialSymmetry < 70) {
    recommendations.push(`Improve radial progression in ${direction} direction`);
  }
  
  if (oppositeBalance < 70) {
    recommendations.push(`Balance ${direction} with ${oppositeDirection} (difference: ${Math.round(Math.abs(avgCoverage - oppositeAvgCoverage))}%)`);
  }
  
  return {
    zone,
    direction,
    totalCoverage: avgCoverage,
    ringCoverages,
    radialSymmetry,
    oppositeDirection,
    oppositeBalance,
    recommendations
  };
}

/**
 * Generate Circle Grid analysis
 */
export function generateCircleGrid(
  boundaryPoints: Point[],
  options: CircleGridAnalysisOptions = {}
): CircleGridAnalysisResult {
  const { northRotation = 0 } = options;
  
  const bbox = calculateBoundingBox(boundaryPoints);
  const center: Point = { x: bbox.centerX, y: bbox.centerY };
  const radius = Math.min(bbox.width, bbox.height) / 2;
  
  const circleZones = generate32CircleZones(center.x, center.y, radius, northRotation);
  const allZones = circleZones.zones;
  
  // Analyze each ring
  const ringAnalyses: RingAnalysis[] = [];
  for (const ring of CONCENTRIC_RINGS) {
    const ringAnalysis = analyzeRing(ring, allZones, boundaryPoints, center, radius);
    ringAnalyses.push(ringAnalysis);
  }
  
  // Calculate ring balance
  const ringBalanceScores = ringAnalyses.map(r => r.radialBalance);
  const ringBalance = ringBalanceScores.reduce((a, b) => a + b, 0) / ringBalanceScores.length;
  
  // Analyze radial sectors
  const radialSectors: RadialSectorAnalysis[] = [];
  for (const zone of allZones) {
    const radialAnalysis = analyzeRadialSector(zone, ringAnalyses);
    radialSectors.push(radialAnalysis);
  }
  
  // Calculate radial symmetry
  const radialSymmetryScores = radialSectors.map(r => r.radialSymmetry);
  const radialSymmetry = radialSymmetryScores.reduce((a, b) => a + b, 0) / radialSymmetryScores.length;
  
  // Group by main directions (8 directions)
  const directionMap: { [key: string]: RadialSectorAnalysis[] } = {};
  for (const sector of radialSectors) {
    const mainDir = sector.direction;
    if (!directionMap[mainDir]) directionMap[mainDir] = [];
    directionMap[mainDir].push(sector);
  }
  
  // Calculate directional balance
  const directionalBalance: Array<{
    direction: string;
    coverage: number;
    balance: number;
    oppositeDirection: string;
    oppositeBalance: number;
  }> = [];
  
  for (const [dir, sectors] of Object.entries(directionMap)) {
    const avgCoverage = sectors.reduce((sum, s) => sum + s.totalCoverage, 0) / sectors.length;
    const avgBalance = sectors.reduce((sum, s) => sum + s.radialSymmetry, 0) / sectors.length;
    const oppDir = getOppositeDirection(dir);
    const oppSectors = directionMap[oppDir] || [];
    const oppAvgCoverage = oppSectors.length > 0 
      ? oppSectors.reduce((sum, s) => sum + s.totalCoverage, 0) / oppSectors.length 
      : 0;
    const oppBalance = 100 - Math.abs(avgCoverage - oppAvgCoverage);
    
    directionalBalance.push({
      direction: dir,
      coverage: avgCoverage,
      balance: avgBalance,
      oppositeDirection: oppDir,
      oppositeBalance: oppBalance
    });
  }
  
  // Calculate overall metrics
  const concentricBalance = ringBalance;
  const radialUniformity = radialSymmetry;
  
  // Calculate opposite balance for main axis pairs
  const axisBalances = directionalBalance.map(d => d.oppositeBalance);
  const avgAxisBalance = axisBalances.reduce((a, b) => a + b, 0) / axisBalances.length;
  
  // Calculate geometric harmony (combination of all factors)
  const geometricHarmony = (concentricBalance * 0.35 + radialUniformity * 0.35 + avgAxisBalance * 0.3);
  
  // Overall symmetry score (primary output)
  const overallSymmetryScore = Math.round(geometricHarmony);
  
  // Collect critical imbalances
  const criticalImbalances: Array<{
    type: 'ring' | 'radial' | 'directional';
    location: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    issue: string;
    impact: string;
    remedy: string;
  }> = [];
  
  // Ring imbalances
  for (const ringAnalysis of ringAnalyses) {
    for (const imbalance of ringAnalysis.imbalances) {
      criticalImbalances.push({
        type: 'ring',
        location: `${ringAnalysis.ring.name} - ${imbalance.direction}`,
        severity: imbalance.severity,
        issue: imbalance.issue,
        impact: imbalance.impact,
        remedy: imbalance.deviation > 0 
          ? `Reduce built mass in ${imbalance.direction} ${ringAnalysis.ring.name}`
          : `Increase structural presence in ${imbalance.direction} ${ringAnalysis.ring.name}`
      });
    }
  }
  
  // Radial imbalances
  for (const radialSector of radialSectors) {
    if (radialSector.radialSymmetry < 60) {
      criticalImbalances.push({
        type: 'radial',
        location: radialSector.direction,
        severity: radialSector.radialSymmetry < 40 ? 'critical' : 'high',
        issue: `Poor radial progression in ${radialSector.direction}`,
        impact: 'Disrupts energy flow from center to periphery',
        remedy: `Adjust coverage pattern in ${radialSector.direction} to follow concentric progression`
      });
    }
    
    if (radialSector.oppositeBalance < 60) {
      criticalImbalances.push({
        type: 'directional',
        location: `${radialSector.direction} - ${radialSector.oppositeDirection} axis`,
        severity: radialSector.oppositeBalance < 40 ? 'high' : 'medium',
        issue: `Imbalance between ${radialSector.direction} and ${radialSector.oppositeDirection}`,
        impact: 'Creates directional energy imbalance',
        remedy: `Balance coverage between ${radialSector.direction} and ${radialSector.oppositeDirection}`
      });
    }
  }
  
  // Visualization data
  const ringCoverageChart = ringAnalyses.map(r => ({
    ring: r.ring.name,
    coverage: Math.round(r.totalCoverage)
  }));
  
  const radialCoverageChart = directionalBalance.map(d => ({
    direction: d.direction,
    coverage: Math.round(d.coverage)
  }));
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  recommendations.push(
    `Overall Symmetry: ${overallSymmetryScore}/100 | Concentric: ${Math.round(concentricBalance)}/100 | Radial: ${Math.round(radialUniformity)}/100 | Harmony: ${Math.round(geometricHarmony)}/100`
  );
  
  if (overallSymmetryScore >= 85) {
    recommendations.push('✅ Excellent circular balance and symmetry!');
  } else if (overallSymmetryScore >= 70) {
    recommendations.push('👍 Good circular balance with minor adjustments needed');
  } else if (overallSymmetryScore >= 50) {
    recommendations.push('⚠️ Moderate imbalances detected - improvements recommended');
  } else {
    recommendations.push('🔴 Significant imbalances - structural corrections needed');
  }
  
  if (criticalImbalances.length > 0) {
    const criticalCount = criticalImbalances.filter(i => i.severity === 'critical').length;
    const highCount = criticalImbalances.filter(i => i.severity === 'high').length;
    if (criticalCount > 0) {
      recommendations.push(`🔴 ${criticalCount} critical imbalance(s) requiring immediate attention`);
    }
    if (highCount > 0) {
      recommendations.push(`⚠️ ${highCount} high-priority imbalance(s) detected`);
    }
  }
  
  // Core zone check
  const coreRing = ringAnalyses[0];
  if (coreRing.totalCoverage > 20) {
    recommendations.push('🔴 CRITICAL: Core zone (Brahmasthana) must be kept open! Current excessive coverage disrupts central energy.');
  } else if (coreRing.totalCoverage > 10) {
    recommendations.push('⚠️ Core zone has some coverage - should remain completely open for optimal energy flow.');
  } else {
    recommendations.push('✅ Core zone is appropriately open (Brahmasthana principle maintained).');
  }
  
  // Peripheral zone check
  const peripheralRing = ringAnalyses[ringAnalyses.length - 1];
  if (peripheralRing.totalCoverage < 70) {
    recommendations.push('⚠️ Peripheral zone needs stronger coverage for boundary protection and stability.');
  }
  
  // Axis balance
  const poorAxisBalances = directionalBalance.filter(d => d.oppositeBalance < 60);
  if (poorAxisBalances.length > 0) {
    recommendations.push(`Balance needed on ${poorAxisBalances.length} directional axis/axes`);
  }
  
  recommendations.push(
    `Ring Balance: ${Math.round(ringBalance)}/100 | Radial Symmetry: ${Math.round(radialSymmetry)}/100`
  );
  
  return {
    type: 'circle-grid',
    timestamp: new Date(),
    boundaryPoints,
    recommendations,
    data: {
      rings: ringAnalyses,
      ringBalance,
      radialSectors,
      radialSymmetry,
      directionalBalance,
      overallSymmetryScore,
      concentricBalance,
      radialUniformity,
      geometricHarmony,
      criticalImbalances,
      ringCoverageChart,
      radialCoverageChart
    }
  };
}

export { CONCENTRIC_RINGS };
