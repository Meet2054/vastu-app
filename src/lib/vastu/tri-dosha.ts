/**
 * Tri Dosha Division (Vata-Pitta-Kapha) Analysis
 * 
 * Maps Ayurvedic Doshas to directional zones and analyzes health-related
 * energy imbalances based on structural dominance.
 */

import { Point, AnalysisResult } from './types';
import { 
  generate32CircleZones, 
  calculateBoundingBox,
  Circle32Zones,
  CircleZone 
} from './circle-zones';

export type DoshaType = 'Vata' | 'Pitta' | 'Kapha';

export interface DoshaZone {
  dosha: DoshaType;
  zones: CircleZone[];
  directions: string[];
  element: string;
  qualities: string[];
  healthAspects: string[];
  color: string;
  idealActivities: string[];
  avoidActivities: string[];
}

export interface DoshaAnalysis {
  dosha: DoshaType;
  dominanceScore: number; // 0-100
  idealDominance: number; // Ideal percentage (33.33%)
  variance: number; // Difference from ideal
  isOverActive: boolean;
  isUnderActive: boolean;
  structuralWeight: number; // How much construction in this zone
  healthIndicators: {
    aspect: string;
    status: 'balanced' | 'excess' | 'deficient';
    impact: string;
  }[];
  recommendations: string[];
}

export interface TriDoshaOptions {
  northRotation?: number;
}

export interface TriDoshaResult extends AnalysisResult {
  type: 'tri-dosha';
  data: {
    doshaZones: DoshaZone[];
    doshaAnalysis: DoshaAnalysis[];
    overallBalance: number; // 0-100
    healthImbalances: {
      dosha: DoshaType;
      issue: string;
      severity: 'high' | 'medium' | 'low';
      remedy: string;
    }[];
    recommendations: string[];
    circleZones: Circle32Zones;
  };
}

// Dosha-Direction mapping based on traditional Ayurveda and Vastu
// Based on the image: Kapha (blue/cyan) in N-NE-E, Pitta (yellow) in S-SE, Vata (pink) in W-NW-SW
const DOSHA_ZONE_DEFINITIONS: DoshaZone[] = [
  {
    dosha: 'Kapha',
    zones: [], // Will be populated with actual zones
    directions: ['N', 'NNE', 'NE', 'ENE', 'E'],
    element: 'Water + Earth',
    qualities: ['Heavy', 'Slow', 'Steady', 'Soft', 'Cool', 'Stable'],
    healthAspects: [
      'Respiratory system',
      'Body structure',
      'Lubrication',
      'Immunity',
      'Emotional stability',
      'Nurturing energy'
    ],
    color: '#87CEEB', // Sky blue
    idealActivities: ['Study', 'Meditation', 'Puja', 'Living room', 'Peaceful activities'],
    avoidActivities: ['Heavy storage', 'Clutter', 'Dampness', 'Over-construction']
  },
  {
    dosha: 'Pitta',
    zones: [],
    directions: ['ESE', 'SE', 'SSE', 'S', 'SSW'],
    element: 'Fire + Water',
    qualities: ['Hot', 'Sharp', 'Penetrating', 'Intense', 'Light', 'Transformative'],
    healthAspects: [
      'Digestion',
      'Metabolism',
      'Body temperature',
      'Vision',
      'Intelligence',
      'Decision making'
    ],
    color: '#FFD700', // Golden yellow
    idealActivities: ['Kitchen', 'Cooking', 'Work', 'Active tasks', 'Transformation'],
    avoidActivities: ['Bedroom', 'Puja room', 'Water storage', 'Cool activities']
  },
  {
    dosha: 'Vata',
    zones: [],
    directions: ['SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'],
    element: 'Air + Ether',
    qualities: ['Light', 'Dry', 'Mobile', 'Quick', 'Cold', 'Changeable'],
    healthAspects: [
      'Movement',
      'Breathing',
      'Circulation',
      'Nervous system',
      'Communication',
      'Creativity'
    ],
    color: '#DDA0DD', // Plum/purple
    idealActivities: ['Guest rooms', 'Movement', 'Communication', 'Social activities', 'Change'],
    avoidActivities: ['Master bedroom (except SW)', 'Puja room', 'Heavy storage (except SW)']
  }
];

// Health impact mapping for each dosha imbalance
const DOSHA_HEALTH_IMPACTS = {
  Kapha: {
    excess: [
      { aspect: 'Respiratory', status: 'excess' as const, impact: 'Congestion, asthma, sinus issues, excessive mucus' },
      { aspect: 'Weight', status: 'excess' as const, impact: 'Weight gain, lethargy, sluggishness, water retention' },
      { aspect: 'Mental', status: 'excess' as const, impact: 'Depression, attachment, resistance to change, dullness' },
      { aspect: 'Energy', status: 'excess' as const, impact: 'Low energy, oversleeping, heaviness, inertia' }
    ],
    deficient: [
      { aspect: 'Stability', status: 'deficient' as const, impact: 'Lack of grounding, instability, dryness' },
      { aspect: 'Immunity', status: 'deficient' as const, impact: 'Weak immunity, lack of protection' },
      { aspect: 'Lubrication', status: 'deficient' as const, impact: 'Joint dryness, lack of moisture' }
    ]
  },
  Pitta: {
    excess: [
      { aspect: 'Digestion', status: 'excess' as const, impact: 'Acidity, ulcers, inflammation, excessive hunger' },
      { aspect: 'Skin', status: 'excess' as const, impact: 'Rashes, inflammation, sensitivity, burning sensation' },
      { aspect: 'Mental', status: 'excess' as const, impact: 'Anger, irritability, frustration, aggression' },
      { aspect: 'Temperature', status: 'excess' as const, impact: 'Excessive heat, sweating, body odor' }
    ],
    deficient: [
      { aspect: 'Metabolism', status: 'deficient' as const, impact: 'Weak digestion, poor metabolism' },
      { aspect: 'Vision', status: 'deficient' as const, impact: 'Poor eyesight, lack of clarity' },
      { aspect: 'Transformation', status: 'deficient' as const, impact: 'Inability to process, poor assimilation' }
    ]
  },
  Vata: {
    excess: [
      { aspect: 'Nervous System', status: 'excess' as const, impact: 'Anxiety, worry, restlessness, insomnia' },
      { aspect: 'Movement', status: 'excess' as const, impact: 'Tremors, twitching, irregular movements' },
      { aspect: 'Dryness', status: 'excess' as const, impact: 'Dry skin, constipation, dehydration, cracking' },
      { aspect: 'Mental', status: 'excess' as const, impact: 'Fear, overwhelm, scattered thoughts, indecision' }
    ],
    deficient: [
      { aspect: 'Circulation', status: 'deficient' as const, impact: 'Poor circulation, stagnation' },
      { aspect: 'Communication', status: 'deficient' as const, impact: 'Difficulty expressing, speech issues' },
      { aspect: 'Creativity', status: 'deficient' as const, impact: 'Lack of inspiration, rigidity' }
    ]
  }
};

/**
 * Map zones to doshas based on their direction
 */
function assignZonesToDoshas(circleZones: Circle32Zones): DoshaZone[] {
  const doshaZones = DOSHA_ZONE_DEFINITIONS.map(def => ({ ...def, zones: [] as CircleZone[] }));
  
  for (const zone of circleZones.zones) {
    for (const doshaZone of doshaZones) {
      if (doshaZone.directions.includes(zone.direction) || 
          doshaZone.directions.includes(zone.directionCode)) {
        doshaZone.zones.push(zone);
      }
    }
  }
  
  return doshaZones;
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
 * Calculate structural weight (construction density) for a dosha zone
 */
function calculateStructuralWeight(
  doshaZone: DoshaZone,
  centerX: number,
  centerY: number,
  radius: number,
  boundaryPoints: Point[]
): number {
  const samples = 50;
  let totalSamples = 0;
  let insideSamples = 0;
  
  for (const zone of doshaZone.zones) {
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
 * Analyze a specific dosha
 */
function analyzeDoshaBalance(
  doshaZone: DoshaZone,
  structuralWeight: number,
  totalZones: number
): DoshaAnalysis {
  const idealDominance = 33.33; // Each dosha should ideally be 1/3
  const dominanceScore = (doshaZone.zones.length / totalZones) * 100;
  const variance = dominanceScore - idealDominance;
  
  const isOverActive = variance > 10; // More than 10% above ideal
  const isUnderActive = variance < -10; // More than 10% below ideal
  
  const healthIndicators = isOverActive 
    ? DOSHA_HEALTH_IMPACTS[doshaZone.dosha].excess
    : isUnderActive
    ? DOSHA_HEALTH_IMPACTS[doshaZone.dosha].deficient
    : [
        { 
          aspect: 'Overall', 
          status: 'balanced' as const, 
          impact: `${doshaZone.dosha} is well-balanced. Good health in related areas.` 
        }
      ];
  
  const recommendations: string[] = [];
  
  if (isOverActive) {
    recommendations.push(`⚠️ ${doshaZone.dosha} is over-active (${dominanceScore.toFixed(1)}% vs ideal ${idealDominance.toFixed(1)}%)`);
    recommendations.push(`Reduce construction density in ${doshaZone.directions.join(', ')} directions`);
    recommendations.push(`Balance with ${doshaZone.dosha === 'Kapha' ? 'Pitta' : doshaZone.dosha === 'Pitta' ? 'Vata' : 'Kapha'} activities`);
    
    if (doshaZone.dosha === 'Kapha' && structuralWeight > 70) {
      recommendations.push(`Too much structure in Kapha zone. Create more open space in North-Northeast-East`);
    } else if (doshaZone.dosha === 'Pitta' && structuralWeight > 60) {
      recommendations.push(`Excessive fire energy. Add cooling elements, water features in Pitta zone`);
    } else if (doshaZone.dosha === 'Vata' && structuralWeight < 40) {
      recommendations.push(`Vata over-active due to too much openness. Add grounding elements in West-Northwest`);
    }
  } else if (isUnderActive) {
    recommendations.push(`⚠️ ${doshaZone.dosha} is under-active (${dominanceScore.toFixed(1)}% vs ideal ${idealDominance.toFixed(1)}%)`);
    recommendations.push(`Enhance ${doshaZone.directions.join(', ')} directions`);
    recommendations.push(`Incorporate ${doshaZone.idealActivities.slice(0, 2).join(', ')}`);
  } else {
    recommendations.push(`✅ ${doshaZone.dosha} is well-balanced (${dominanceScore.toFixed(1)}%)`);
  }
  
  return {
    dosha: doshaZone.dosha,
    dominanceScore,
    idealDominance,
    variance,
    isOverActive,
    isUnderActive,
    structuralWeight,
    healthIndicators,
    recommendations
  };
}

/**
 * Generate Tri Dosha Division analysis
 */
export function generateTriDosha(
  boundaryPoints: Point[],
  options: TriDoshaOptions = {}
): TriDoshaResult {
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
  
  // Assign zones to doshas
  const doshaZones = assignZonesToDoshas(circleZones);
  
  // Analyze each dosha
  const doshaAnalysis: DoshaAnalysis[] = [];
  const healthImbalances: TriDoshaResult['data']['healthImbalances'] = [];
  
  for (const doshaZone of doshaZones) {
    const structuralWeight = calculateStructuralWeight(
      doshaZone,
      bbox.centerX,
      bbox.centerY,
      radius,
      boundaryPoints
    );
    
    const analysis = analyzeDoshaBalance(
      doshaZone,
      structuralWeight,
      circleZones.zones.length
    );
    
    doshaAnalysis.push(analysis);
    
    // Add health imbalances
    if (analysis.isOverActive || analysis.isUnderActive) {
      for (const indicator of analysis.healthIndicators) {
        if (indicator.status !== 'balanced') {
          const severity: 'high' | 'medium' | 'low' = 
            Math.abs(analysis.variance) > 20 ? 'high' :
            Math.abs(analysis.variance) > 15 ? 'medium' : 'low';
          
          healthImbalances.push({
            dosha: doshaZone.dosha,
            issue: `${indicator.aspect}: ${indicator.impact}`,
            severity,
            remedy: analysis.recommendations[1] || 'Balance dosha through Vastu corrections'
          });
        }
      }
    }
  }
  
  // Calculate overall balance
  const avgVariance = doshaAnalysis.reduce((sum, a) => sum + Math.abs(a.variance), 0) / doshaAnalysis.length;
  const overallBalance = Math.max(0, 100 - avgVariance * 3);
  
  // Generate overall recommendations
  const recommendations: string[] = [];
  
  if (overallBalance < 60) {
    recommendations.push(`⚠️ Significant dosha imbalance detected (${overallBalance.toFixed(0)}/100). Health issues may arise.`);
  } else if (overallBalance >= 85) {
    recommendations.push(`✅ Excellent dosha balance (${overallBalance.toFixed(0)}/100). Good health energy distribution.`);
  }
  
  const overActiveDoshas = doshaAnalysis.filter(a => a.isOverActive);
  const underActiveDoshas = doshaAnalysis.filter(a => a.isUnderActive);
  
  if (overActiveDoshas.length > 0) {
    recommendations.push(`Over-active doshas: ${overActiveDoshas.map(a => a.dosha).join(', ')}`);
  }
  
  if (underActiveDoshas.length > 0) {
    recommendations.push(`Under-active doshas: ${underActiveDoshas.map(a => a.dosha).join(', ')}`);
  }
  
  // Specific health recommendations
  if (healthImbalances.filter(h => h.severity === 'high').length > 0) {
    recommendations.push(`⚠️ HIGH priority health issues detected. Immediate Vastu corrections recommended.`);
  }
  
  // Seasonal considerations
  recommendations.push(`Note: Dosha balance varies with seasons. Current assessment is for general structural balance.`);
  
  return {
    type: 'tri-dosha',
    timestamp: new Date(),
    boundaryPoints,
    data: {
      doshaZones,
      doshaAnalysis,
      overallBalance,
      healthImbalances,
      recommendations,
      circleZones
    }
  };
}
