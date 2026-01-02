/**
 * Devta + Nighath Analysis
 * 
 * Devta influence on loss, decay, and obstruction.
 * Identifies zones prone to losses based on directional deity influences.
 * 
 * Features:
 * - Direction-wise Devta influence on loss and decay
 * - Heavy and blocked zone identification
 * - Loss type categorization (financial, health, relationship, etc.)
 * - Obstruction and stagnation analysis
 * - Remedial measures to prevent losses
 */

import { Point, BoundingBox, AnalysisResult } from './types';
import { generate32CircleZones, CircleZone } from './circle-zones';

/**
 * Devta influence on Nighath (loss/decay)
 */
export interface DevtaNighathInfo {
  direction: string;
  directionCode: string;
  rulingDevta: string;
  devtaTitle: string;
  nighathInfluence: string;           // Type of loss influence
  primaryLossTypes: string[];         // Types of losses this direction causes
  obstructionType: string;            // Type of blockages
  decayPattern: string;               // How decay manifests
  lossIndicators: string[];           // Signs of loss in this direction
  vulnerableAreas: string[];          // What is vulnerable to loss
  heavinessEffect: string;            // Effect of heavy structures
  blockageEffect: string;             // Effect of blockages
  idealState: string;                 // Ideal condition to prevent loss
  prohibitedState: string;            // Conditions that cause loss
  remedialActions: string[];          // How to prevent/remedy losses
}

/**
 * Loss zone analysis
 */
export interface NighathZoneSector {
  nighath: DevtaNighathInfo;
  zones: CircleZone[];
  coverage: number;
  isHeavy: boolean;                   // Has heavy structures
  isBlocked: boolean;                 // Has blockages/obstructions
  lossProne: boolean;                 // Prone to losses
  lossSeverity: 'critical' | 'high' | 'medium' | 'low' | 'minimal';
  lossScore: number;                  // 0-100, higher means more loss-prone
  obstructionScore: number;           // 0-100, higher means more obstructed
  decayRisk: number;                  // 0-100, risk of decay/deterioration
  activeLosses: Array<{
    type: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
  }>;
  recommendations: string[];
}

/**
 * Devta + Nighath analysis result
 */
export interface DevtaNighathAnalysisResult extends AnalysisResult {
  recommendations: string[];
  data: {
    sectors: NighathZoneSector[];
    lossProneZones: NighathZoneSector[];      // Zones with high loss potential
    criticalLossZones: NighathZoneSector[];   // Zones with critical losses
    overallLossRisk: number;                  // 0-100
    obstructionLevel: number;                 // 0-100
    decayIndex: number;                       // 0-100
    lossCategories: {
      financial: NighathZoneSector[];
      health: NighathZoneSector[];
      relationships: NighathZoneSector[];
      opportunity: NighathZoneSector[];
      peace: NighathZoneSector[];
      spiritual: NighathZoneSector[];
    };
    preventiveMeasures: Array<{
      zone: string;
      lossType: string;
      action: string;
      urgency: 'immediate' | 'soon' | 'moderate' | 'low';
    }>;
    heavyZoneImpact: {
      beneficial: string[];              // Directions where heaviness is good
      harmful: string[];                 // Directions where heaviness causes loss
    };
  };
}

/**
 * Complete Devta + Nighath mappings for 8 directions
 */
const DEVTA_NIGHATH_MAP: DevtaNighathInfo[] = [
  {
    direction: 'North',
    directionCode: 'N',
    rulingDevta: 'Kubera',
    devtaTitle: 'Lord of Wealth',
    nighathInfluence: 'Financial Loss and Poverty',
    primaryLossTypes: ['Financial losses', 'Wealth depletion', 'Income blockage', 'Savings loss'],
    obstructionType: 'Wealth obstruction',
    decayPattern: 'Gradual financial decline',
    lossIndicators: [
      'Blocked cash flow',
      'Unexpected expenses',
      'Business losses',
      'Investment failures',
      'Salary problems'
    ],
    vulnerableAreas: ['Income', 'Savings', 'Wealth accumulation', 'Financial growth'],
    heavinessEffect: 'Heavy structures in North block wealth flow',
    blockageEffect: 'Blockages cause severe financial stagnation',
    idealState: 'Open, light, clean with good flow',
    prohibitedState: 'Heavy, blocked, cluttered, closed',
    remedialActions: [
      'Remove heavy structures from North',
      'Keep North open and light',
      'Install water features to enhance flow',
      'Use light colors (white, silver, green)',
      'Regular cleaning and decluttering',
      'Place Kubera yantra or wealth symbols'
    ]
  },
  {
    direction: 'Northeast',
    directionCode: 'NE',
    rulingDevta: 'Ishana (Shiva)',
    devtaTitle: 'Supreme Divine Lord',
    nighathInfluence: 'Spiritual Loss and Mental Disturbance',
    primaryLossTypes: ['Spiritual degradation', 'Mental peace loss', 'Divine grace loss', 'Wisdom decline'],
    obstructionType: 'Spiritual blockage',
    decayPattern: 'Mental and spiritual deterioration',
    lossIndicators: [
      'Loss of mental clarity',
      'Spiritual confusion',
      'Lack of divine blessings',
      'Anxiety and stress',
      'Loss of wisdom and direction'
    ],
    vulnerableAreas: ['Spiritual growth', 'Mental peace', 'Divine connection', 'Clarity'],
    heavinessEffect: 'CRITICAL: Heavy construction causes severe spiritual and mental losses',
    blockageEffect: 'Blockages result in complete spiritual stagnation',
    idealState: 'Open, elevated, light, pure, with water element',
    prohibitedState: 'CRITICAL: Heavy, low, dirty, blocked, impure',
    remedialActions: [
      'URGENT: Remove all heavy structures from Northeast',
      'Keep extremely clean and pure',
      'Create open space or courtyard',
      'Add water features or water storage',
      'Use white/light blue colors',
      'Perform regular spiritual purification',
      'Install Shiva symbols or crystals'
    ]
  },
  {
    direction: 'East',
    directionCode: 'E',
    rulingDevta: 'Indra',
    devtaTitle: 'King of Gods',
    nighathInfluence: 'Social Loss and Reputation Damage',
    primaryLossTypes: ['Social status loss', 'Reputation damage', 'Relationship losses', 'Authority decline'],
    obstructionType: 'Social obstruction',
    decayPattern: 'Gradual loss of social standing',
    lossIndicators: [
      'Loss of respect and honor',
      'Social isolation',
      'Damaged relationships',
      'Loss of leadership',
      'Conflicts and enemies'
    ],
    vulnerableAreas: ['Social status', 'Reputation', 'Relationships', 'Authority', 'Recognition'],
    heavinessEffect: 'Heavy structures reduce social opportunities',
    blockageEffect: 'Blockages cause social isolation and conflicts',
    idealState: 'Open, bright, welcoming with good sunlight',
    prohibitedState: 'Dark, closed, blocked, unwelcoming',
    remedialActions: [
      'Keep East open and bright',
      'Ensure morning sunlight entry',
      'Remove obstructions and clutter',
      'Use red/orange colors for vitality',
      'Install social harmony symbols',
      'Regular social activities in East area'
    ]
  },
  {
    direction: 'Southeast',
    directionCode: 'SE',
    rulingDevta: 'Agni',
    devtaTitle: 'Lord of Fire',
    nighathInfluence: 'Health Loss and Energy Depletion',
    primaryLossTypes: ['Health deterioration', 'Energy loss', 'Digestive issues', 'Vitality decline'],
    obstructionType: 'Energy blockage',
    decayPattern: 'Health and energy decay',
    lossIndicators: [
      'Low energy and fatigue',
      'Digestive problems',
      'Metabolism issues',
      'Fire accidents',
      'Chronic health issues'
    ],
    vulnerableAreas: ['Health', 'Digestion', 'Energy levels', 'Vitality', 'Metabolism'],
    heavinessEffect: 'Heavy structures acceptable but should allow fire activities',
    blockageEffect: 'Blockages cause severe health and digestive problems',
    idealState: 'Active with fire element, kitchen, electrical activities',
    prohibitedState: 'Water features, cold, stagnant, no fire activities',
    remedialActions: [
      'Establish kitchen in Southeast',
      'Keep fire element active',
      'Remove water features from SE',
      'Use red/orange colors',
      'Ensure proper ventilation',
      'Install Agni symbols or red pyramid'
    ]
  },
  {
    direction: 'South',
    directionCode: 'S',
    rulingDevta: 'Yama',
    devtaTitle: 'Lord of Death and Dharma',
    nighathInfluence: 'Longevity Loss and Legal Issues',
    primaryLossTypes: ['Health decline', 'Longevity reduction', 'Legal troubles', 'Discipline loss'],
    obstructionType: 'Life force obstruction',
    decayPattern: 'Premature aging and health decay',
    lossIndicators: [
      'Chronic health issues',
      'Premature aging',
      'Legal problems',
      'Lack of discipline',
      'Life span concerns'
    ],
    vulnerableAreas: ['Longevity', 'Health', 'Legal matters', 'Discipline', 'Dharma'],
    heavinessEffect: 'Heaviness is BENEFICIAL in South - provides protection',
    blockageEffect: 'Openness/lightness in South causes losses',
    idealState: 'Heavy, closed, strong with high structures',
    prohibitedState: 'Open, light, low structures, main entrance',
    remedialActions: [
      'Build heavy walls in South',
      'Avoid openings and windows',
      'Place heavy furniture and storage',
      'Use dark colors (brown, black)',
      'Install Yama yantra for protection',
      'Keep this area strong and closed'
    ]
  },
  {
    direction: 'Southwest',
    directionCode: 'SW',
    rulingDevta: 'Nirriti',
    devtaTitle: 'Goddess of Destruction',
    nighathInfluence: 'Relationship Loss and Property Issues',
    primaryLossTypes: ['Relationship breakdown', 'Property loss', 'Instability', 'Mental disturbances'],
    obstructionType: 'Stability obstruction',
    decayPattern: 'Relationship and property decay',
    lossIndicators: [
      'Marital problems',
      'Family conflicts',
      'Property disputes',
      'Mental instability',
      'Insecurity and fear'
    ],
    vulnerableAreas: ['Relationships', 'Property', 'Stability', 'Mental health', 'Security'],
    heavinessEffect: 'Heaviness is CRITICAL and BENEFICIAL - must be heavy',
    blockageEffect: 'Lightness/openness causes severe losses',
    idealState: 'CRITICAL: Must be heavy, high, closed, strong',
    prohibitedState: 'CRITICAL: Light, open, low, weak structures',
    remedialActions: [
      'URGENT: Build heaviest structures in Southwest',
      'Place master bedroom in SW',
      'Maximum height in this direction',
      'Use heavy materials (stone, concrete)',
      'Dark earth tones mandatory',
      'Install protective yantras',
      'Strengthen walls and foundation'
    ]
  },
  {
    direction: 'West',
    directionCode: 'W',
    rulingDevta: 'Varuna',
    devtaTitle: 'Lord of Water',
    nighathInfluence: 'Profit Loss and Emotional Disturbance',
    primaryLossTypes: ['Profit loss', 'Gains reduction', 'Emotional instability', 'Family discord'],
    obstructionType: 'Gains obstruction',
    decayPattern: 'Financial and emotional decay',
    lossIndicators: [
      'Loss of profits',
      'Reduced gains',
      'Emotional problems',
      'Family conflicts',
      'Children\'s issues'
    ],
    vulnerableAreas: ['Profits', 'Gains', 'Emotions', 'Family harmony', 'Children welfare'],
    heavinessEffect: 'Moderate heaviness acceptable',
    blockageEffect: 'Blockages reduce profits and gains',
    idealState: 'Moderate structure with proper ventilation',
    prohibitedState: 'Too open or too blocked',
    remedialActions: [
      'Maintain moderate structure in West',
      'Ensure proper air circulation',
      'Use white/blue colors',
      'Place Varuna symbols',
      'Keep family gathering spaces',
      'Regular emotional cleansing rituals'
    ]
  },
  {
    direction: 'Northwest',
    directionCode: 'NW',
    rulingDevta: 'Vayu',
    devtaTitle: 'Lord of Wind',
    nighathInfluence: 'Communication Loss and Support Breakdown',
    primaryLossTypes: ['Communication breakdown', 'Support loss', 'Partnership issues', 'Travel problems'],
    obstructionType: 'Movement obstruction',
    decayPattern: 'Communication and support decay',
    lossIndicators: [
      'Poor communication',
      'Loss of supporters',
      'Partnership failures',
      'Travel obstacles',
      'Network breakdown'
    ],
    vulnerableAreas: ['Communication', 'Support systems', 'Partnerships', 'Networking', 'Travel'],
    heavinessEffect: 'Heavy structures cause loss of support and mobility',
    blockageEffect: 'Should be relatively open for air flow',
    idealState: 'Light, open, allowing movement and air',
    prohibitedState: 'Too heavy, permanently blocked',
    remedialActions: [
      'Keep Northwest light and open',
      'Allow air circulation',
      'Use light colors (white, gray)',
      'Place moving elements',
      'Install Vayu symbols',
      'Maintain guest relations in NW'
    ]
  }
];

/**
 * Loss severity thresholds
 */
const LOSS_SEVERITY_THRESHOLDS = {
  critical: 80,
  high: 60,
  medium: 40,
  low: 20
};

/**
 * Options for Devta + Nighath analysis
 */
export interface DevtaNighathAnalysisOptions {
  northRotation?: number;
  heavyZones?: string[];              // Directions with heavy structures
  blockedZones?: string[];            // Directions with blockages
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
 * Calculate zone coverage
 */
function calculateZoneCoverage(zones: CircleZone[], boundary: Point[], center: Point, radius: number): number {
  let totalSamples = 0, insideSamples = 0;
  const samplesPerZone = 20;
  for (const zone of zones) {
    for (let i = 0; i < samplesPerZone; i++) {
      const angle = (zone.startAngle + (zone.endAngle - zone.startAngle) * Math.random()) * Math.PI / 180;
      const dist = radius * (0.3 + 0.7 * Math.random());
      const point: Point = {
        x: center.x + dist * Math.sin(angle),
        y: center.y - dist * Math.cos(angle)
      };
      totalSamples++;
      if (isPointInPolygon(point, boundary)) insideSamples++;
    }
  }
  return totalSamples > 0 ? (insideSamples / totalSamples) * 100 : 0;
}

/**
 * Get main direction from zone
 */
function getMainDirection(zone: CircleZone): string {
  const mainDirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  for (const dir of mainDirs) {
    if (zone.directionCode.startsWith(dir) || zone.directionCode === dir) return dir;
  }
  return 'N';
}

/**
 * Calculate loss score based on conditions
 */
function calculateLossScore(
  nighath: DevtaNighathInfo,
  isHeavy: boolean,
  isBlocked: boolean
): number {
  let score = 0;

  // Directions where heaviness is beneficial (S, SW)
  const heavinessBeneficial = ['S', 'SW'];
  // Directions where heaviness is harmful (N, NE, E, NW)
  const heavinessHarmful = ['N', 'NE', 'E', 'NW'];
  // Directions where blockage is always harmful
  const blockageHarmful = ['N', 'NE', 'E', 'SE', 'W', 'NW'];

  if (heavinessBeneficial.includes(nighath.directionCode)) {
    // Heaviness is good here, lack of it causes loss
    if (!isHeavy) {
      score += 60;
    }
  } else if (heavinessHarmful.includes(nighath.directionCode)) {
    // Heaviness causes loss here
    if (isHeavy) {
      score += nighath.directionCode === 'NE' ? 90 : 60; // NE is critical
    }
  }

  // Blockages
  if (blockageHarmful.includes(nighath.directionCode) && isBlocked) {
    score += nighath.directionCode === 'NE' ? 80 : 50;
  }

  return Math.min(100, score);
}

/**
 * Calculate obstruction score
 */
function calculateObstructionScore(nighath: DevtaNighathInfo, isBlocked: boolean, isHeavy: boolean): number {
  if (!isBlocked && !isHeavy) return 10;
  
  let score = 0;
  if (isBlocked) score += 50;
  if (isHeavy && !['S', 'SW'].includes(nighath.directionCode)) score += 30;
  
  return Math.min(100, score);
}

/**
 * Calculate decay risk
 */
function calculateDecayRisk(lossScore: number, obstructionScore: number): number {
  return Math.round((lossScore + obstructionScore) / 2);
}

/**
 * Determine loss severity
 */
function determineLossSeverity(lossScore: number): 'critical' | 'high' | 'medium' | 'low' | 'minimal' {
  if (lossScore >= LOSS_SEVERITY_THRESHOLDS.critical) return 'critical';
  if (lossScore >= LOSS_SEVERITY_THRESHOLDS.high) return 'high';
  if (lossScore >= LOSS_SEVERITY_THRESHOLDS.medium) return 'medium';
  if (lossScore >= LOSS_SEVERITY_THRESHOLDS.low) return 'low';
  return 'minimal';
}

/**
 * Identify active losses
 */
function identifyActiveLosses(
  nighath: DevtaNighathInfo,
  isHeavy: boolean,
  isBlocked: boolean,
  lossScore: number
): Array<{ type: string; description: string; severity: 'critical' | 'high' | 'medium' | 'low' }> {
  const losses: Array<{ type: string; description: string; severity: 'critical' | 'high' | 'medium' | 'low' }> = [];
  
  if (lossScore < 40) return losses;

  const severity = determineLossSeverity(lossScore);
  
  for (const lossType of nighath.primaryLossTypes.slice(0, 2)) {
    losses.push({
      type: lossType,
      description: `${nighath.direction} ${isHeavy ? 'heaviness' : ''} ${isBlocked ? 'blockage' : ''} causing ${lossType.toLowerCase()}`,
      severity: severity as 'critical' | 'high' | 'medium' | 'low'
    });
  }
  
  return losses;
}

/**
 * Generate sector recommendations
 */
function generateNighathRecommendations(sector: NighathZoneSector): string[] {
  const recs: string[] = [];
  const { nighath, isHeavy, isBlocked, lossSeverity, lossScore } = sector;

  if (lossSeverity === 'critical') {
    recs.push(`⚠️ CRITICAL LOSS ZONE: ${nighath.direction} (${nighath.rulingDevta}) - Immediate action required!`);
    recs.push(`Primary loss types: ${nighath.primaryLossTypes.slice(0, 2).join(', ')}`);
  }

  if (nighath.directionCode === 'NE' && (isHeavy || isBlocked)) {
    recs.push(`🔴 URGENT: Northeast must be open and light. Current state causing severe spiritual and mental losses.`);
    recs.push(`Remove all heavy structures and blockages immediately from NE.`);
  }

  if (['S', 'SW'].includes(nighath.directionCode) && !isHeavy) {
    recs.push(`⚠️ ${nighath.direction} lacks required heaviness. Add heavy structures to prevent ${nighath.primaryLossTypes[0]}.`);
  }

  if (['N', 'E', 'NW'].includes(nighath.directionCode) && isHeavy) {
    recs.push(`Heavy structures in ${nighath.direction} causing losses. Lighten this area.`);
  }

  if (isBlocked && !['S', 'SW'].includes(nighath.directionCode)) {
    recs.push(`Remove blockages from ${nighath.direction} to restore flow and prevent ${nighath.obstructionType}.`);
  }

  if (lossScore >= 60) {
    recs.push(`Remedial actions: ${nighath.remedialActions.slice(0, 2).join(' ')}`);
  }

  return recs;
}

/**
 * Generate Devta + Nighath analysis
 */
export function generateDevtaNighath(
  boundaryPoints: Point[],
  options: DevtaNighathAnalysisOptions = {}
): DevtaNighathAnalysisResult {
  const {
    northRotation = 0,
    heavyZones = [],
    blockedZones = []
  } = options;

  const bbox = calculateBoundingBox(boundaryPoints);
  const center: Point = { x: bbox.centerX, y: bbox.centerY };
  const radius = Math.min(bbox.width, bbox.height) / 2;

  const circleZones = generate32CircleZones(center.x, center.y, radius, northRotation);
  const allZones = circleZones.zones;

  // Group zones by direction
  const directionZones: { [key: string]: CircleZone[] } = {};
  for (const zone of allZones) {
    const mainDir = getMainDirection(zone);
    if (!directionZones[mainDir]) directionZones[mainDir] = [];
    directionZones[mainDir].push(zone);
  }

  // Analyze sectors
  const sectors: NighathZoneSector[] = [];
  let totalLoss = 0;
  let totalObstruction = 0;
  let totalDecay = 0;

  const lossCategories: {
    financial: NighathZoneSector[];
    health: NighathZoneSector[];
    relationships: NighathZoneSector[];
    opportunity: NighathZoneSector[];
    peace: NighathZoneSector[];
    spiritual: NighathZoneSector[];
  } = {
    financial: [],
    health: [],
    relationships: [],
    opportunity: [],
    peace: [],
    spiritual: []
  };

  for (const nighath of DEVTA_NIGHATH_MAP) {
    const zones = directionZones[nighath.directionCode] || [];
    const coverage = calculateZoneCoverage(zones, boundaryPoints, center, radius);
    
    const isHeavy = heavyZones.includes(nighath.directionCode);
    const isBlocked = blockedZones.includes(nighath.directionCode);
    
    const lossScore = calculateLossScore(nighath, isHeavy, isBlocked);
    const obstructionScore = calculateObstructionScore(nighath, isBlocked, isHeavy);
    const decayRisk = calculateDecayRisk(lossScore, obstructionScore);
    const lossProne = lossScore >= 40;
    const lossSeverity = determineLossSeverity(lossScore);
    
    const activeLosses = identifyActiveLosses(nighath, isHeavy, isBlocked, lossScore);

    const sector: NighathZoneSector = {
      nighath,
      zones,
      coverage,
      isHeavy,
      isBlocked,
      lossProne,
      lossSeverity,
      lossScore,
      obstructionScore,
      decayRisk,
      activeLosses,
      recommendations: []
    };

    sector.recommendations = generateNighathRecommendations(sector);
    sectors.push(sector);

    totalLoss += lossScore;
    totalObstruction += obstructionScore;
    totalDecay += decayRisk;

    // Categorize losses
    const lossTypesLower = nighath.primaryLossTypes.map(l => l.toLowerCase()).join(' ');
    if (lossTypesLower.includes('financial') || lossTypesLower.includes('wealth') || lossTypesLower.includes('income')) {
      lossCategories.financial.push(sector);
    }
    if (lossTypesLower.includes('health') || lossTypesLower.includes('energy') || lossTypesLower.includes('longevity')) {
      lossCategories.health.push(sector);
    }
    if (lossTypesLower.includes('relationship') || lossTypesLower.includes('family') || lossTypesLower.includes('marital')) {
      lossCategories.relationships.push(sector);
    }
    if (lossTypesLower.includes('social') || lossTypesLower.includes('opportunity') || lossTypesLower.includes('reputation')) {
      lossCategories.opportunity.push(sector);
    }
    if (lossTypesLower.includes('peace') || lossTypesLower.includes('mental') || lossTypesLower.includes('emotional')) {
      lossCategories.peace.push(sector);
    }
    if (lossTypesLower.includes('spiritual') || lossTypesLower.includes('divine') || lossTypesLower.includes('wisdom')) {
      lossCategories.spiritual.push(sector);
    }
  }

  const overallLossRisk = Math.round(totalLoss / sectors.length);
  const obstructionLevel = Math.round(totalObstruction / sectors.length);
  const decayIndex = Math.round(totalDecay / sectors.length);

  const lossProneZones = sectors.filter(s => s.lossProne);
  const criticalLossZones = sectors.filter(s => s.lossSeverity === 'critical' || s.lossSeverity === 'high');

  // Preventive measures
  const preventiveMeasures: Array<{
    zone: string;
    lossType: string;
    action: string;
    urgency: 'immediate' | 'soon' | 'moderate' | 'low';
  }> = [];

  for (const sector of criticalLossZones) {
    for (const loss of sector.activeLosses.slice(0, 2)) {
      preventiveMeasures.push({
        zone: sector.nighath.direction,
        lossType: loss.type,
        action: sector.nighath.remedialActions[0],
        urgency: loss.severity === 'critical' ? 'immediate' : loss.severity === 'high' ? 'soon' : 'moderate'
      });
    }
  }

  // Heavy zone impact
  const heavyZoneImpact = {
    beneficial: sectors.filter(s => ['S', 'SW'].includes(s.nighath.directionCode) && s.isHeavy).map(s => s.nighath.direction),
    harmful: sectors.filter(s => !['S', 'SW'].includes(s.nighath.directionCode) && s.isHeavy && s.lossScore > 40).map(s => s.nighath.direction)
  };

  // Overall recommendations
  const recommendations: string[] = [];

  recommendations.push(
    `Overall Loss Risk: ${overallLossRisk}/100 | Obstruction Level: ${obstructionLevel}/100 | Decay Index: ${decayIndex}/100`
  );

  if (criticalLossZones.length > 0) {
    recommendations.push(
      `⚠️ ${criticalLossZones.length} CRITICAL loss zones detected requiring immediate remediation!`
    );
    recommendations.push(
      `Critical zones: ${criticalLossZones.map(z => z.nighath.direction).join(', ')}`
    );
  }

  if (heavyZoneImpact.harmful.length > 0) {
    recommendations.push(
      `Heavy structures in ${heavyZoneImpact.harmful.join(', ')} causing losses. Lighten these areas.`
    );
  }

  const neZone = sectors.find(s => s.nighath.directionCode === 'NE');
  if (neZone && (neZone.isHeavy || neZone.isBlocked)) {
    recommendations.push(
      `🔴 CRITICAL: Northeast must be open, light, and elevated. Current state causing severe losses.`
    );
  }

  const swZone = sectors.find(s => s.nighath.directionCode === 'SW');
  if (swZone && !swZone.isHeavy) {
    recommendations.push(
      `⚠️ HIGH: Southwest must be heavy and strong. Current lightness causing instability and losses.`
    );
  }

  if (overallLossRisk >= 60) {
    recommendations.push(
      'High overall loss risk. Comprehensive Vastu corrections needed across multiple directions.'
    );
  }

  recommendations.push(
    'Honor directional Devtas with appropriate offerings and maintain cleanliness to reduce losses.'
  );

  recommendations.push(
    'Regular Vastu purification rituals help mitigate loss influences and restore positive energy flow.'
  );

  return {
    type: 'devta-nighath',
    timestamp: new Date(),
    boundaryPoints,
    recommendations,
    data: {
      sectors,
      lossProneZones,
      criticalLossZones,
      overallLossRisk,
      obstructionLevel,
      decayIndex,
      lossCategories,
      preventiveMeasures,
      heavyZoneImpact
    }
  };
}

export { DEVTA_NIGHATH_MAP };
