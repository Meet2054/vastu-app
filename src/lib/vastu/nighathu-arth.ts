/**
 * Nighathu + Arth Analysis
 * 
 * Loss vs Gain - Financial logic analysis.
 * Analyzes directional wealth curves, structural blockages, and financial leakage points.
 * 
 * Features:
 * - Direction-wise wealth and financial influence
 * - Gain vs loss analysis per direction
 * - Structural blockage detection affecting finances
 * - Financial leakage point identification
 * - Wealth curve mapping
 * - Cash flow optimization recommendations
 */

import { Point, BoundingBox, AnalysisResult } from './types';
import { generate32CircleZones, CircleZone } from './circle-zones';

/**
 * Directional wealth influence
 */
export interface DirectionalWealthInfo {
  direction: string;
  directionCode: string;
  wealthInfluence: 'primary-gain' | 'secondary-gain' | 'neutral' | 'loss-prone' | 'severe-loss';
  gainPotential: number;          // 0-100, higher is better
  lossPotential: number;          // 0-100, higher means more loss
  financialElement: string;       // What financial aspect this controls
  wealthCurveType: string;        // Type of wealth flow
  idealFinancialUsage: string[];  // Best financial activities here
  prohibitedFinancialUsage: string[]; // Financial activities to avoid
  gainIndicators: string[];       // Signs of financial gain
  lossIndicators: string[];       // Signs of financial loss
  blockageImpact: string;         // How blockages affect finances
  heavinessImpact: string;        // How heavy structures affect finances
  wealthFlow: 'inflow' | 'retention' | 'growth' | 'outflow' | 'stagnation';
  remedialWealth: string[];       // Financial remedies
}

/**
 * Financial zone analysis
 */
export interface FinancialZoneSector {
  wealthInfo: DirectionalWealthInfo;
  zones: CircleZone[];
  coverage: number;
  hasBlockage: boolean;
  hasHeavyStructure: boolean;
  hasLeakage: boolean;
  financialScore: number;         // 0-100, overall financial health
  gainScore: number;              // 0-100, gain potential
  lossScore: number;              // 0-100, loss level
  wealthFlowQuality: 'excellent' | 'good' | 'moderate' | 'poor' | 'blocked';
  leakagePoints: Array<{
    type: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    financialImpact: string;
  }>;
  blockageImpact: {
    hasImpact: boolean;
    severity: 'critical' | 'high' | 'medium' | 'low' | 'none';
    description: string;
  };
  recommendations: string[];
}

/**
 * Nighathu + Arth analysis result
 */
export interface NighathuArthAnalysisResult extends AnalysisResult {
  recommendations: string[];
  data: {
    sectors: FinancialZoneSector[];
    wealthCurve: {
      strongGainZones: string[];      // Directions with high gain
      moderateGainZones: string[];    // Directions with moderate gain
      lossProneZones: string[];       // Directions prone to losses
      criticalLeakageZones: string[]; // Critical financial leakage
    };
    overallFinancialHealth: number;   // 0-100
    wealthFlowIndex: number;          // 0-100, how well wealth flows
    leakageIndex: number;             // 0-100, how much leakage exists
    blockageIndex: number;            // 0-100, structural blockages
    financialLeakagePoints: Array<{
      direction: string;
      leakageType: string;
      severity: 'critical' | 'high' | 'medium' | 'low';
      annualImpact: string;           // Estimated impact
      remedy: string;
    }>;
    wealthOptimization: {
      primaryGainDirection: string;
      secondaryGainDirection: string;
      criticalLossDirection: string;
      immediateActions: string[];
      longTermStrategy: string[];
    };
    cashFlowAnalysis: {
      inflowQuality: string;          // Quality of income flow
      retentionQuality: string;       // Ability to save/retain
      growthPotential: string;        // Investment/growth capability
      outflowControl: string;         // Expense control
    };
  };
}

/**
 * Complete directional wealth mappings for 8 directions
 */
const DIRECTIONAL_WEALTH_MAP: DirectionalWealthInfo[] = [
  {
    direction: 'North',
    directionCode: 'N',
    wealthInfluence: 'primary-gain',
    gainPotential: 95,
    lossPotential: 5,
    financialElement: 'Wealth Accumulation and Prosperity',
    wealthCurveType: 'Primary Inflow',
    idealFinancialUsage: ['Treasury', 'Safe', 'Cash Counter', 'Banking', 'Accounts Office', 'Wealth Corner'],
    prohibitedFinancialUsage: ['Toilet', 'Garbage', 'Expense Area', 'Heavy Storage', 'Septic Tank'],
    gainIndicators: [
      'Steady income increase',
      'Business growth',
      'Wealth accumulation',
      'Financial stability',
      'Savings growth'
    ],
    lossIndicators: [
      'Income blockage',
      'Business stagnation',
      'Wealth depletion',
      'Financial instability',
      'Savings decrease'
    ],
    blockageImpact: 'CRITICAL: Blockages severely restrict income and wealth inflow',
    heavinessImpact: 'NEGATIVE: Heavy structures block wealth flow, causing financial stagnation',
    wealthFlow: 'inflow',
    remedialWealth: [
      'Keep North open and light',
      'Install water features for wealth flow',
      'Use green/white colors',
      'Place Kubera yantra or wealth symbols',
      'Maintain extreme cleanliness',
      'Regular decluttering'
    ]
  },
  {
    direction: 'Northeast',
    directionCode: 'NE',
    wealthInfluence: 'secondary-gain',
    gainPotential: 85,
    lossPotential: 15,
    financialElement: 'Divine Grace and Unexpected Gains',
    wealthCurveType: 'Divine Blessings Flow',
    idealFinancialUsage: ['Puja Room (attracts blessings)', 'Open Space', 'Water Source', 'Meditation for clarity'],
    prohibitedFinancialUsage: ['Any financial transactions', 'Safe/Treasury', 'Expense areas', 'Toilet', 'Kitchen'],
    gainIndicators: [
      'Unexpected windfalls',
      'Divine support in finances',
      'Clear financial decisions',
      'Lucky opportunities',
      'Wise investments'
    ],
    lossIndicators: [
      'Loss of opportunities',
      'Poor financial decisions',
      'Lack of divine support',
      'Bad investments',
      'Confusion in money matters'
    ],
    blockageImpact: 'CRITICAL: Blockages cut off divine grace and opportunities',
    heavinessImpact: 'SEVERE: Heavy construction causes spiritual and financial pollution',
    wealthFlow: 'inflow',
    remedialWealth: [
      'URGENT: Keep NE completely open and elevated',
      'Remove all heavy structures',
      'Install water features',
      'Daily prayers for prosperity',
      'Maintain highest purity',
      'Place crystals for clarity'
    ]
  },
  {
    direction: 'East',
    directionCode: 'E',
    wealthInfluence: 'secondary-gain',
    gainPotential: 75,
    lossPotential: 25,
    financialElement: 'Business Growth and New Opportunities',
    wealthCurveType: 'Growth and Expansion',
    idealFinancialUsage: ['Business Reception', 'Client Meeting', 'New Venture Planning', 'Marketing Area'],
    prohibitedFinancialUsage: ['Storage of old things', 'Dark areas', 'Closed spaces', 'Toilet'],
    gainIndicators: [
      'New business opportunities',
      'Client acquisition',
      'Market expansion',
      'Professional growth',
      'Recognition and rewards'
    ],
    lossIndicators: [
      'Lost opportunities',
      'Client losses',
      'Market decline',
      'Professional stagnation',
      'Reputation damage'
    ],
    blockageImpact: 'HIGH: Blockages prevent new opportunities and growth',
    heavinessImpact: 'MODERATE: Heavy structures reduce dynamism and opportunities',
    wealthFlow: 'growth',
    remedialWealth: [
      'Keep East open and bright',
      'Ensure morning sunlight',
      'Use red/orange for vitality',
      'Place business symbols',
      'Regular networking in East',
      'Fresh flowers for attraction'
    ]
  },
  {
    direction: 'Southeast',
    directionCode: 'SE',
    wealthInfluence: 'neutral',
    gainPotential: 60,
    lossPotential: 40,
    financialElement: 'Energy for Earning Capacity',
    wealthCurveType: 'Transformation and Processing',
    idealFinancialUsage: ['Active workspace', 'Production area', 'Trade activities', 'Financial processing'],
    prohibitedFinancialUsage: ['Primary treasury', 'Long-term savings', 'Passive wealth storage'],
    gainIndicators: [
      'Good earning capacity',
      'Active income generation',
      'Trade profits',
      'Production gains',
      'Energy to work'
    ],
    lossIndicators: [
      'Low earning capacity',
      'Work-related losses',
      'Trade problems',
      'Production issues',
      'Burnout affecting income'
    ],
    blockageImpact: 'MODERATE: Blockages reduce earning capacity and work energy',
    heavinessImpact: 'NEUTRAL: Acceptable if used for productive activities',
    wealthFlow: 'growth',
    remedialWealth: [
      'Use for active work and production',
      'Maintain fire element',
      'Red/orange colors for energy',
      'Regular activity and movement',
      'Avoid water storage here',
      'Keep workspace organized'
    ]
  },
  {
    direction: 'South',
    directionCode: 'S',
    wealthInfluence: 'neutral',
    gainPotential: 50,
    lossPotential: 50,
    financialElement: 'Long-term Stability and Assets',
    wealthCurveType: 'Asset Retention and Stability',
    idealFinancialUsage: ['Asset storage', 'Property documents', 'Long-term investments', 'Secure storage'],
    prohibitedFinancialUsage: ['Main entrance (wealth exits)', 'Active trading', 'Quick cash flow'],
    gainIndicators: [
      'Asset appreciation',
      'Long-term stability',
      'Property value increase',
      'Secure investments',
      'Inheritance gains'
    ],
    lossIndicators: [
      'Asset depreciation',
      'Instability',
      'Property value decline',
      'Investment losses',
      'Legal financial issues'
    ],
    blockageImpact: 'LOW: Blockages here can protect wealth',
    heavinessImpact: 'POSITIVE: Heavy structures provide stability and protection',
    wealthFlow: 'retention',
    remedialWealth: [
      'Build strong structures in South',
      'Use for asset storage',
      'Dark colors for stability',
      'Heavy furniture acceptable',
      'Avoid main entrance here',
      'Protection symbols'
    ]
  },
  {
    direction: 'Southwest',
    directionCode: 'SW',
    wealthInfluence: 'neutral',
    gainPotential: 55,
    lossPotential: 45,
    financialElement: 'Wealth Foundation and Security',
    wealthCurveType: 'Foundation and Protection',
    idealFinancialUsage: ['Safe room', 'Master bedroom (decision-making)', 'Strong foundation', 'Property vault'],
    prohibitedFinancialUsage: ['Main entrance (wealth exits)', 'Liquid cash flow', 'Open spending area', 'Toilet'],
    gainIndicators: [
      'Strong financial foundation',
      'Secure wealth base',
      'Stable income sources',
      'Protected assets',
      'Long-term prosperity'
    ],
    lossIndicators: [
      'Weak foundation',
      'Insecure wealth',
      'Unstable income',
      'Vulnerable assets',
      'Financial anxiety'
    ],
    blockageImpact: 'LOW: Can be beneficial for protection',
    heavinessImpact: 'HIGHLY POSITIVE: Heavy structures create strong financial foundation',
    wealthFlow: 'retention',
    remedialWealth: [
      'CRITICAL: Must be heaviest area',
      'Place safe/treasury in SW',
      'Heavy materials mandatory',
      'Master bedroom for decisions',
      'Dark earth tones',
      'Maximum height and weight here'
    ]
  },
  {
    direction: 'West',
    directionCode: 'W',
    wealthInfluence: 'primary-gain',
    gainPotential: 90,
    lossPotential: 10,
    financialElement: 'Profits, Gains, and Returns',
    wealthCurveType: 'Profit Realization',
    idealFinancialUsage: ['Profit collection', 'Revenue department', 'Gains area', 'Return on investment'],
    prohibitedFinancialUsage: ['Expense tracking', 'Loss accounting', 'Debt management', 'Kitchen'],
    gainIndicators: [
      'High profit margins',
      'Good returns',
      'Revenue increase',
      'Gains materialization',
      'Financial rewards'
    ],
    lossIndicators: [
      'Low profits',
      'Poor returns',
      'Revenue decline',
      'Gains disappearing',
      'Financial disappointments'
    ],
    blockageImpact: 'HIGH: Blockages prevent profit realization and gains',
    heavinessImpact: 'MODERATE: Should allow flow while providing some structure',
    wealthFlow: 'inflow',
    remedialWealth: [
      'Keep West relatively open',
      'Use for receiving payments',
      'White/blue colors',
      'Place gain symbols',
      'Customer payment counter',
      'Prosperity mantras'
    ]
  },
  {
    direction: 'Northwest',
    directionCode: 'NW',
    wealthInfluence: 'loss-prone',
    gainPotential: 40,
    lossPotential: 60,
    financialElement: 'Expenses, Support Costs, Movement',
    wealthCurveType: 'Outflow and Expenses',
    idealFinancialUsage: ['Guest relations (temporary)', 'Necessary expenses', 'Support costs', 'Variable expenses'],
    prohibitedFinancialUsage: ['Main treasury', 'Long-term savings', 'Primary income source', 'Safe'],
    gainIndicators: [
      'Controlled expenses',
      'Good support network',
      'Beneficial partnerships',
      'Necessary spending only',
      'ROI from expenses'
    ],
    lossIndicators: [
      'Excessive expenses',
      'Wasteful spending',
      'Partnership losses',
      'Unnecessary costs',
      'Money drain'
    ],
    blockageImpact: 'COMPLEX: Some blockage can control expenses, but too much blocks support',
    heavinessImpact: 'NEGATIVE: Heavy structures increase expenses and losses',
    wealthFlow: 'outflow',
    remedialWealth: [
      'Keep light but not too open',
      'Control expenses here',
      'Light colors',
      'Expense discipline practices',
      'Avoid permanent financial activities',
      'Budget and expense tracking'
    ]
  }
];

/**
 * Financial leakage types
 */
const LEAKAGE_TYPES = {
  'N': ['Income blockage', 'Wealth stagnation', 'Business decline'],
  'NE': ['Opportunity loss', 'Bad decisions', 'Divine grace loss'],
  'E': ['Growth stoppage', 'Client loss', 'Market shrinkage'],
  'SE': ['Energy depletion', 'Earning capacity loss', 'Work problems'],
  'S': ['Asset depreciation', 'Long-term losses', 'Legal issues'],
  'SW': ['Foundation weakness', 'Insecurity', 'Structural losses'],
  'W': ['Profit loss', 'Gain evaporation', 'Return failures'],
  'NW': ['Excessive expenses', 'Wasteful spending', 'Support costs']
};

/**
 * Options for Nighathu + Arth analysis
 */
export interface NighathuArthAnalysisOptions {
  northRotation?: number;
  heavyZones?: string[];
  blockedZones?: string[];
  financialActivities?: { [direction: string]: string }; // Financial activities per direction
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
 * Calculate financial score
 */
function calculateFinancialScore(
  wealthInfo: DirectionalWealthInfo,
  hasBlockage: boolean,
  hasHeavyStructure: boolean
): { financial: number; gain: number; loss: number } {
  let baseGain = wealthInfo.gainPotential;
  let baseLoss = wealthInfo.lossPotential;

  // Adjust for blockages
  if (hasBlockage) {
    if (['N', 'NE', 'E', 'W'].includes(wealthInfo.directionCode)) {
      baseGain -= 40; // Critical reduction
      baseLoss += 40;
    } else if (['SE'].includes(wealthInfo.directionCode)) {
      baseGain -= 20;
      baseLoss += 20;
    }
  }

  // Adjust for heavy structures
  if (hasHeavyStructure) {
    if (['S', 'SW'].includes(wealthInfo.directionCode)) {
      baseGain += 10; // Beneficial
      baseLoss -= 10;
    } else if (['N', 'NE', 'E', 'NW'].includes(wealthInfo.directionCode)) {
      baseGain -= 30; // Harmful
      baseLoss += 30;
    }
  }

  const gainScore = Math.max(0, Math.min(100, baseGain));
  const lossScore = Math.max(0, Math.min(100, baseLoss));
  const financialScore = Math.round((gainScore + (100 - lossScore)) / 2);

  return { financial: financialScore, gain: gainScore, loss: lossScore };
}

/**
 * Detect leakage points
 */
function detectLeakagePoints(
  wealthInfo: DirectionalWealthInfo,
  hasBlockage: boolean,
  hasHeavyStructure: boolean,
  lossScore: number
): Array<{ type: string; severity: 'critical' | 'high' | 'medium' | 'low'; description: string; financialImpact: string }> {
  const leakages: Array<{ type: string; severity: 'critical' | 'high' | 'medium' | 'low'; description: string; financialImpact: string }> = [];

  if (lossScore < 30) return leakages;

  const leakageTypesForDir = LEAKAGE_TYPES[wealthInfo.directionCode as keyof typeof LEAKAGE_TYPES] || [];
  
  if (hasBlockage && ['N', 'NE', 'W'].includes(wealthInfo.directionCode)) {
    leakages.push({
      type: leakageTypesForDir[0] || 'Financial blockage',
      severity: 'critical',
      description: `Blockage in ${wealthInfo.direction} severely restricting ${wealthInfo.financialElement.toLowerCase()}`,
      financialImpact: 'High income/gain loss, 30-50% reduction potential'
    });
  }

  if (hasHeavyStructure && ['N', 'NE', 'E', 'NW'].includes(wealthInfo.directionCode)) {
    leakages.push({
      type: leakageTypesForDir[1] || 'Heavy structure leakage',
      severity: wealthInfo.directionCode === 'NE' ? 'critical' : 'high',
      description: `Heavy construction in ${wealthInfo.direction} blocking ${wealthInfo.wealthFlow}`,
      financialImpact: 'Gradual wealth depletion, 20-40% impact'
    });
  }

  if (wealthInfo.directionCode === 'NW' && !hasBlockage && !hasHeavyStructure) {
    leakages.push({
      type: 'Excessive expense leakage',
      severity: 'medium',
      description: 'Northwest too open causing uncontrolled expenses',
      financialImpact: 'Moderate expense increase, 10-20% impact'
    });
  }

  return leakages;
}

/**
 * Assess blockage impact
 */
function assessBlockageImpact(
  wealthInfo: DirectionalWealthInfo,
  hasBlockage: boolean
): { hasImpact: boolean; severity: 'critical' | 'high' | 'medium' | 'low' | 'none'; description: string } {
  if (!hasBlockage) {
    return { hasImpact: false, severity: 'none', description: 'No blockage detected' };
  }

  if (['N', 'NE'].includes(wealthInfo.directionCode)) {
    return {
      hasImpact: true,
      severity: 'critical',
      description: `Critical blockage in ${wealthInfo.direction}. ${wealthInfo.blockageImpact}`
    };
  }

  if (['E', 'W'].includes(wealthInfo.directionCode)) {
    return {
      hasImpact: true,
      severity: 'high',
      description: `High impact blockage in ${wealthInfo.direction}. Restricting ${wealthInfo.wealthFlow}`
    };
  }

  if (['SE', 'NW'].includes(wealthInfo.directionCode)) {
    return {
      hasImpact: true,
      severity: 'medium',
      description: `Moderate blockage impact in ${wealthInfo.direction}`
    };
  }

  return {
    hasImpact: true,
    severity: 'low',
    description: `Low blockage impact in ${wealthInfo.direction}`
  };
}

/**
 * Determine wealth flow quality
 */
function determineWealthFlowQuality(financialScore: number): 'excellent' | 'good' | 'moderate' | 'poor' | 'blocked' {
  if (financialScore >= 80) return 'excellent';
  if (financialScore >= 65) return 'good';
  if (financialScore >= 45) return 'moderate';
  if (financialScore >= 25) return 'poor';
  return 'blocked';
}

/**
 * Generate sector recommendations
 */
function generateFinancialRecommendations(sector: FinancialZoneSector): string[] {
  const recs: string[] = [];
  const { wealthInfo, hasBlockage, hasHeavyStructure, wealthFlowQuality, leakagePoints } = sector;

  if (wealthFlowQuality === 'blocked' || wealthFlowQuality === 'poor') {
    recs.push(`⚠️ ${wealthInfo.direction} has ${wealthFlowQuality} wealth flow. Immediate action needed!`);
  }

  if (leakagePoints.length > 0) {
    recs.push(`🔴 ${leakagePoints.length} financial leakage point(s) detected in ${wealthInfo.direction}!`);
    for (const leak of leakagePoints.slice(0, 2)) {
      recs.push(`- ${leak.type}: ${leak.financialImpact}`);
    }
  }

  if (hasBlockage && ['N', 'NE', 'W'].includes(wealthInfo.directionCode)) {
    recs.push(`URGENT: Remove blockages from ${wealthInfo.direction} to restore ${wealthInfo.wealthFlow}.`);
  }

  if (hasHeavyStructure && ['N', 'NE', 'E'].includes(wealthInfo.directionCode)) {
    recs.push(`Remove heavy structures from ${wealthInfo.direction}. ${wealthInfo.heavinessImpact}`);
  }

  if (['S', 'SW'].includes(wealthInfo.directionCode) && !hasHeavyStructure) {
    recs.push(`Add heavy structures to ${wealthInfo.direction} for ${wealthInfo.financialElement.toLowerCase()}.`);
  }

  recs.push(`Recommended: ${wealthInfo.remedialWealth.slice(0, 2).join(' ')}`);

  return recs;
}

/**
 * Generate Nighathu + Arth analysis
 */
export function generateNighathuArth(
  boundaryPoints: Point[],
  options: NighathuArthAnalysisOptions = {}
): NighathuArthAnalysisResult {
  const {
    northRotation = 0,
    heavyZones = [],
    blockedZones = [],
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
  const sectors: FinancialZoneSector[] = [];
  let totalFinancial = 0;
  let totalLeakage = 0;
  let totalBlockage = 0;

  for (const wealthInfo of DIRECTIONAL_WEALTH_MAP) {
    const zones = directionZones[wealthInfo.directionCode] || [];
    const coverage = calculateZoneCoverage(zones, boundaryPoints, center, radius);
    
    const hasBlockage = blockedZones.includes(wealthInfo.directionCode);
    const hasHeavyStructure = heavyZones.includes(wealthInfo.directionCode);
    
    const scores = calculateFinancialScore(wealthInfo, hasBlockage, hasHeavyStructure);
    const leakagePoints = detectLeakagePoints(wealthInfo, hasBlockage, hasHeavyStructure, scores.loss);
    const blockageImpact = assessBlockageImpact(wealthInfo, hasBlockage);
    const wealthFlowQuality = determineWealthFlowQuality(scores.financial);
    const hasLeakage = leakagePoints.length > 0;

    const sector: FinancialZoneSector = {
      wealthInfo,
      zones,
      coverage,
      hasBlockage,
      hasHeavyStructure,
      hasLeakage,
      financialScore: scores.financial,
      gainScore: scores.gain,
      lossScore: scores.loss,
      wealthFlowQuality,
      leakagePoints,
      blockageImpact,
      recommendations: []
    };

    sector.recommendations = generateFinancialRecommendations(sector);
    sectors.push(sector);

    totalFinancial += scores.financial;
    totalLeakage += scores.loss;
    totalBlockage += blockageImpact.hasImpact ? 50 : 0;
  }

  const overallFinancialHealth = Math.round(totalFinancial / sectors.length);
  const wealthFlowIndex = Math.round((sectors.filter(s => s.wealthFlowQuality === 'excellent' || s.wealthFlowQuality === 'good').length / 8) * 100);
  const leakageIndex = Math.round(totalLeakage / sectors.length);
  const blockageIndex = Math.round(totalBlockage / sectors.length);

  // Wealth curve
  const wealthCurve = {
    strongGainZones: sectors.filter(s => s.gainScore >= 80).map(s => s.wealthInfo.direction),
    moderateGainZones: sectors.filter(s => s.gainScore >= 60 && s.gainScore < 80).map(s => s.wealthInfo.direction),
    lossProneZones: sectors.filter(s => s.lossScore >= 50).map(s => s.wealthInfo.direction),
    criticalLeakageZones: sectors.filter(s => s.leakagePoints.some(l => l.severity === 'critical')).map(s => s.wealthInfo.direction)
  };

  // Financial leakage points
  const financialLeakagePoints: Array<{
    direction: string;
    leakageType: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    annualImpact: string;
    remedy: string;
  }> = [];

  for (const sector of sectors) {
    for (const leak of sector.leakagePoints) {
      financialLeakagePoints.push({
        direction: sector.wealthInfo.direction,
        leakageType: leak.type,
        severity: leak.severity,
        annualImpact: leak.financialImpact,
        remedy: sector.wealthInfo.remedialWealth[0]
      });
    }
  }

  // Wealth optimization
  const primaryGainSector = sectors.reduce((best, s) => s.gainScore > best.gainScore ? s : best);
  const secondaryGainSector = sectors.filter(s => s !== primaryGainSector).reduce((best, s) => s.gainScore > best.gainScore ? s : best);
  const criticalLossSector = sectors.reduce((worst, s) => s.lossScore > worst.lossScore ? s : worst);

  const wealthOptimization = {
    primaryGainDirection: primaryGainSector.wealthInfo.direction,
    secondaryGainDirection: secondaryGainSector.wealthInfo.direction,
    criticalLossDirection: criticalLossSector.wealthInfo.direction,
    immediateActions: [
      ...wealthCurve.criticalLeakageZones.map(dir => `Fix critical leakage in ${dir}`),
      ...sectors.filter(s => s.hasBlockage && ['N', 'NE', 'W'].includes(s.wealthInfo.directionCode))
        .map(s => `Remove blockages from ${s.wealthInfo.direction}`)
    ],
    longTermStrategy: [
      `Strengthen ${primaryGainSector.wealthInfo.direction} for primary income`,
      `Optimize ${secondaryGainSector.wealthInfo.direction} for secondary gains`,
      `Remediate ${criticalLossSector.wealthInfo.direction} to stop losses`,
      'Build heavy structures in South and Southwest for stability',
      'Keep North, Northeast, and West open for wealth flow'
    ]
  };

  // Cash flow analysis
  const inflowSectors = sectors.filter(s => s.wealthInfo.wealthFlow === 'inflow');
  const retentionSectors = sectors.filter(s => s.wealthInfo.wealthFlow === 'retention');
  const growthSectors = sectors.filter(s => s.wealthInfo.wealthFlow === 'growth');
  const outflowSectors = sectors.filter(s => s.wealthInfo.wealthFlow === 'outflow');

  const cashFlowAnalysis = {
    inflowQuality: inflowSectors.reduce((sum, s) => sum + s.financialScore, 0) / inflowSectors.length >= 70 ? 'Good' : 'Needs improvement',
    retentionQuality: retentionSectors.reduce((sum, s) => sum + s.financialScore, 0) / retentionSectors.length >= 60 ? 'Stable' : 'Weak',
    growthPotential: growthSectors.reduce((sum, s) => sum + s.financialScore, 0) / growthSectors.length >= 65 ? 'High' : 'Limited',
    outflowControl: outflowSectors.reduce((sum, s) => sum + s.lossScore, 0) / outflowSectors.length <= 50 ? 'Controlled' : 'Excessive'
  };

  // Overall recommendations
  const recommendations: string[] = [];

  recommendations.push(
    `Overall Financial Health: ${overallFinancialHealth}/100 | Wealth Flow: ${wealthFlowIndex}/100 | Leakage: ${leakageIndex}/100`
  );

  if (financialLeakagePoints.length > 0) {
    const criticalCount = financialLeakagePoints.filter(l => l.severity === 'critical').length;
    recommendations.push(
      `🔴 ${financialLeakagePoints.length} financial leakage points detected${criticalCount > 0 ? ` (${criticalCount} critical)` : ''}!`
    );
  }

  if (wealthCurve.criticalLeakageZones.length > 0) {
    recommendations.push(
      `URGENT: Critical leakage in ${wealthCurve.criticalLeakageZones.join(', ')}. Immediate remediation required.`
    );
  }

  recommendations.push(
    `Primary wealth direction: ${primaryGainSector.wealthInfo.direction} (${primaryGainSector.wealthInfo.financialElement})`
  );

  recommendations.push(
    `Cash Flow: Inflow ${cashFlowAnalysis.inflowQuality} | Retention ${cashFlowAnalysis.retentionQuality} | Growth ${cashFlowAnalysis.growthPotential} | Expense Control ${cashFlowAnalysis.outflowControl}`
  );

  if (blockageIndex > 50) {
    recommendations.push(
      'High structural blockages detected. Remove obstructions from North, Northeast, and West for wealth flow.'
    );
  }

  recommendations.push(
    'Optimize financial activities: North for income, West for profits, Southwest for savings.'
  );

  return {
    type: 'nighathu-arth',
    timestamp: new Date(),
    boundaryPoints,
    recommendations,
    data: {
      sectors,
      wealthCurve,
      overallFinancialHealth,
      wealthFlowIndex,
      leakageIndex,
      blockageIndex,
      financialLeakagePoints,
      wealthOptimization,
      cashFlowAnalysis
    }
  };
}

export { DIRECTIONAL_WEALTH_MAP };
