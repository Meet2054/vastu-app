/**
 * Shubh Dwar (Auspicious Entrance) Analysis
 * 
 * Analyzes main entrance position relative to Vastu zones and determines
 * auspiciousness based on traditional Vastu texts.
 */

import { Point, AnalysisResult } from './types';
import { 
  generate32CircleZones, 
  findZoneForPoint, 
  calculateBoundingBox,
  Circle32Zones,
  CircleZone 
} from './circle-zones';

export type EntranceAuspiciousness = 'highly-auspicious' | 'auspicious' | 'neutral' | 'inauspicious' | 'highly-inauspicious';

export interface EntranceAnalysis {
  location: Point;
  angle: number; // degrees from North
  zone: CircleZone;
  pada: string; // Sub-zone identification
  auspiciousness: EntranceAuspiciousness;
  auspiciousnessScore: number; // 0-100
  benefits: string[];
  concerns: string[];
  remedies: string[];
}

export interface ShubhDwarOptions {
  entranceLocation?: Point; // Entrance location, if not provided will need to be detected
  northRotation?: number;
}

export interface ShubhDwarResult extends AnalysisResult {
  type: 'shubh-dwar';
  data: {
    entrance: EntranceAnalysis;
    alternativeEntrances: {
      direction: string;
      zone: number;
      auspiciousness: EntranceAuspiciousness;
      score: number;
    }[];
    circleZones: Circle32Zones;
  };
}

// Auspicious entrance table based on 32-zone Pada system
const ENTRANCE_AUSPICIOUSNESS_TABLE: Record<number, {
  rating: EntranceAuspiciousness;
  score: number;
  pada: string;
  benefits: string[];
  concerns: string[];
  remedies: string[];
}> = {
  // North direction (Zones 1-4)
  1: {
    rating: 'highly-auspicious',
    score: 95,
    pada: 'Dhruvam (Pole Star)',
    benefits: ['Wealth', 'Prosperity', 'Stability', 'Career growth'],
    concerns: [],
    remedies: []
  },
  2: {
    rating: 'auspicious',
    score: 80,
    pada: 'Dhruva-Ishana',
    benefits: ['Good fortune', 'Growth'],
    concerns: ['Ensure proper lighting'],
    remedies: ['Keep entrance well-lit', 'Add name plate']
  },
  3: {
    rating: 'auspicious',
    score: 85,
    pada: 'Ishana-Pada',
    benefits: ['Spiritual growth', 'Peace', 'Health'],
    concerns: [],
    remedies: []
  },
  4: {
    rating: 'highly-auspicious',
    score: 90,
    pada: 'Parjanya',
    benefits: ['Rain of blessings', 'Abundance', 'Divine grace'],
    concerns: [],
    remedies: []
  },
  
  // Northeast direction (Zones 5-8)
  5: {
    rating: 'highly-auspicious',
    score: 100,
    pada: 'Jayanta (Victory)',
    benefits: ['Ultimate prosperity', 'Success', 'Victory', 'Divine blessings'],
    concerns: [],
    remedies: []
  },
  6: {
    rating: 'highly-auspicious',
    score: 95,
    pada: 'Indra (King of Gods)',
    benefits: ['Power', 'Authority', 'Success', 'Recognition'],
    concerns: [],
    remedies: []
  },
  7: {
    rating: 'auspicious',
    score: 85,
    pada: 'Surya',
    benefits: ['Health', 'Vitality', 'Fame'],
    concerns: [],
    remedies: []
  },
  8: {
    rating: 'auspicious',
    score: 80,
    pada: 'Satya',
    benefits: ['Truth', 'Integrity', 'Wisdom'],
    concerns: ['Avoid if facing road T-junction'],
    remedies: ['Place Vastu pyramid', 'Use convex mirror if road-facing']
  },
  
  // East direction (Zones 9-12)
  9: {
    rating: 'highly-auspicious',
    score: 90,
    pada: 'Bhrishay (Support)',
    benefits: ['Growth', 'New beginnings', 'Energy', 'Health'],
    concerns: [],
    remedies: []
  },
  10: {
    rating: 'auspicious',
    score: 85,
    pada: 'Akash',
    benefits: ['Expansion', 'Opportunities'],
    concerns: [],
    remedies: []
  },
  11: {
    rating: 'neutral',
    score: 60,
    pada: 'Agni-corner',
    benefits: ['Energy'],
    concerns: ['May cause restlessness', 'Fire element dominance'],
    remedies: ['Balance with water feature', 'Use calming colors']
  },
  12: {
    rating: 'neutral',
    score: 55,
    pada: 'Pushpa',
    benefits: ['Beauty', 'Creativity'],
    concerns: ['Not ideal for main entrance'],
    remedies: ['Use as secondary entrance', 'Add plants']
  },
  
  // Southeast direction (Zones 13-16)
  13: {
    rating: 'inauspicious',
    score: 35,
    pada: 'Vitatha',
    benefits: [],
    concerns: ['Financial losses', 'Health issues', 'Fire accidents'],
    remedies: ['Avoid if possible', 'Place Ganesha idol', 'Red/orange colors']
  },
  14: {
    rating: 'inauspicious',
    score: 30,
    pada: 'Grihakshat',
    benefits: [],
    concerns: ['Destruction of home peace', 'Accidents'],
    remedies: ['Change entrance direction', 'Vastu pyramid', 'Lead metal strip']
  },
  15: {
    rating: 'highly-inauspicious',
    score: 20,
    pada: 'Yama (Death)',
    benefits: [],
    concerns: ['Severe health problems', 'Premature death', 'Chronic diseases'],
    remedies: ['Immediate relocation recommended', 'Copper/lead pyramids', 'Yantras']
  },
  16: {
    rating: 'highly-inauspicious',
    score: 15,
    pada: 'Gandharva',
    benefits: [],
    concerns: ['Mental disturbances', 'Financial crisis'],
    remedies: ['Close this entrance', 'Create new entrance in North/East']
  },
  
  // South direction (Zones 17-20)
  17: {
    rating: 'inauspicious',
    score: 25,
    pada: 'Bhringraj',
    benefits: [],
    concerns: ['Health issues', 'Slow progress', 'Obstacles'],
    remedies: ['Hanuman idol', 'Red color door', 'Higher threshold']
  },
  18: {
    rating: 'inauspicious',
    score: 30,
    pada: 'Mriga',
    benefits: [],
    concerns: ['Instability', 'Frequent changes'],
    remedies: ['Heavy entrance door', 'Yellow light']
  },
  19: {
    rating: 'neutral',
    score: 50,
    pada: 'Pitru (Ancestors)',
    benefits: ['Ancestral blessings if proper rituals done'],
    concerns: ['May attract negative energies'],
    remedies: ['Light lamp daily', 'Perform puja', 'Ancestral worship']
  },
  20: {
    rating: 'neutral',
    score: 45,
    pada: 'Dauvarika',
    benefits: ['Moderate'],
    concerns: ['Not ideal for main entrance'],
    remedies: ['Use as secondary entrance', 'Bright lighting']
  },
  
  // Southwest direction (Zones 21-24)
  21: {
    rating: 'highly-inauspicious',
    score: 10,
    pada: 'Sugriva (Demon)',
    benefits: [],
    concerns: ['Severe financial losses', 'Family conflicts', 'Business failures'],
    remedies: ['Absolutely avoid', 'Create entrance elsewhere', 'Heavy Vastu corrections']
  },
  22: {
    rating: 'highly-inauspicious',
    score: 5,
    pada: 'Pushpadanta',
    benefits: [],
    concerns: ['Maximum negativity', 'Complete destruction', 'Loss of wealth and health'],
    remedies: ['Never use this entrance', 'Seal and create new entrance']
  },
  23: {
    rating: 'highly-inauspicious',
    score: 10,
    pada: 'Varuna (Demon aspect)',
    benefits: [],
    concerns: ['Water-related diseases', 'Mental illness', 'Depression'],
    remedies: ['Close entrance', 'Heavy Vastu remedies', 'Professional consultation']
  },
  24: {
    rating: 'inauspicious',
    score: 20,
    pada: 'Asura',
    benefits: [],
    concerns: ['Evil influences', 'Bad luck', 'Poverty'],
    remedies: ['Vastu dosh nivaran yantra', 'Nazar battu', 'Salt water remedy']
  },
  
  // West direction (Zones 25-28)
  25: {
    rating: 'neutral',
    score: 50,
    pada: 'Shosha',
    benefits: ['Moderate prosperity'],
    concerns: ['May drain energy', 'Slow growth'],
    remedies: ['Wind chimes', 'Bright colors', 'Good lighting']
  },
  26: {
    rating: 'neutral',
    score: 55,
    pada: 'Papyakshama',
    benefits: ['Can destroy sins if proper vastu'],
    concerns: ['Needs enhancement'],
    remedies: ['Swastik symbol', 'Om symbol', 'Bright entrance']
  },
  27: {
    rating: 'auspicious',
    score: 70,
    pada: 'Roga',
    benefits: ['Health recovery', 'Healing'],
    concerns: ['Ensure cleanliness'],
    remedies: ['Keep very clean', 'Tulsi plant nearby']
  },
  28: {
    rating: 'auspicious',
    score: 75,
    pada: 'Naga',
    benefits: ['Protection', 'Wealth', 'Serpent blessings'],
    concerns: [],
    remedies: ['Naga pratima', 'Silver items']
  },
  
  // Northwest direction (Zones 29-32)
  29: {
    rating: 'auspicious',
    score: 75,
    pada: 'Mukhya',
    benefits: ['Support', 'Networking', 'Business growth'],
    concerns: [],
    remedies: []
  },
  30: {
    rating: 'neutral',
    score: 60,
    pada: 'Bhallat',
    benefits: ['Moderate benefits'],
    concerns: ['Ensure stability'],
    remedies: ['Heavy door', 'Proper threshold']
  },
  31: {
    rating: 'neutral',
    score: 55,
    pada: 'Soma',
    benefits: ['Mental peace possible'],
    concerns: ['May cause instability'],
    remedies: ['Grounding elements', 'Earthy colors']
  },
  32: {
    rating: 'auspicious',
    score: 80,
    pada: 'Bhujang',
    benefits: ['Prosperity', 'Movement', 'Opportunities'],
    concerns: [],
    remedies: []
  }
};

/**
 * Detect entrance location from boundary
 * (This is a simplified version - in real implementation, you'd need user input or image processing)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function detectEntranceLocation(boundaryPoints: Point[], bbox: any): Point {
  // Default to North side center if not specified
  // In real implementation, this would be detected from floor plan or user input
  return {
    x: bbox.centerX,
    y: bbox.minY
  };
}

/**
 * Calculate angle from center to point (North = 0°, clockwise)
 */
function calculateAngleFromCenter(
  centerX: number,
  centerY: number,
  pointX: number,
  pointY: number
): number {
  const dx = pointX - centerX;
  const dy = pointY - centerY;
  
  let angle = Math.atan2(dx, -dy) * (180 / Math.PI);
  angle = (angle + 360) % 360;
  
  return angle;
}

/**
 * Generate alternative entrance suggestions
 */
function generateAlternatives(circleZones: Circle32Zones): {
  direction: string;
  zone: number;
  auspiciousness: EntranceAuspiciousness;
  score: number;
}[] {
  
  // Get top 5 most auspicious zones
  const allZones = circleZones.zones.map(zone => ({
    direction: zone.direction,
    zone: zone.zoneNumber,
    ...ENTRANCE_AUSPICIOUSNESS_TABLE[zone.zoneNumber]
  }));
  
  const topZones = allZones
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  
  return topZones.map(z => ({
    direction: z.direction,
    zone: z.zone,
    auspiciousness: z.rating,
    score: z.score
  }));
}

/**
 * Generate Shubh Dwar analysis
 */
export function generateShubhDwar(
  boundaryPoints: Point[],
  options: ShubhDwarOptions = {}
): ShubhDwarResult {
  const {
    entranceLocation,
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
  
  // Get entrance location
  const entranceLoc = entranceLocation || detectEntranceLocation(boundaryPoints, bbox);
  
  // Calculate angle and find zone
  const angle = calculateAngleFromCenter(
    bbox.centerX,
    bbox.centerY,
    entranceLoc.x,
    entranceLoc.y
  );
  
  const zone = findZoneForPoint(entranceLoc.x, entranceLoc.y, circleZones);
  
  if (!zone) {
    throw new Error('Could not determine entrance zone');
  }
  
  // Get auspiciousness data
  const ausData = ENTRANCE_AUSPICIOUSNESS_TABLE[zone.zoneNumber];
  
  const entrance: EntranceAnalysis = {
    location: entranceLoc,
    angle,
    zone,
    pada: ausData.pada,
    auspiciousness: ausData.rating,
    auspiciousnessScore: ausData.score,
    benefits: ausData.benefits,
    concerns: ausData.concerns,
    remedies: ausData.remedies
  };
  
  // Generate alternative entrance suggestions
  const alternativeEntrances = generateAlternatives(circleZones);
  
  return {
    type: 'shubh-dwar',
    timestamp: new Date(),
    boundaryPoints,
    data: {
      entrance,
      alternativeEntrances,
      circleZones
    }
  };
}
