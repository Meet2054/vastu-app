/**
 * Division of Devta Analysis
 * 
 * Full Devta dominance map with 32+ angular divisions.
 * Analyzes which deity rules each micro-division and calculates dominance patterns.
 * 
 * Features:
 * - 32-zone angular micro-division system
 * - Devta assignment per zone
 * - Area percentage calculation per Devta
 * - Dominance vs deficiency analysis
 * - Ideal balance comparison
 * - Devta harmony scoring
 */

import { Point, BoundingBox, AnalysisResult } from './types';
import { generate32CircleZones, CircleZone } from './circle-zones';

/**
 * Devta (Deity) information
 */
export interface DevtaInfo {
  name: string;
  sanskritName: string;
  direction: string;
  directionCode: string;
  element: 'water' | 'ether' | 'fire' | 'earth' | 'air';
  primaryQualities: string[];
  governedAspects: string[];
  idealPercentage: number;      // Ideal coverage percentage
  color: string;
  planetaryRuler: string;
}

/**
 * Devta zone assignment
 */
export interface DevtaZoneAssignment {
  zone: CircleZone;
  devta: DevtaInfo;
  coverage: number;              // 0-100, percentage of zone inside boundary
  areaContribution: number;      // Actual area contribution in square units
  isFullyCovered: boolean;
  isMajorityInside: boolean;
}

/**
 * Devta dominance analysis
 */
export interface DevtaDominanceInfo {
  devta: DevtaInfo;
  zones: CircleZone[];
  zoneCount: number;
  totalCoverage: number;         // Sum of coverage percentages
  areaPercentage: number;        // Percentage of total property area
  idealPercentage: number;       // Ideal target percentage
  dominanceScore: number;        // -100 to +100 (negative = deficient, positive = excessive)
  dominanceLevel: 'highly-excessive' | 'excessive' | 'balanced' | 'deficient' | 'highly-deficient';
  implications: string[];
  recommendations: string[];
}

/**
 * Division of Devta analysis result
 */
export interface DivisionOfDevtaAnalysisResult extends AnalysisResult {
  recommendations: string[];
  data: {
    zoneAssignments: DevtaZoneAssignment[];
    devtaDominance: DevtaDominanceInfo[];
    overallBalance: number;       // 0-100, higher = better balance
    dominanceChart: {
      excessiveDevtas: string[];  // Over-represented deities
      balancedDevtas: string[];   // Well-balanced deities
      deficientDevtas: string[];  // Under-represented deities
    };
    criticalImbalances: Array<{
      devta: string;
      type: 'excessive' | 'deficient';
      severity: 'critical' | 'high' | 'medium' | 'low';
      currentPercentage: number;
      idealPercentage: number;
      deviation: number;
      impact: string;
      remedy: string;
    }>;
    harmonyIndex: number;         // 0-100, overall Devta harmony
    elementalBalance: {
      water: number;
      ether: number;
      fire: number;
      earth: number;
      air: number;
    };
  };
}

/**
 * Complete Devta information for 8 directions
 */
const DEVTA_MAP: DevtaInfo[] = [
  {
    name: 'Kubera',
    sanskritName: 'कुबेर',
    direction: 'North',
    directionCode: 'N',
    element: 'water',
    primaryQualities: ['Wealth', 'Prosperity', 'Abundance', 'Material success'],
    governedAspects: ['Income', 'Cash flow', 'Business growth', 'Financial stability', 'Liquid assets'],
    idealPercentage: 12.5,
    color: 'Blue/Silver',
    planetaryRuler: 'Mercury (Budha)'
  },
  {
    name: 'Ishana',
    sanskritName: 'ईशान (शिव)',
    direction: 'Northeast',
    directionCode: 'NE',
    element: 'ether',
    primaryQualities: ['Divinity', 'Purity', 'Knowledge', 'Spiritual growth'],
    governedAspects: ['Spiritual progress', 'Clarity', 'Divine grace', 'Wisdom', 'Enlightenment', 'Opportunities'],
    idealPercentage: 12.5,
    color: 'White/Crystal',
    planetaryRuler: 'Jupiter (Guru)'
  },
  {
    name: 'Indra (Surya)',
    sanskritName: 'इंद्र (सूर्य)',
    direction: 'East',
    directionCode: 'E',
    element: 'fire',
    primaryQualities: ['Power', 'Status', 'Growth', 'Vitality'],
    governedAspects: ['Social status', 'Recognition', 'Career growth', 'Health', 'New beginnings', 'Energy'],
    idealPercentage: 12.5,
    color: 'Red/Orange',
    planetaryRuler: 'Sun (Surya)'
  },
  {
    name: 'Agni',
    sanskritName: 'अग्नि',
    direction: 'Southeast',
    directionCode: 'SE',
    element: 'fire',
    primaryQualities: ['Energy', 'Transformation', 'Digestion', 'Metabolism'],
    governedAspects: ['Digestive health', 'Energy levels', 'Transformation', 'Food', 'Metabolism', 'Vitality'],
    idealPercentage: 12.5,
    color: 'Red/Orange',
    planetaryRuler: 'Venus (Shukra)'
  },
  {
    name: 'Yama',
    sanskritName: 'यम',
    direction: 'South',
    directionCode: 'S',
    element: 'earth',
    primaryQualities: ['Discipline', 'Longevity', 'Stability', 'Law'],
    governedAspects: ['Life span', 'Discipline', 'Legal matters', 'Stability', 'Mortality', 'Justice'],
    idealPercentage: 12.5,
    color: 'Brown/Black',
    planetaryRuler: 'Mars (Mangal)'
  },
  {
    name: 'Nirriti (Pitru)',
    sanskritName: 'निऋति (पितृ)',
    direction: 'Southwest',
    directionCode: 'SW',
    element: 'earth',
    primaryQualities: ['Foundation', 'Ancestors', 'Stability', 'Protection'],
    governedAspects: ['Ancestral blessings', 'Family stability', 'Property', 'Security', 'Foundation', 'Relationships'],
    idealPercentage: 12.5,
    color: 'Yellow/Brown',
    planetaryRuler: 'Rahu'
  },
  {
    name: 'Varuna',
    sanskritName: 'वरुण',
    direction: 'West',
    directionCode: 'W',
    element: 'water',
    primaryQualities: ['Emotions', 'Profits', 'Gains', 'Fulfillment'],
    governedAspects: ['Profits', 'Gains', 'Emotional balance', 'Returns', 'Pleasure', 'Satisfaction'],
    idealPercentage: 12.5,
    color: 'Blue/White',
    planetaryRuler: 'Saturn (Shani)'
  },
  {
    name: 'Vayu',
    sanskritName: 'वायु',
    direction: 'Northwest',
    directionCode: 'NW',
    element: 'air',
    primaryQualities: ['Movement', 'Change', 'Communication', 'Travel'],
    governedAspects: ['Communication', 'Travel', 'Change', 'Movement', 'Support', 'Networking', 'Expenses'],
    idealPercentage: 12.5,
    color: 'Grey/White',
    planetaryRuler: 'Moon (Chandra)'
  }
];

/**
 * Options for Division of Devta analysis
 */
export interface DivisionOfDevtaAnalysisOptions {
  northRotation?: number;
  detailedZoning?: boolean;      // If true, use more detailed subdivision
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
 * Calculate zone coverage within boundary
 */
function calculateZoneCoverage(
  zone: CircleZone,
  boundary: Point[],
  center: Point,
  radius: number
): { coverage: number; areaContribution: number; isFullyCovered: boolean; isMajorityInside: boolean } {
  const samples = 50; // High sampling for accuracy
  let insideCount = 0;

  for (let i = 0; i < samples; i++) {
    // Random point within the zone
    const angleRange = zone.endAngle - zone.startAngle;
    const angle = (zone.startAngle + angleRange * Math.random()) * Math.PI / 180;
    const dist = radius * (0.2 + 0.8 * Math.random()); // Sample from 20% to 100% of radius

    const point: Point = {
      x: center.x + dist * Math.sin(angle),
      y: center.y - dist * Math.cos(angle)
    };

    if (isPointInPolygon(point, boundary)) {
      insideCount++;
    }
  }

  const coverage = (insideCount / samples) * 100;
  
  // Calculate approximate area contribution
  // Zone area = (angle/360) * π * r²
  const zoneAngleDegrees = zone.endAngle - zone.startAngle;
  const fullZoneArea = (zoneAngleDegrees / 360) * Math.PI * radius * radius;
  const areaContribution = fullZoneArea * (coverage / 100);

  return {
    coverage,
    areaContribution,
    isFullyCovered: coverage >= 95,
    isMajorityInside: coverage >= 50
  };
}

/**
 * Get Devta for a zone
 */
function getDevtaForZone(zone: CircleZone): DevtaInfo {
  // Map zone direction code to Devta
  const dirCode = zone.directionCode;
  
  for (const devta of DEVTA_MAP) {
    if (dirCode === devta.directionCode || dirCode.startsWith(devta.directionCode)) {
      return devta;
    }
  }

  // Fallback to North (Kubera) if no match
  return DEVTA_MAP[0];
}

/**
 * Calculate dominance score
 * Returns: -100 (highly deficient) to +100 (highly excessive)
 */
function calculateDominanceScore(actualPercentage: number, idealPercentage: number): number {
  const deviation = actualPercentage - idealPercentage;
  // Normalize to -100 to +100 range
  // Assuming max deviation is ±25% (double or half of ideal)
  const normalized = (deviation / 25) * 100;
  return Math.max(-100, Math.min(100, normalized));
}

/**
 * Determine dominance level
 */
function determineDominanceLevel(dominanceScore: number): 'highly-excessive' | 'excessive' | 'balanced' | 'deficient' | 'highly-deficient' {
  if (dominanceScore >= 40) return 'highly-excessive';
  if (dominanceScore >= 15) return 'excessive';
  if (dominanceScore >= -15) return 'balanced';
  if (dominanceScore >= -40) return 'deficient';
  return 'highly-deficient';
}

/**
 * Generate Devta implications
 */
function generateDevtaImplications(devta: DevtaInfo, dominanceLevel: string, actualPercentage: number): string[] {
  const implications: string[] = [];

  if (dominanceLevel === 'highly-excessive' || dominanceLevel === 'excessive') {
    implications.push(`Excessive ${devta.name} influence (${actualPercentage.toFixed(1)}%) may over-emphasize ${devta.governedAspects.slice(0, 2).join(' and ')}`);
    implications.push(`Over-development in ${devta.direction} direction`);
    
    if (devta.directionCode === 'NE') {
      implications.push('CRITICAL: Northeast should be minimal. Excessive construction blocks divine grace.');
    } else if (['S', 'SW'].includes(devta.directionCode)) {
      implications.push('POSITIVE: Heavy construction in S/SW is beneficial for stability');
    } else if (['N', 'E', 'W'].includes(devta.directionCode)) {
      implications.push('May block energy flow and opportunities');
    }
  } else if (dominanceLevel === 'deficient' || dominanceLevel === 'highly-deficient') {
    implications.push(`Deficient ${devta.name} influence (${actualPercentage.toFixed(1)}%) weakens ${devta.governedAspects.slice(0, 2).join(' and ')}`);
    implications.push(`Under-development in ${devta.direction} direction`);
    
    if (['S', 'SW'].includes(devta.directionCode)) {
      implications.push('CRITICAL: Insufficient heaviness in S/SW causes instability and losses');
    } else if (devta.directionCode === 'NE') {
      implications.push('POSITIVE: Minimal NE construction is ideal');
    } else if (['N', 'W'].includes(devta.directionCode)) {
      implications.push('May reduce prosperity and gains');
    }
  } else {
    implications.push(`${devta.name} influence is well-balanced at ${actualPercentage.toFixed(1)}%`);
    implications.push(`Good balance in ${devta.direction} direction`);
  }

  return implications;
}

/**
 * Generate Devta recommendations
 */
function generateDevtaRecommendations(devta: DevtaInfo, dominanceLevel: string, actualPercentage: number, idealPercentage: number): string[] {
  const recs: string[] = [];

  if (dominanceLevel === 'highly-excessive' || dominanceLevel === 'excessive') {
    if (['N', 'NE', 'E', 'NW'].includes(devta.directionCode)) {
      recs.push(`Reduce construction in ${devta.direction}. Current ${actualPercentage.toFixed(1)}% exceeds ideal ${idealPercentage}%.`);
      recs.push(`Create open spaces or lighter structures in ${devta.direction}`);
      
      if (devta.directionCode === 'NE') {
        recs.push('URGENT: Remove heavy structures from Northeast. Keep it open and elevated.');
      }
    }
  } else if (dominanceLevel === 'deficient' || dominanceLevel === 'highly-deficient') {
    if (['S', 'SW'].includes(devta.directionCode)) {
      recs.push(`CRITICAL: Increase construction in ${devta.direction}. Current ${actualPercentage.toFixed(1)}% below ideal ${idealPercentage}%.`);
      recs.push(`Build heavy structures in ${devta.direction} for stability`);
      recs.push(`Add multiple stories or heavy materials in ${devta.direction}`);
    } else if (['N', 'W'].includes(devta.directionCode)) {
      recs.push(`Enhance ${devta.direction} area. Current ${actualPercentage.toFixed(1)}% below ideal ${idealPercentage}%.`);
      recs.push(`Ensure ${devta.direction} is well-maintained and functional`);
    }
  } else {
    recs.push(`Maintain current balance in ${devta.direction} (${actualPercentage.toFixed(1)}%)`);
  }

  return recs;
}

/**
 * Identify critical imbalances
 */
function identifyCriticalImbalances(devtaDominance: DevtaDominanceInfo[]): Array<{
  devta: string;
  type: 'excessive' | 'deficient';
  severity: 'critical' | 'high' | 'medium' | 'low';
  currentPercentage: number;
  idealPercentage: number;
  deviation: number;
  impact: string;
  remedy: string;
}> {
  const imbalances: Array<{
    devta: string;
    type: 'excessive' | 'deficient';
    severity: 'critical' | 'high' | 'medium' | 'low';
    currentPercentage: number;
    idealPercentage: number;
    deviation: number;
    impact: string;
    remedy: string;
  }> = [];

  for (const dom of devtaDominance) {
    const deviation = dom.areaPercentage - dom.idealPercentage;
    const absDeviation = Math.abs(deviation);

    if (absDeviation < 5) continue; // Skip minor deviations

    let severity: 'critical' | 'high' | 'medium' | 'low' = 'low';
    if (absDeviation >= 15) severity = 'critical';
    else if (absDeviation >= 10) severity = 'high';
    else if (absDeviation >= 7) severity = 'medium';

    // Special cases
    if (['S', 'SW'].includes(dom.devta.directionCode) && deviation < -5) {
      severity = 'critical'; // Deficiency in S/SW is always critical
    }
    if (dom.devta.directionCode === 'NE' && deviation > 5) {
      severity = 'critical'; // Excess in NE is always critical
    }

    const type: 'excessive' | 'deficient' = deviation > 0 ? 'excessive' : 'deficient';

    imbalances.push({
      devta: dom.devta.name,
      type,
      severity,
      currentPercentage: dom.areaPercentage,
      idealPercentage: dom.idealPercentage,
      deviation: Math.round(deviation * 10) / 10,
      impact: dom.implications[0] || `${type === 'excessive' ? 'Over' : 'Under'}-representation of ${dom.devta.name}`,
      remedy: dom.recommendations[0] || `${type === 'excessive' ? 'Reduce' : 'Increase'} ${dom.devta.direction} area`
    });
  }

  // Sort by severity
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  imbalances.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return imbalances;
}

/**
 * Calculate elemental balance
 */
function calculateElementalBalance(devtaDominance: DevtaDominanceInfo[]): {
  water: number;
  ether: number;
  fire: number;
  earth: number;
  air: number;
} {
  const elements = { water: 0, ether: 0, fire: 0, earth: 0, air: 0 };

  for (const dom of devtaDominance) {
    elements[dom.devta.element] += dom.areaPercentage;
  }

  return elements;
}

/**
 * Generate Division of Devta analysis
 */
export function generateDivisionOfDevta(
  boundaryPoints: Point[],
  options: DivisionOfDevtaAnalysisOptions = {}
): DivisionOfDevtaAnalysisResult {
  const {
    northRotation = 0,
  } = options;

  const bbox = calculateBoundingBox(boundaryPoints);
  const center: Point = { x: bbox.centerX, y: bbox.centerY };
  const radius = Math.min(bbox.width, bbox.height) / 2;

  // Generate 32 circular zones
  const circleZones = generate32CircleZones(center.x, center.y, radius, northRotation);
  const allZones = circleZones.zones;

  // Assign each zone to a Devta and calculate coverage
  const zoneAssignments: DevtaZoneAssignment[] = [];
  let totalAreaCovered = 0;

  for (const zone of allZones) {
    const devta = getDevtaForZone(zone);
    const coverageData = calculateZoneCoverage(zone, boundaryPoints, center, radius);

    zoneAssignments.push({
      zone,
      devta,
      coverage: coverageData.coverage,
      areaContribution: coverageData.areaContribution,
      isFullyCovered: coverageData.isFullyCovered,
      isMajorityInside: coverageData.isMajorityInside
    });

    totalAreaCovered += coverageData.areaContribution;
  }

  // Group by Devta and calculate dominance
  const devtaDominanceMap = new Map<string, {
    devta: DevtaInfo;
    zones: CircleZone[];
    totalCoverage: number;
    totalArea: number;
  }>();

  for (const assignment of zoneAssignments) {
    const key = assignment.devta.directionCode;
    if (!devtaDominanceMap.has(key)) {
      devtaDominanceMap.set(key, {
        devta: assignment.devta,
        zones: [],
        totalCoverage: 0,
        totalArea: 0
      });
    }

    const entry = devtaDominanceMap.get(key)!;
    entry.zones.push(assignment.zone);
    entry.totalCoverage += assignment.coverage;
    entry.totalArea += assignment.areaContribution;
  }

  // Calculate dominance info
  const devtaDominance: DevtaDominanceInfo[] = [];
  let totalDeviationSquared = 0;

  for (const [, entry] of devtaDominanceMap.entries()) {
    const areaPercentage = totalAreaCovered > 0 ? (entry.totalArea / totalAreaCovered) * 100 : 0;
    const idealPercentage = entry.devta.idealPercentage;
    const dominanceScore = calculateDominanceScore(areaPercentage, idealPercentage);
    const dominanceLevel = determineDominanceLevel(dominanceScore);

    const implications = generateDevtaImplications(entry.devta, dominanceLevel, areaPercentage);
    const recommendations = generateDevtaRecommendations(entry.devta, dominanceLevel, areaPercentage, idealPercentage);

    devtaDominance.push({
      devta: entry.devta,
      zones: entry.zones,
      zoneCount: entry.zones.length,
      totalCoverage: entry.totalCoverage,
      areaPercentage,
      idealPercentage,
      dominanceScore,
      dominanceLevel,
      implications,
      recommendations
    });

    // Accumulate deviation for overall balance calculation
    const deviation = areaPercentage - idealPercentage;
    totalDeviationSquared += deviation * deviation;
  }

  // Calculate overall balance (0-100, where 100 = perfect balance)
  // Use root mean square deviation
  const rmsd = Math.sqrt(totalDeviationSquared / devtaDominance.length);
  const overallBalance = Math.max(0, Math.round(100 - rmsd * 4)); // Scale to 0-100

  // Dominance chart
  const dominanceChart = {
    excessiveDevtas: devtaDominance.filter(d => d.dominanceLevel === 'excessive' || d.dominanceLevel === 'highly-excessive').map(d => d.devta.name),
    balancedDevtas: devtaDominance.filter(d => d.dominanceLevel === 'balanced').map(d => d.devta.name),
    deficientDevtas: devtaDominance.filter(d => d.dominanceLevel === 'deficient' || d.dominanceLevel === 'highly-deficient').map(d => d.devta.name)
  };

  // Critical imbalances
  const criticalImbalances = identifyCriticalImbalances(devtaDominance);

  // Harmony index (weighted by importance)
  let harmonyScore = 0;
  for (const dom of devtaDominance) {
    // Critical directions (NE, S, SW) have higher weight
    const weight = ['NE', 'S', 'SW'].includes(dom.devta.directionCode) ? 1.5 : 1.0;
    const balance = Math.max(0, 100 - Math.abs(dom.dominanceScore));
    harmonyScore += balance * weight;
  }
  const totalWeight = devtaDominance.length + 1.5; // 8 + (3 * 0.5 extra weight)
  const harmonyIndex = Math.round(harmonyScore / totalWeight);

  // Elemental balance
  const elementalBalance = calculateElementalBalance(devtaDominance);

  // Overall recommendations
  const recommendations: string[] = [];

  recommendations.push(
    `Overall Devta Balance: ${overallBalance}/100 | Harmony Index: ${harmonyIndex}/100`
  );

  if (criticalImbalances.length > 0) {
    const criticalCount = criticalImbalances.filter(i => i.severity === 'critical').length;
    recommendations.push(
      `🔴 ${criticalImbalances.length} Devta imbalance(s) detected${criticalCount > 0 ? ` (${criticalCount} critical)` : ''}!`
    );
  }

  if (dominanceChart.excessiveDevtas.length > 0) {
    recommendations.push(
      `Excessive dominance: ${dominanceChart.excessiveDevtas.join(', ')}. Reduce construction in these areas.`
    );
  }

  if (dominanceChart.deficientDevtas.length > 0) {
    recommendations.push(
      `Deficient presence: ${dominanceChart.deficientDevtas.join(', ')}. Enhance these areas.`
    );
  }

  // Check critical directions
  const neDom = devtaDominance.find(d => d.devta.directionCode === 'NE');
  if (neDom && neDom.areaPercentage > 15) {
    recommendations.push(
      `⚠️ CRITICAL: Northeast (${neDom.areaPercentage.toFixed(1)}%) exceeds ideal ${neDom.idealPercentage}%. Remove heavy construction!`
    );
  }

  const swDom = devtaDominance.find(d => d.devta.directionCode === 'SW');
  if (swDom && swDom.areaPercentage < 10) {
    recommendations.push(
      `⚠️ CRITICAL: Southwest (${swDom.areaPercentage.toFixed(1)}%) below ideal ${swDom.idealPercentage}%. Add heavy construction!`
    );
  }

  const sDom = devtaDominance.find(d => d.devta.directionCode === 'S');
  if (sDom && sDom.areaPercentage < 10) {
    recommendations.push(
      `⚠️ CRITICAL: South (${sDom.areaPercentage.toFixed(1)}%) below ideal ${sDom.idealPercentage}%. Add heavy construction!`
    );
  }

  recommendations.push(
    `Elemental distribution: Fire ${elementalBalance.fire.toFixed(1)}% | Earth ${elementalBalance.earth.toFixed(1)}% | Water ${elementalBalance.water.toFixed(1)}% | Air ${elementalBalance.air.toFixed(1)}% | Ether ${elementalBalance.ether.toFixed(1)}%`
  );

  if (overallBalance >= 75) {
    recommendations.push('Good overall Devta balance. Minor adjustments recommended.');
  } else if (overallBalance < 50) {
    recommendations.push('Poor Devta balance. Major restructuring may be needed.');
  }

  return {
    type: 'division-of-devta',
    timestamp: new Date(),
    boundaryPoints,
    recommendations,
    data: {
      zoneAssignments,
      devtaDominance,
      overallBalance,
      dominanceChart,
      criticalImbalances,
      harmonyIndex,
      elementalBalance
    }
  };
}

export { DEVTA_MAP };
