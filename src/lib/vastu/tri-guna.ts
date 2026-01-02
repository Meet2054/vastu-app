/**
 * Tri Guna Division (Sattva-Rajas-Tamas) Analysis
 * 
 * Maps the three Gunas (mental and behavioral qualities) to directional zones
 * and analyzes their influence on mental peace, activity, and inertia.
 */

import { Point, AnalysisResult } from './types';
import { 
  generate32CircleZones, 
  calculateBoundingBox,
  Circle32Zones,
  CircleZone 
} from './circle-zones';

export type GunaType = 'Sattva' | 'Rajas' | 'Tamas';

export interface GunaZone {
  guna: GunaType;
  zones: CircleZone[];
  directions: string[];
  qualities: string[];
  mentalAspects: string[];
  behavioralTraits: string[];
  color: string;
  idealActivities: string[];
  avoidActivities: string[];
  timeOfDay: string;
}

export interface GunaAnalysis {
  guna: GunaType;
  dominanceScore: number; // 0-100
  idealDominance: number; // Ideal percentage
  variance: number; // Difference from ideal
  isOverActive: boolean;
  isUnderActive: boolean;
  structuralWeight: number; // How much construction in this zone
  mentalIndicators: {
    aspect: string;
    status: 'balanced' | 'excess' | 'deficient';
    impact: string;
  }[];
  recommendations: string[];
}

export interface TriGunaOptions {
  northRotation?: number;
}

export interface TriGunaResult extends AnalysisResult {
  type: 'tri-guna';
  data: {
    gunaZones: GunaZone[];
    gunaAnalysis: GunaAnalysis[];
    overallBalance: number; // 0-100
    mentalPeaceScore: number; // 0-100 (Sattva dominance)
    activityScore: number; // 0-100 (Rajas balance)
    inertiaScore: number; // 0-100 (Tamas control)
    mentalImbalances: {
      guna: GunaType;
      issue: string;
      severity: 'high' | 'medium' | 'low';
      remedy: string;
    }[];
    recommendations: string[];
    circleZones: Circle32Zones;
  };
}

// Guna-Direction mapping based on the image
// Sattva (purple/lavender): NE-E (spiritual, pure)
// Rajas (yellow): N-NW (active, dynamic)
// Tamas (pink/red): S-SW-W (inert, heavy)
const GUNA_ZONE_DEFINITIONS: GunaZone[] = [
  {
    guna: 'Sattva',
    zones: [],
    directions: ['NNE', 'NE', 'ENE', 'E', 'ESE'],
    qualities: ['Purity', 'Harmony', 'Knowledge', 'Light', 'Peace', 'Clarity'],
    mentalAspects: [
      'Mental peace',
      'Spiritual growth',
      'Wisdom',
      'Clarity of thought',
      'Contentment',
      'Meditation'
    ],
    behavioralTraits: [
      'Calmness',
      'Kindness',
      'Compassion',
      'Self-control',
      'Truthfulness',
      'Discipline'
    ],
    color: '#E6E6FA', // Lavender
    idealActivities: ['Puja', 'Meditation', 'Study', 'Reading', 'Yoga', 'Prayer', 'Peaceful activities'],
    avoidActivities: ['Heavy storage', 'Garage', 'Toilet', 'Clutter', 'Noisy activities'],
    timeOfDay: 'Early morning (4-10 AM)'
  },
  {
    guna: 'Rajas',
    zones: [],
    directions: ['N', 'NNW', 'NW', 'WNW'],
    qualities: ['Activity', 'Passion', 'Motion', 'Energy', 'Desire', 'Ambition'],
    mentalAspects: [
      'Ambition',
      'Drive',
      'Goal-oriented',
      'Decision making',
      'Action',
      'Achievement'
    ],
    behavioralTraits: [
      'Dynamic',
      'Energetic',
      'Passionate',
      'Competitive',
      'Restless',
      'Ambitious'
    ],
    color: '#FFEB99', // Light yellow
    idealActivities: ['Office', 'Business', 'Kitchen', 'Dining', 'Exercise', 'Active work', 'Social gatherings'],
    avoidActivities: ['Puja room', 'Master bedroom', 'Meditation room', 'Quiet spaces'],
    timeOfDay: 'Daytime (10 AM - 6 PM)'
  },
  {
    guna: 'Tamas',
    zones: [],
    directions: ['SE', 'S', 'SSW', 'SW', 'WSW', 'W'],
    qualities: ['Inertia', 'Heaviness', 'Darkness', 'Stability', 'Rest', 'Resistance'],
    mentalAspects: [
      'Rest',
      'Sleep',
      'Stability',
      'Grounding',
      'Material focus',
      'Inertia'
    ],
    behavioralTraits: [
      'Stability',
      'Lethargy',
      'Resistance',
      'Attachment',
      'Dullness',
      'Heaviness'
    ],
    color: '#FFB6C1', // Light pink/red
    idealActivities: ['Master bedroom', 'Storage', 'Heavy furniture', 'Resting areas', 'Basement'],
    avoidActivities: ['Puja room', 'Study', 'Office', 'Open spaces', 'Activity areas'],
    timeOfDay: 'Evening/Night (6 PM - 4 AM)'
  }
];

// Mental/behavioral impacts for each guna imbalance
const GUNA_MENTAL_IMPACTS = {
  Sattva: {
    excess: [
      { aspect: 'Detachment', status: 'excess' as const, impact: 'Over-spiritualization, detachment from practical life, escapism' },
      { aspect: 'Passivity', status: 'excess' as const, impact: 'Lack of action, excessive contemplation, withdrawal' }
    ],
    deficient: [
      { aspect: 'Mental Peace', status: 'deficient' as const, impact: 'Anxiety, stress, lack of clarity, confusion, agitation' },
      { aspect: 'Spiritual Growth', status: 'deficient' as const, impact: 'Materialism, lack of purpose, spiritual emptiness' },
      { aspect: 'Wisdom', status: 'deficient' as const, impact: 'Poor judgment, impulsiveness, lack of discrimination' },
      { aspect: 'Purity', status: 'deficient' as const, impact: 'Mental pollution, negative thoughts, lack of clarity' }
    ]
  },
  Rajas: {
    excess: [
      { aspect: 'Restlessness', status: 'excess' as const, impact: 'Hyperactivity, inability to relax, stress, burnout' },
      { aspect: 'Desire', status: 'excess' as const, impact: 'Excessive ambition, greed, never satisfied, constant striving' },
      { aspect: 'Agitation', status: 'excess' as const, impact: 'Irritability, anger, impatience, frustration' },
      { aspect: 'Activity', status: 'excess' as const, impact: 'Overwork, exhaustion, lack of rest, scattered energy' }
    ],
    deficient: [
      { aspect: 'Motivation', status: 'deficient' as const, impact: 'Lack of drive, apathy, procrastination, passivity' },
      { aspect: 'Action', status: 'deficient' as const, impact: 'Inaction, stagnation, lack of progress' }
    ]
  },
  Tamas: {
    excess: [
      { aspect: 'Lethargy', status: 'excess' as const, impact: 'Excessive sleep, laziness, lack of energy, sluggishness' },
      { aspect: 'Dullness', status: 'excess' as const, impact: 'Mental fog, confusion, lack of clarity, ignorance' },
      { aspect: 'Depression', status: 'excess' as const, impact: 'Sadness, hopelessness, darkness, negativity' },
      { aspect: 'Inertia', status: 'excess' as const, impact: 'Resistance to change, stubbornness, rigidity, stagnation' }
    ],
    deficient: [
      { aspect: 'Stability', status: 'deficient' as const, impact: 'Lack of grounding, instability, flightiness' },
      { aspect: 'Rest', status: 'deficient' as const, impact: 'Insomnia, inability to relax, constant activity' }
    ]
  }
};

// Ideal guna distribution varies by time and purpose
// Generally: Sattva should be highest for peace, but all three needed for balance
const IDEAL_GUNA_DISTRIBUTION = {
  Sattva: 40, // Highest for mental peace
  Rajas: 35,  // Moderate for healthy activity
  Tamas: 25   // Lowest but necessary for rest
};

/**
 * Map zones to gunas based on their direction
 */
function assignZonesToGunas(circleZones: Circle32Zones): GunaZone[] {
  const gunaZones = GUNA_ZONE_DEFINITIONS.map(def => ({ ...def, zones: [] as CircleZone[] }));
  
  for (const zone of circleZones.zones) {
    for (const gunaZone of gunaZones) {
      if (gunaZone.directions.includes(zone.direction) || 
          gunaZone.directions.includes(zone.directionCode)) {
        gunaZone.zones.push(zone);
      }
    }
  }
  
  return gunaZones;
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
 * Calculate structural weight (construction density) for a guna zone
 */
function calculateStructuralWeight(
  gunaZone: GunaZone,
  centerX: number,
  centerY: number,
  radius: number,
  boundaryPoints: Point[]
): number {
  const samples = 50;
  let totalSamples = 0;
  let insideSamples = 0;
  
  for (const zone of gunaZone.zones) {
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
 * Analyze a specific guna
 */
function analyzeGunaBalance(
  gunaZone: GunaZone,
  structuralWeight: number,
  totalZones: number
): GunaAnalysis {
  const idealDominance = IDEAL_GUNA_DISTRIBUTION[gunaZone.guna];
  const dominanceScore = (gunaZone.zones.length / totalZones) * 100;
  const variance = dominanceScore - idealDominance;
  
  const isOverActive = variance > 10;
  const isUnderActive = variance < -10;
  
  const mentalIndicators = isOverActive 
    ? GUNA_MENTAL_IMPACTS[gunaZone.guna].excess
    : isUnderActive
    ? GUNA_MENTAL_IMPACTS[gunaZone.guna].deficient
    : [
        { 
          aspect: 'Overall', 
          status: 'balanced' as const, 
          impact: `${gunaZone.guna} is well-balanced. Positive mental state in related areas.` 
        }
      ];
  
  const recommendations: string[] = [];
  
  if (isOverActive) {
    recommendations.push(`⚠️ ${gunaZone.guna} is over-active (${dominanceScore.toFixed(1)}% vs ideal ${idealDominance}%)`);
    
    if (gunaZone.guna === 'Sattva') {
      recommendations.push(`Excellent for spiritual growth but ensure balance with practical activities`);
      recommendations.push(`Add Rajasic spaces for work and activity to maintain life balance`);
    } else if (gunaZone.guna === 'Rajas') {
      recommendations.push(`Too much activity energy. Create Sattvic spaces for peace and meditation`);
      recommendations.push(`Reduce active zones in ${gunaZone.directions.join(', ')} directions`);
      recommendations.push(`Add calming elements: plants, water features, white/blue colors`);
    } else if (gunaZone.guna === 'Tamas') {
      recommendations.push(`Excessive inertia. Reduce heavy construction in ${gunaZone.directions.join(', ')}`);
      recommendations.push(`Increase light, reduce clutter, add windows and ventilation`);
      recommendations.push(`Use bright colors, avoid dark and heavy elements`);
    }
  } else if (isUnderActive) {
    recommendations.push(`⚠️ ${gunaZone.guna} is under-active (${dominanceScore.toFixed(1)}% vs ideal ${idealDominance}%)`);
    
    if (gunaZone.guna === 'Sattva') {
      recommendations.push(`Critical: Lack of Sattva leads to mental unrest and spiritual emptiness`);
      recommendations.push(`Create puja room, meditation space in Northeast or East`);
      recommendations.push(`Enhance ${gunaZone.directions.join(', ')} with sacred spaces`);
      recommendations.push(`Use white, light blue, lavender colors. Add spiritual symbols`);
    } else if (gunaZone.guna === 'Rajas') {
      recommendations.push(`Lack of Rajas leads to stagnation and lack of progress`);
      recommendations.push(`Create work spaces, office areas in ${gunaZone.directions.join(', ')}`);
      recommendations.push(`Add energizing elements, bright lights, active colors (red, orange)`);
    } else if (gunaZone.guna === 'Tamas') {
      recommendations.push(`Lack of Tamas may cause instability and inability to rest`);
      recommendations.push(`Ensure Southwest has master bedroom with heavy furniture`);
      recommendations.push(`Create restful, grounded spaces for proper sleep and stability`);
    }
  } else {
    recommendations.push(`✅ ${gunaZone.guna} is well-balanced (${dominanceScore.toFixed(1)}%)`);
  }
  
  return {
    guna: gunaZone.guna,
    dominanceScore,
    idealDominance,
    variance,
    isOverActive,
    isUnderActive,
    structuralWeight,
    mentalIndicators,
    recommendations
  };
}

/**
 * Generate Tri Guna Division analysis
 */
export function generateTriGuna(
  boundaryPoints: Point[],
  options: TriGunaOptions = {}
): TriGunaResult {
  const {
    northRotation = 0
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
  
  // Assign zones to gunas
  const gunaZones = assignZonesToGunas(circleZones);
  
  // Analyze each guna
  const gunaAnalysis: GunaAnalysis[] = [];
  const mentalImbalances: TriGunaResult['data']['mentalImbalances'] = [];
  
  for (const gunaZone of gunaZones) {
    const structuralWeight = calculateStructuralWeight(
      gunaZone,
      bbox.centerX,
      bbox.centerY,
      radius,
      boundaryPoints
    );
    
    const analysis = analyzeGunaBalance(
      gunaZone,
      structuralWeight,
      circleZones.zones.length
    );
    
    gunaAnalysis.push(analysis);
    
    // Add mental imbalances
    if (analysis.isOverActive || analysis.isUnderActive) {
      for (const indicator of analysis.mentalIndicators) {
        if (indicator.status !== 'balanced') {
          const severity: 'high' | 'medium' | 'low' = 
            Math.abs(analysis.variance) > 20 ? 'high' :
            Math.abs(analysis.variance) > 15 ? 'medium' : 'low';
          
          mentalImbalances.push({
            guna: gunaZone.guna,
            issue: `${indicator.aspect}: ${indicator.impact}`,
            severity,
            remedy: analysis.recommendations[1] || 'Balance guna through Vastu corrections'
          });
        }
      }
    }
  }
  
  // Calculate scores
  const sattvaDominance = gunaAnalysis.find(a => a.guna === 'Sattva')?.dominanceScore || 0;
  const rajasDominance = gunaAnalysis.find(a => a.guna === 'Rajas')?.dominanceScore || 0;
  const tamasDominance = gunaAnalysis.find(a => a.guna === 'Tamas')?.dominanceScore || 0;
  
  const mentalPeaceScore = Math.min(100, sattvaDominance * 2); // Higher Sattva = more peace
  const activityScore = 100 - Math.abs(rajasDominance - 35) * 2; // Balanced Rajas = good activity
  const inertiaScore = 100 - Math.max(0, tamasDominance - 25) * 3; // Lower excess Tamas = better
  
  // Calculate overall balance
  const avgVariance = gunaAnalysis.reduce((sum, a) => sum + Math.abs(a.variance), 0) / gunaAnalysis.length;
  const overallBalance = Math.max(0, 100 - avgVariance * 3);
  
  // Generate overall recommendations
  const recommendations: string[] = [];
  
  if (overallBalance < 60) {
    recommendations.push(`⚠️ Significant guna imbalance detected (${overallBalance.toFixed(0)}/100). Mental disturbances likely.`);
  } else if (overallBalance >= 85) {
    recommendations.push(`✅ Excellent guna balance (${overallBalance.toFixed(0)}/100). Harmonious mental state.`);
  }
  
  // Mental peace assessment
  if (mentalPeaceScore < 50) {
    recommendations.push(`⚠️ Low mental peace score (${mentalPeaceScore.toFixed(0)}/100). Increase Sattva through spiritual spaces.`);
  }
  
  // Activity assessment
  if (activityScore < 60) {
    recommendations.push(`Activity levels imbalanced. ${rajasDominance > 45 ? 'Reduce' : 'Increase'} Rajasic energy.`);
  }
  
  // Inertia assessment
  if (inertiaScore < 60) {
    recommendations.push(`⚠️ Excessive Tamas (inertia). May cause lethargy and depression. Increase light and reduce heaviness.`);
  }
  
  // Specific recommendations
  const sattvicDeficient = gunaAnalysis.find(a => a.guna === 'Sattva' && a.isUnderActive);
  if (sattvicDeficient) {
    recommendations.push(`🔴 CRITICAL: Sattva deficiency severely impacts mental health. Priority: Create sacred spaces in NE/E.`);
  }
  
  const tamasicExcess = gunaAnalysis.find(a => a.guna === 'Tamas' && a.isOverActive);
  if (tamasicExcess) {
    recommendations.push(`⚠️ Tamas excess causes mental dullness and depression. Reduce heavy construction in S/SW/W zones.`);
  }
  
  return {
    type: 'tri-guna',
    timestamp: new Date(),
    boundaryPoints,
    data: {
      gunaZones,
      gunaAnalysis,
      overallBalance,
      mentalPeaceScore,
      activityScore,
      inertiaScore,
      mentalImbalances,
      recommendations,
      circleZones
    }
  };
}
