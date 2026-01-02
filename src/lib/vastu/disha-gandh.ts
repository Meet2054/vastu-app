/**
 * Disha + Gandh Analysis
 * 
 * Direction mapped to sensory vibration (smell / subtle energy).
 * Analyzes compatibility between directional scent characteristics and activities.
 * 
 * Features:
 * - 8 directions with associated Gandh (scent/smell) types
 * - Sensory vibration characteristics for each direction
 * - Activity compatibility based on scent production
 * - Subtle comfort/discomfort analysis
 * - Remedial aromatic recommendations
 */

import { Point, BoundingBox, AnalysisResult } from './types';
import { generate32CircleZones, CircleZone } from './circle-zones';

/**
 * Gandh (scent/vibration) information for each direction
 */
export interface GandhInfo {
  direction: string;
  directionCode: string;
  gandhType: string;              // Primary scent type
  gandhQuality: string;           // Quality of scent
  subtleEnergy: string;           // Subtle energy vibration
  scentCharacteristics: string[]; // Specific scent notes
  idealAromas: string[];          // Beneficial aromas for this direction
  harmfulAromas: string[];        // Detrimental aromas
  compatibleActivities: string[]; // Activities with compatible scents
  incompatibleActivities: string[]; // Activities with incompatible scents
  comfortIndicators: string[];    // Signs of good scent balance
  discomfortIndicators: string[]; // Signs of poor scent balance
}

/**
 * Directional scent sector analysis
 */
export interface GandhSector {
  gandh: GandhInfo;
  zones: CircleZone[];
  coverage: number;
  hasStructure: boolean;
  activityType?: string;
  isCompatible: boolean;
  comfortScore: number;           // 0-100, higher is better
  discomfortScore: number;        // 0-100, higher means more discomfort
  sensoryBalance: 'harmonious' | 'balanced' | 'neutral' | 'disturbed' | 'toxic';
  recommendations: string[];
}

/**
 * Disha + Gandh analysis result
 */
export interface DishaGandhAnalysisResult extends AnalysisResult {
  recommendations: string[];
  data: {
    sectors: GandhSector[];
    overallComfort: number;         // 0-100
    overallDiscomfort: number;      // 0-100
    sensoryHarmony: number;         // 0-100
    harmoniousDirections: string[]; // Directions with good scent balance
    disturbedDirections: string[];  // Directions with scent issues
    aromaticRemedies: Array<{
      direction: string;
      currentIssue: string;
      recommendedAroma: string;
      application: string;
      frequency: string;
    }>;
    subtleEnergyMap: {
      positive: string[];           // Directions with positive subtle energy
      neutral: string[];            // Directions with neutral energy
      negative: string[];           // Directions with negative energy
    };
  };
}

/**
 * Complete Disha + Gandh definitions for 8 directions
 */
const DISHA_GANDH_MAP: GandhInfo[] = [
  {
    direction: 'North',
    directionCode: 'N',
    gandhType: 'Sheetala Gandh',
    gandhQuality: 'Cool and Fresh',
    subtleEnergy: 'Wealth Vibration',
    scentCharacteristics: ['Cool', 'Fresh', 'Water-like', 'Mint-like', 'Crisp'],
    idealAromas: ['Mint', 'Eucalyptus', 'Camphor', 'Sandalwood', 'Jasmine', 'Lotus'],
    harmfulAromas: ['Burning', 'Smoke', 'Hot spices', 'Putrid', 'Stale'],
    compatibleActivities: ['Study', 'Office Work', 'Meditation', 'Financial Planning', 'Reading'],
    incompatibleActivities: ['Cooking', 'Burning', 'Garbage Storage', 'Toilet', 'Heavy Industry'],
    comfortIndicators: [
      'Mental clarity and focus',
      'Sense of prosperity and abundance',
      'Cool and refreshing atmosphere',
      'Enhanced concentration'
    ],
    discomfortIndicators: [
      'Mental fog and confusion',
      'Financial anxiety',
      'Stuffy or hot atmosphere',
      'Inability to focus'
    ]
  },
  {
    direction: 'Northeast',
    directionCode: 'NE',
    gandhType: 'Divya Gandh',
    gandhQuality: 'Sacred and Pure',
    subtleEnergy: 'Divine Vibration',
    scentCharacteristics: ['Pure', 'Sacred', 'Light', 'Ethereal', 'Uplifting'],
    idealAromas: ['Incense', 'Frankincense', 'Myrrh', 'Rose', 'Saffron', 'Tulsi', 'Lotus'],
    harmfulAromas: ['Sewage', 'Garbage', 'Chemical', 'Burnt', 'Meat', 'Alcohol'],
    compatibleActivities: ['Puja', 'Meditation', 'Prayer', 'Spiritual Practice', 'Yoga'],
    incompatibleActivities: ['Toilet', 'Kitchen', 'Garbage', 'Storage', 'Non-veg Cooking'],
    comfortIndicators: [
      'Spiritual upliftment and peace',
      'Mental clarity and wisdom',
      'Divine connection and blessings',
      'Inner calm and serenity'
    ],
    discomfortIndicators: [
      'Spiritual blockages',
      'Mental restlessness and anxiety',
      'Loss of faith and direction',
      'Emotional turbulence'
    ]
  },
  {
    direction: 'East',
    directionCode: 'E',
    gandhType: 'Prabhata Gandh',
    gandhQuality: 'Fresh and Awakening',
    subtleEnergy: 'Solar Vibration',
    scentCharacteristics: ['Fresh', 'Floral', 'Morning', 'Energizing', 'Bright'],
    idealAromas: ['Jasmine', 'Rose', 'Marigold', 'Lemon', 'Orange Blossom', 'Lavender'],
    harmfulAromas: ['Stale', 'Musty', 'Dark', 'Heavy', 'Putrid'],
    compatibleActivities: ['Exercise', 'Sunrise Meditation', 'Fresh Air Intake', 'Social Gathering'],
    incompatibleActivities: ['Dark Room', 'Closed Storage', 'Garbage', 'Toilet'],
    comfortIndicators: [
      'High energy and vitality',
      'Positive social interactions',
      'Clear vision and purpose',
      'Optimism and enthusiasm'
    ],
    discomfortIndicators: [
      'Low energy and lethargy',
      'Social isolation',
      'Lack of direction',
      'Depression and gloom'
    ]
  },
  {
    direction: 'Southeast',
    directionCode: 'SE',
    gandhType: 'Agneya Gandh',
    gandhQuality: 'Warm and Stimulating',
    subtleEnergy: 'Fire Vibration',
    scentCharacteristics: ['Warm', 'Spicy', 'Cooking', 'Energetic', 'Transformative'],
    idealAromas: ['Cinnamon', 'Clove', 'Black Pepper', 'Ginger', 'Cardamom', 'Turmeric'],
    harmfulAromas: ['Water-based', 'Cold', 'Stagnant', 'Moldy', 'Damp'],
    compatibleActivities: ['Cooking', 'Electrical Work', 'Fire Activities', 'Food Preparation'],
    incompatibleActivities: ['Water Storage', 'Swimming Pool', 'Bathroom', 'Cold Storage'],
    comfortIndicators: [
      'Good digestion and metabolism',
      'High energy levels',
      'Transformation and growth',
      'Warmth and vitality'
    ],
    discomfortIndicators: [
      'Digestive issues',
      'Low energy and cold',
      'Stagnation and decay',
      'Dampness and mold'
    ]
  },
  {
    direction: 'South',
    directionCode: 'S',
    gandhType: 'Sthira Gandh',
    gandhQuality: 'Heavy and Grounding',
    subtleEnergy: 'Dharmic Vibration',
    scentCharacteristics: ['Heavy', 'Earthy', 'Dense', 'Stable', 'Mature'],
    idealAromas: ['Sandalwood', 'Patchouli', 'Vetiver', 'Cedar', 'Myrrh', 'Musk'],
    harmfulAromas: ['Light', 'Volatile', 'Unstable', 'Childish', 'Frivolous'],
    compatibleActivities: ['Rest', 'Study', 'Heavy Work', 'Serious Activities', 'Administration'],
    incompatibleActivities: ['Main Entrance', 'Children Play', 'Light Activities', 'Parties'],
    comfortIndicators: [
      'Sense of security and stability',
      'Long life and health',
      'Discipline and maturity',
      'Deep rest and recovery'
    ],
    discomfortIndicators: [
      'Insecurity and fear',
      'Health concerns',
      'Lack of discipline',
      'Restlessness and anxiety'
    ]
  },
  {
    direction: 'Southwest',
    directionCode: 'SW',
    gandhType: 'Guru Gandh',
    gandhQuality: 'Heavy and Anchoring',
    subtleEnergy: 'Earth Vibration',
    scentCharacteristics: ['Heavy', 'Dense', 'Grounding', 'Stone-like', 'Solid'],
    idealAromas: ['Patchouli', 'Vetiver', 'Oak Moss', 'Earth', 'Stone', 'Clay'],
    harmfulAromas: ['Light', 'Airy', 'Volatile', 'Flowery', 'Sweet'],
    compatibleActivities: ['Master Bedroom', 'Heavy Storage', 'Safe Room', 'Rest'],
    incompatibleActivities: ['Main Entrance', 'Water Feature', 'Kitchen', 'Light Activities'],
    comfortIndicators: [
      'Strong relationships and bonds',
      'Stability and permanence',
      'Security and protection',
      'Grounded and centered'
    ],
    discomfortIndicators: [
      'Relationship conflicts',
      'Instability and chaos',
      'Insecurity and vulnerability',
      'Scattered and ungrounded'
    ]
  },
  {
    direction: 'West',
    directionCode: 'W',
    gandhType: 'Madhyama Gandh',
    gandhQuality: 'Moderate and Balanced',
    subtleEnergy: 'Emotional Vibration',
    scentCharacteristics: ['Moderate', 'Balanced', 'Evening', 'Calming', 'Settling'],
    idealAromas: ['Rose', 'Chamomile', 'Lavender', 'Ylang-ylang', 'Vanilla', 'Sandalwood'],
    harmfulAromas: ['Harsh', 'Burning', 'Extreme', 'Intense', 'Sharp'],
    compatibleActivities: ['Dining', 'Family Time', 'Children Room', 'Relaxation', 'Entertainment'],
    incompatibleActivities: ['Kitchen', 'Fire Activities', 'Heavy Industry', 'Intense Work'],
    comfortIndicators: [
      'Emotional balance and peace',
      'Good family relationships',
      'Gains and profits',
      'Gentle and nurturing atmosphere'
    ],
    discomfortIndicators: [
      'Emotional instability',
      'Family conflicts',
      'Financial losses',
      'Harsh and uncomfortable atmosphere'
    ]
  },
  {
    direction: 'Northwest',
    directionCode: 'NW',
    gandhType: 'Chala Gandh',
    gandhQuality: 'Light and Moving',
    subtleEnergy: 'Air Vibration',
    scentCharacteristics: ['Light', 'Airy', 'Moving', 'Changing', 'Variable'],
    idealAromas: ['Lemongrass', 'Citrus', 'Mint', 'Tea Tree', 'Eucalyptus', 'Pine'],
    harmfulAromas: ['Heavy', 'Stagnant', 'Dense', 'Thick', 'Solid'],
    compatibleActivities: ['Guest Room', 'Garage', 'Movement', 'Temporary Storage', 'Vehicles'],
    incompatibleActivities: ['Puja Room', 'Master Bedroom', 'Safe', 'Permanent Storage'],
    comfortIndicators: [
      'Good communication and networking',
      'Freedom and movement',
      'Adaptability and change',
      'Fresh and open atmosphere'
    ],
    discomfortIndicators: [
      'Communication breakdowns',
      'Feeling stuck or trapped',
      'Rigidity and resistance',
      'Stale and closed atmosphere'
    ]
  }
];

/**
 * Activity scent profiles
 */
const ACTIVITY_SCENT_PROFILE: { [activity: string]: string[] } = {
  'Kitchen': ['Cooking', 'Spices', 'Food'],
  'Bathroom': ['Water', 'Soap', 'Moisture'],
  'Toilet': ['Waste', 'Chemical', 'Sewage'],
  'Puja Room': ['Incense', 'Flowers', 'Sacred'],
  'Bedroom': ['Mild', 'Calming', 'Resting'],
  'Living Room': ['Fresh', 'Clean', 'Social'],
  'Study': ['Paper', 'Books', 'Calm'],
  'Office': ['Professional', 'Clean', 'Focused'],
  'Garage': ['Oil', 'Vehicle', 'Mechanical'],
  'Storage': ['Dust', 'Old', 'Stagnant'],
  'Garden': ['Floral', 'Fresh', 'Natural'],
  'Dining': ['Food', 'Social', 'Pleasant'],
};

/**
 * Options for Disha + Gandh analysis
 */
export interface DishaGandhAnalysisOptions {
  northRotation?: number;
  sectorActivities?: { [direction: string]: string };
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
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
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
 * Calculate zone coverage
 */
function calculateZoneCoverage(zones: CircleZone[], boundary: Point[], center: Point, radius: number): number {
  let totalSamples = 0;
  let insideSamples = 0;
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
 * Calculate comfort score
 */
function calculateComfortScore(
  gandh: GandhInfo,
  coverage: number,
  activityType?: string
): number {
  let score = 50; // Base neutral score

  if (!activityType) return score;

  // Check if activity is compatible
  const isCompatible = gandh.compatibleActivities.some(act =>
    activityType.toLowerCase().includes(act.toLowerCase())
  );
  const isIncompatible = gandh.incompatibleActivities.some(act =>
    activityType.toLowerCase().includes(act.toLowerCase())
  );

  if (isCompatible) {
    score = 80 + (coverage / 100) * 20;
  } else if (isIncompatible) {
    score = 20 - (coverage / 100) * 20;
  } else {
    score = 50 + (coverage / 100) * 10;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Calculate discomfort score
 */
function calculateDiscomfortScore(
  gandh: GandhInfo,
  coverage: number,
  activityType?: string
): number {
  if (!activityType) return 0;

  const isIncompatible = gandh.incompatibleActivities.some(act =>
    activityType.toLowerCase().includes(act.toLowerCase())
  );

  if (isIncompatible) {
    return Math.round(60 + (coverage / 100) * 40);
  }

  // Check scent profile mismatch
  const activityScents = ACTIVITY_SCENT_PROFILE[activityType] || [];
  const hasHarmfulScent = activityScents.some(scent =>
    gandh.harmfulAromas.some(harmful => 
      harmful.toLowerCase().includes(scent.toLowerCase()) ||
      scent.toLowerCase().includes(harmful.toLowerCase())
    )
  );

  if (hasHarmfulScent) {
    return Math.round(40 + (coverage / 100) * 30);
  }

  return Math.round(10 + (coverage / 100) * 10);
}

/**
 * Determine sensory balance
 */
function determineSensoryBalance(
  comfortScore: number,
  discomfortScore: number
): 'harmonious' | 'balanced' | 'neutral' | 'disturbed' | 'toxic' {
  if (comfortScore >= 80 && discomfortScore <= 20) return 'harmonious';
  if (comfortScore >= 60 && discomfortScore <= 40) return 'balanced';
  if (discomfortScore >= 70) return 'toxic';
  if (discomfortScore >= 50) return 'disturbed';
  return 'neutral';
}

/**
 * Generate sector recommendations
 */
function generateSectorRecommendations(sector: GandhSector): string[] {
  const recommendations: string[] = [];
  const { gandh, comfortScore, discomfortScore, sensoryBalance, activityType } = sector;

  if (sensoryBalance === 'toxic') {
    recommendations.push(
      `⚠️ CRITICAL: Highly incompatible scent profile in ${gandh.direction}. Immediate remediation required.`
    );
    recommendations.push(
      `Consider relocating ${activityType || 'current activity'} to a more suitable direction.`
    );
  } else if (sensoryBalance === 'disturbed') {
    recommendations.push(
      `Scent disturbance detected in ${gandh.direction}. Use aromatic remedies.`
    );
  }

  if (comfortScore < 50) {
    recommendations.push(
      `Use ${gandh.idealAromas.slice(0, 2).join(' or ')} to enhance ${gandh.gandhQuality} quality in ${gandh.direction}.`
    );
    recommendations.push(
      `Install natural air purifiers or aromatherapy diffusers with appropriate scents.`
    );
  }

  if (discomfortScore > 60) {
    recommendations.push(
      `Eliminate sources of: ${gandh.harmfulAromas.slice(0, 3).join(', ')} from ${gandh.direction}.`
    );
    recommendations.push(
      `Ensure proper ventilation and air circulation in this sector.`
    );
  }

  if (sensoryBalance === 'harmonious') {
    recommendations.push(
      `Excellent scent harmony in ${gandh.direction}! Maintain current practices.`
    );
  }

  return recommendations;
}

/**
 * Generate Disha + Gandh analysis
 */
export function generateDishaGandh(
  boundaryPoints: Point[],
  options: DishaGandhAnalysisOptions = {}
): DishaGandhAnalysisResult {
  const { northRotation = 0, sectorActivities = {} } = options;

  const bbox = calculateBoundingBox(boundaryPoints);
  const center: Point = { x: bbox.centerX, y: bbox.centerY };
  const radius = Math.min(bbox.width, bbox.height) / 2;

  const circleZones = generate32CircleZones(center.x, center.y, radius, northRotation);
  const allZones = circleZones.zones;

  // Group zones by main direction
  const directionZones: { [key: string]: CircleZone[] } = {};
  for (const zone of allZones) {
    const mainDir = getMainDirection(zone);
    if (!directionZones[mainDir]) directionZones[mainDir] = [];
    directionZones[mainDir].push(zone);
  }

  // Analyze each direction
  const sectors: GandhSector[] = [];
  let totalComfort = 0;
  let totalDiscomfort = 0;
  let totalSensoryHarmony = 0;

  for (const gandh of DISHA_GANDH_MAP) {
    const zones = directionZones[gandh.directionCode] || [];
    const coverage = calculateZoneCoverage(zones, boundaryPoints, center, radius);
    const hasStructure = coverage > 10;
    const activityType = sectorActivities[gandh.directionCode];

    const comfortScore = calculateComfortScore(gandh, coverage, activityType);
    const discomfortScore = calculateDiscomfortScore(gandh, coverage, activityType);
    const sensoryBalance = determineSensoryBalance(comfortScore, discomfortScore);

    const sector: GandhSector = {
      gandh,
      zones,
      coverage,
      hasStructure,
      activityType,
      isCompatible: comfortScore > 60 && discomfortScore < 40,
      comfortScore,
      discomfortScore,
      sensoryBalance,
      recommendations: []
    };

    sector.recommendations = generateSectorRecommendations(sector);
    sectors.push(sector);

    totalComfort += comfortScore;
    totalDiscomfort += discomfortScore;
    totalSensoryHarmony += (
      sensoryBalance === 'harmonious' ? 100 :
      sensoryBalance === 'balanced' ? 75 :
      sensoryBalance === 'neutral' ? 50 :
      sensoryBalance === 'disturbed' ? 25 : 0
    );
  }

  const overallComfort = Math.round(totalComfort / sectors.length);
  const overallDiscomfort = Math.round(totalDiscomfort / sectors.length);
  const sensoryHarmony = Math.round(totalSensoryHarmony / sectors.length);

  const harmoniousDirections = sectors
    .filter(s => s.sensoryBalance === 'harmonious')
    .map(s => s.gandh.direction);

  const disturbedDirections = sectors
    .filter(s => s.sensoryBalance === 'disturbed' || s.sensoryBalance === 'toxic')
    .map(s => s.gandh.direction);

  // Generate aromatic remedies
  const aromaticRemedies = sectors
    .filter(s => s.discomfortScore > 40)
    .map(s => ({
      direction: s.gandh.direction,
      currentIssue: `Low comfort (${s.comfortScore}/100), High discomfort (${s.discomfortScore}/100)`,
      recommendedAroma: s.gandh.idealAromas[0],
      application: `Use diffuser or incense with ${s.gandh.idealAromas.slice(0, 2).join(' and ')}`,
      frequency: s.discomfortScore > 70 ? 'Daily' : 'Twice weekly'
    }));

  // Generate subtle energy map
  const subtleEnergyMap = {
    positive: sectors.filter(s => s.comfortScore >= 70).map(s => s.gandh.direction),
    neutral: sectors.filter(s => s.comfortScore >= 40 && s.comfortScore < 70).map(s => s.gandh.direction),
    negative: sectors.filter(s => s.comfortScore < 40).map(s => s.gandh.direction)
  };

  // Generate overall recommendations
  const recommendations: string[] = [];

  recommendations.push(
    `Overall Comfort Level: ${overallComfort}/100 - ${
      overallComfort >= 75 ? 'Excellent' :
      overallComfort >= 60 ? 'Good' :
      overallComfort >= 40 ? 'Moderate' : 'Poor'
    }`
  );

  recommendations.push(
    `Sensory Harmony Score: ${sensoryHarmony}/100 - ${
      sensoryHarmony >= 70 ? 'Harmonious environment' : 'Needs aromatic balancing'
    }`
  );

  if (harmoniousDirections.length > 0) {
    recommendations.push(
      `Harmonious Directions: ${harmoniousDirections.join(', ')} - Perfect scent balance maintained.`
    );
  }

  if (disturbedDirections.length > 0) {
    recommendations.push(
      `⚠️ Disturbed Directions: ${disturbedDirections.join(', ')} - Aromatic remediation needed.`
    );
  }

  if (overallDiscomfort > 50) {
    recommendations.push(
      'High sensory discomfort detected. Focus on improving air quality and natural aromas.'
    );
  }

  recommendations.push(
    'Use natural, non-toxic aromatics aligned with directional energies.'
  );

  recommendations.push(
    'Ensure proper ventilation to maintain fresh air flow throughout all sectors.'
  );

  return {
    type: 'disha-gandh',
    timestamp: new Date(),
    boundaryPoints,
    recommendations,
    data: {
      sectors,
      overallComfort,
      overallDiscomfort,
      sensoryHarmony,
      harmoniousDirections,
      disturbedDirections,
      aromaticRemedies,
      subtleEnergyMap
    }
  };
}

export { DISHA_GANDH_MAP };
