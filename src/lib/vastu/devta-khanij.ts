/**
 * Devta + Khanij Analysis
 * 
 * Each direction is ruled by a Devta (deity) with specific mineral (Khanij) influences.
 * Analyzes compatibility between directional deity rulership, mineral symbolism, and building usage.
 * 
 * Features:
 * - 8 cardinal directions with ruling Devtas
 * - Mineral/metal associations for each Devta
 * - Usage compatibility checking
 * - Prosperity and obstruction indicators
 * - Remedial mineral recommendations
 */

import { Point, BoundingBox, AnalysisResult } from './types';
import { generate32CircleZones, CircleZone } from './circle-zones';

/**
 * Devta (deity) information for each direction
 */
export interface DevtaInfo {
  direction: string;
  directionCode: string;
  devtaName: string;
  devtaTitle: string;
  khanij: string[];              // Associated minerals/metals
  element: string;
  color: string;
  qualities: string[];
  idealUsage: string[];
  prohibitedUsage: string[];
  prosperityIndicators: string[];
  obstructionIndicators: string[];
}

/**
 * Directional sector analysis
 */
export interface DevtaKhanijSector {
  devta: DevtaInfo;
  zones: CircleZone[];
  coverage: number;               // Percentage of sector covered
  hasStructure: boolean;
  usageType?: string;
  isCompatible: boolean;
  prosperityScore: number;        // 0-100
  obstructionScore: number;       // 0-100
  mineralBalance: 'optimal' | 'good' | 'deficient' | 'excessive';
  recommendations: string[];
}

/**
 * Devta + Khanij analysis result
 */
export interface DevtaKhanijAnalysisResult extends AnalysisResult {
  recommendations: string[];
  data: {
    sectors: DevtaKhanijSector[];
    overallProsperity: number;     // 0-100
    overallObstruction: number;    // 0-100
    mineralHarmony: number;        // 0-100
    blessedDirections: string[];   // Directions with high prosperity
    obstructedDirections: string[]; // Directions with high obstruction
    mineralRemedies: Array<{
      direction: string;
      mineral: string;
      placement: string;
      purpose: string;
    }>;
    devtaAppeasement: Array<{
      devta: string;
      direction: string;
      reason: string;
      remedy: string;
    }>;
  };
}

/**
 * Complete Devta + Khanij definitions for 8 directions
 */
const DEVTA_KHANIJ_MAP: DevtaInfo[] = [
  {
    direction: 'North',
    directionCode: 'N',
    devtaName: 'Kubera',
    devtaTitle: 'Lord of Wealth and Prosperity',
    khanij: ['Mercury', 'Silver', 'White Gold', 'Pearl'],
    element: 'Water',
    color: 'Green/White',
    qualities: ['Wealth', 'Abundance', 'Material Prosperity', 'Financial Growth'],
    idealUsage: ['Treasury', 'Safe', 'Cash Counter', 'Banking Area', 'Accounts Office', 'Locker Room'],
    prohibitedUsage: ['Toilet', 'Septic Tank', 'Garbage Area', 'Heavy Storage', 'Boiler Room'],
    prosperityIndicators: [
      'Financial gains and wealth accumulation',
      'Business growth and opportunities',
      'Stable income and savings',
      'Material comfort and luxury'
    ],
    obstructionIndicators: [
      'Financial losses and instability',
      'Blocked income sources',
      'Poverty and scarcity mindset',
      'Inability to save money'
    ]
  },
  {
    direction: 'Northeast',
    directionCode: 'NE',
    devtaName: 'Ishana',
    devtaTitle: 'Supreme Lord Shiva',
    khanij: ['Crystal', 'Quartz', 'Diamond', 'Clear Gemstones'],
    element: 'Water + Air',
    color: 'White/Light Blue',
    qualities: ['Spirituality', 'Wisdom', 'Divine Blessings', 'Mental Clarity'],
    idealUsage: ['Puja Room', 'Meditation Space', 'Study Room', 'Library', 'Contemplation Area'],
    prohibitedUsage: ['Toilet', 'Kitchen', 'Septic Tank', 'Heavy Storage', 'Shoe Rack', 'Garbage'],
    prosperityIndicators: [
      'Spiritual growth and enlightenment',
      'Mental peace and clarity',
      'Divine protection and blessings',
      'Wisdom and knowledge acquisition'
    ],
    obstructionIndicators: [
      'Spiritual blockages and confusion',
      'Mental stress and anxiety',
      'Loss of divine grace',
      'Intellectual stagnation'
    ]
  },
  {
    direction: 'East',
    directionCode: 'E',
    devtaName: 'Indra',
    devtaTitle: 'King of Gods and Heavens',
    khanij: ['Copper', 'Bronze', 'Brass', 'Red Gemstones'],
    element: 'Air',
    color: 'Red/Orange',
    qualities: ['Power', 'Authority', 'Social Status', 'Victory'],
    idealUsage: ['Living Room', 'Hall', 'Drawing Room', 'Reception', 'Main Entrance', 'Balcony'],
    prohibitedUsage: ['Toilet', 'Store Room', 'Dark Spaces', 'Heavy Machinery'],
    prosperityIndicators: [
      'Social recognition and fame',
      'Leadership opportunities',
      'Victory in endeavors',
      'Strong relationships'
    ],
    obstructionIndicators: [
      'Loss of reputation and status',
      'Social conflicts and isolation',
      'Defeat in competitions',
      'Strained relationships'
    ]
  },
  {
    direction: 'Southeast',
    directionCode: 'SE',
    devtaName: 'Agni',
    devtaTitle: 'Lord of Fire and Energy',
    khanij: ['Iron', 'Red Oxide', 'Magnetite', 'Hematite', 'Ruby'],
    element: 'Fire',
    color: 'Red/Orange',
    qualities: ['Energy', 'Transformation', 'Digestion', 'Vitality'],
    idealUsage: ['Kitchen', 'Electrical Room', 'Generator Room', 'Boiler', 'Fire Place'],
    prohibitedUsage: ['Water Tank', 'Well', 'Bathroom', 'Cold Storage'],
    prosperityIndicators: [
      'High energy and vitality',
      'Good digestive health',
      'Transformation and growth',
      'Financial prosperity through trade'
    ],
    obstructionIndicators: [
      'Health issues and low energy',
      'Digestive problems',
      'Fire accidents and conflicts',
      'Financial instability'
    ]
  },
  {
    direction: 'South',
    directionCode: 'S',
    devtaName: 'Yama',
    devtaTitle: 'Lord of Death and Dharma',
    khanij: ['Lead', 'Black Stone', 'Onyx', 'Black Tourmaline'],
    element: 'Fire + Earth',
    color: 'Black/Dark Red',
    qualities: ['Discipline', 'Justice', 'Longevity', 'Dharma'],
    idealUsage: ['Master Bedroom', 'Heavy Storage', 'Strong Room', 'Study', 'Office'],
    prohibitedUsage: ['Main Entrance', 'Puja Room', 'Children\'s Play Area', 'Light Spaces'],
    prosperityIndicators: [
      'Long life and health',
      'Justice and righteousness',
      'Disciplined lifestyle',
      'Protection from enemies'
    ],
    obstructionIndicators: [
      'Health deterioration',
      'Legal troubles',
      'Lack of discipline',
      'Fear and insecurity'
    ]
  },
  {
    direction: 'Southwest',
    directionCode: 'SW',
    devtaName: 'Nirriti',
    devtaTitle: 'Goddess of Destruction and Chaos',
    khanij: ['Heavy Stone', 'Granite', 'Basalt', 'Black Agate', 'Smoky Quartz'],
    element: 'Earth',
    color: 'Brown/Black',
    qualities: ['Stability', 'Grounding', 'Strength', 'Endurance'],
    idealUsage: ['Master Bedroom', 'Heavy Storage', 'Strong Walls', 'Boundary Wall', 'Safe'],
    prohibitedUsage: ['Main Entrance', 'Water Tank', 'Toilet', 'Kitchen', 'Open Spaces'],
    prosperityIndicators: [
      'Stability and security',
      'Strong relationships',
      'Endurance and patience',
      'Wealth preservation'
    ],
    obstructionIndicators: [
      'Instability and chaos',
      'Relationship conflicts',
      'Property disputes',
      'Mental disturbances'
    ]
  },
  {
    direction: 'West',
    directionCode: 'W',
    devtaName: 'Varuna',
    devtaTitle: 'Lord of Water and Oceans',
    khanij: ['Tin', 'White Metals', 'Moonstone', 'Pearl', 'Aquamarine'],
    element: 'Water',
    color: 'Blue/White',
    qualities: ['Emotions', 'Fertility', 'Prosperity', 'Gains'],
    idealUsage: ['Dining Room', 'Children\'s Room', 'Guest Room', 'Storage', 'Wardrobe'],
    prohibitedUsage: ['Kitchen', 'Fire Place', 'Boiler', 'Heavy Machinery'],
    prosperityIndicators: [
      'Emotional balance and peace',
      'Fertility and progeny',
      'Gains and profits',
      'Good relationships'
    ],
    obstructionIndicators: [
      'Emotional instability',
      'Fertility issues',
      'Loss of profits',
      'Relationship problems'
    ]
  },
  {
    direction: 'Northwest',
    directionCode: 'NW',
    devtaName: 'Vayu',
    devtaTitle: 'Lord of Wind and Air',
    khanij: ['Zinc', 'Aluminum', 'Light Metals', 'White Sapphire'],
    element: 'Air',
    color: 'Gray/White',
    qualities: ['Movement', 'Communication', 'Change', 'Networking'],
    idealUsage: ['Guest Room', 'Garage', 'Vehicle Parking', 'Store Room', 'Servant Quarters'],
    prohibitedUsage: ['Puja Room', 'Master Bedroom', 'Safe', 'Treasury'],
    prosperityIndicators: [
      'Good communication and networking',
      'Business partnerships',
      'Travel opportunities',
      'Social connections'
    ],
    obstructionIndicators: [
      'Communication breakdowns',
      'Failed partnerships',
      'Unnecessary expenses',
      'Instability and restlessness'
    ]
  }
];

/**
 * Usage compatibility scores
 */
const USAGE_COMPATIBILITY: { [key: string]: { [usage: string]: number } } = {
  'N': {
    'Treasury': 100, 'Safe': 100, 'Cash Counter': 95, 'Accounts': 90, 'Office': 80,
    'Living Room': 60, 'Bedroom': 50, 'Kitchen': 30, 'Toilet': 0, 'Garbage': 0
  },
  'NE': {
    'Puja Room': 100, 'Meditation': 100, 'Study': 90, 'Library': 85, 'Open Space': 80,
    'Living Room': 60, 'Bedroom': 40, 'Kitchen': 0, 'Toilet': 0, 'Storage': 10
  },
  'E': {
    'Living Room': 100, 'Hall': 95, 'Reception': 90, 'Entrance': 90, 'Balcony': 85,
    'Bedroom': 60, 'Office': 70, 'Kitchen': 40, 'Toilet': 20, 'Storage': 30
  },
  'SE': {
    'Kitchen': 100, 'Electrical': 95, 'Generator': 90, 'Boiler': 85, 'Fire Place': 80,
    'Office': 50, 'Living Room': 40, 'Bathroom': 0, 'Water Tank': 0
  },
  'S': {
    'Master Bedroom': 100, 'Office': 90, 'Study': 85, 'Storage': 80, 'Strong Room': 95,
    'Living Room': 50, 'Kitchen': 40, 'Entrance': 0, 'Puja': 10
  },
  'SW': {
    'Master Bedroom': 100, 'Storage': 95, 'Strong Room': 90, 'Safe': 85, 'Walls': 100,
    'Office': 60, 'Living Room': 40, 'Entrance': 0, 'Kitchen': 20, 'Toilet': 0
  },
  'W': {
    'Dining': 100, 'Children Room': 90, 'Guest Room': 85, 'Storage': 80, 'Wardrobe': 75,
    'Living Room': 60, 'Office': 50, 'Kitchen': 0, 'Boiler': 0
  },
  'NW': {
    'Guest Room': 100, 'Garage': 95, 'Parking': 90, 'Store': 85, 'Servant Quarters': 80,
    'Office': 50, 'Living Room': 40, 'Puja': 0, 'Master Bedroom': 20
  }
};

/**
 * Options for Devta + Khanij analysis
 */
export interface DevtaKhanijAnalysisOptions {
  northRotation?: number;
  sectorUsage?: { [direction: string]: string }; // Usage type for each direction
}

/**
 * Calculate bounding box from boundary points
 */
function calculateBoundingBox(points: Point[]): BoundingBox {
  if (points.length === 0) {
    return {
      minX: 0, maxX: 0, minY: 0, maxY: 0,
      width: 0, height: 0, centerX: 0, centerY: 0,
    };
  }

  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return {
    minX, maxX, minY, maxY,
    width: maxX - minX,
    height: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
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
 * Calculate coverage of zones within boundary
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
      if (isPointInPolygon(point, boundary)) {
        insideSamples++;
      }
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
    if (zone.directionCode.startsWith(dir) || zone.directionCode === dir) {
      return dir;
    }
  }
  return 'N';
}

/**
 * Calculate prosperity score based on coverage and usage
 */
function calculateProsperityScore(
  devta: DevtaInfo,
  coverage: number,
  usageType?: string
): number {
  let score = 0;

  // Base score from coverage (40% weight)
  score += (coverage / 100) * 40;

  // Usage compatibility (60% weight)
  if (usageType) {
    const compatibility = USAGE_COMPATIBILITY[devta.directionCode]?.[usageType] || 50;
    score += (compatibility / 100) * 60;
  } else {
    // No specific usage - moderate score
    score += 30;
  }

  return Math.round(score);
}

/**
 * Calculate obstruction score
 */
function calculateObstructionScore(
  devta: DevtaInfo,
  coverage: number,
  usageType?: string
): number {
  let score = 0;

  if (!usageType) {
    return 0; // No usage means no obstruction
  }

  // Check if usage is prohibited
  const isProhibited = devta.prohibitedUsage.some(prohibited =>
    usageType.toLowerCase().includes(prohibited.toLowerCase())
  );

  if (isProhibited) {
    score = 80 + (coverage / 100) * 20; // High obstruction for prohibited usage
  } else {
    // Calculate based on compatibility deficit
    const compatibility = USAGE_COMPATIBILITY[devta.directionCode]?.[usageType] || 50;
    score = ((100 - compatibility) / 100) * (coverage / 100) * 100;
  }

  return Math.round(score);
}

/**
 * Determine mineral balance
 */
function determineMineralBalance(prosperityScore: number, obstructionScore: number): 'optimal' | 'good' | 'deficient' | 'excessive' {
  if (prosperityScore >= 80 && obstructionScore <= 20) return 'optimal';
  if (prosperityScore >= 60 && obstructionScore <= 40) return 'good';
  if (obstructionScore >= 60) return 'excessive';
  return 'deficient';
}

/**
 * Generate sector recommendations
 */
function generateSectorRecommendations(sector: DevtaKhanijSector): string[] {
  const recommendations: string[] = [];
  const { devta, prosperityScore, obstructionScore, mineralBalance, usageType } = sector;

  // Prosperity recommendations
  if (prosperityScore < 50) {
    recommendations.push(
      `Install ${devta.khanij[0]} objects or symbols in ${devta.direction} to honor ${devta.devtaName}.`
    );
    recommendations.push(
      `Use ${devta.color} colors and ${devta.element} element representations in this direction.`
    );
  }

  // Obstruction remedies
  if (obstructionScore > 60) {
    recommendations.push(
      `CRITICAL: Current usage conflicts with ${devta.devtaName}'s domain. Consider relocation.`
    );
    recommendations.push(
      `If relocation is not possible, perform daily prayers to ${devta.devtaName} for appeasement.`
    );
  }

  // Mineral balance remedies
  switch (mineralBalance) {
    case 'deficient':
      recommendations.push(
        `Place ${devta.khanij[0]} or ${devta.khanij[1]} objects to balance energy in ${devta.direction}.`
      );
      break;
    case 'excessive':
      recommendations.push(
        `Reduce heavy structures and use lighter elements in ${devta.direction}.`
      );
      break;
    case 'optimal':
      recommendations.push(
        `Excellent balance! Maintain current arrangements in ${devta.direction}.`
      );
      break;
  }

  // Usage-specific recommendations
  if (usageType) {
    const isIdeal = devta.idealUsage.some(ideal =>
      usageType.toLowerCase().includes(ideal.toLowerCase())
    );
    
    if (isIdeal) {
      recommendations.push(
        `Perfect alignment! ${usageType} is ideal for ${devta.direction} ruled by ${devta.devtaName}.`
      );
    }
  } else {
    recommendations.push(
      `Consider using this area for: ${devta.idealUsage.slice(0, 3).join(', ')}.`
    );
  }

  return recommendations;
}

/**
 * Generate Devta + Khanij analysis
 */
export function generateDevtaKhanij(
  boundaryPoints: Point[],
  options: DevtaKhanijAnalysisOptions = {}
): DevtaKhanijAnalysisResult {
  const { northRotation = 0, sectorUsage = {} } = options;

  const bbox = calculateBoundingBox(boundaryPoints);
  const center: Point = { x: bbox.centerX, y: bbox.centerY };
  const radius = Math.min(bbox.width, bbox.height) / 2;

  // Generate 32 zones
  const circleZones = generate32CircleZones(center.x, center.y, radius, northRotation);
  const allZones = circleZones.zones;

  // Group zones by main direction
  const directionZones: { [key: string]: CircleZone[] } = {};
  for (const zone of allZones) {
    const mainDir = getMainDirection(zone);
    if (!directionZones[mainDir]) {
      directionZones[mainDir] = [];
    }
    directionZones[mainDir].push(zone);
  }

  // Analyze each direction
  const sectors: DevtaKhanijSector[] = [];
  let totalProsperity = 0;
  let totalObstruction = 0;
  let totalMineralHarmony = 0;

  for (const devta of DEVTA_KHANIJ_MAP) {
    const zones = directionZones[devta.directionCode] || [];
    const coverage = calculateZoneCoverage(zones, boundaryPoints, center, radius);
    const hasStructure = coverage > 10;
    const usageType = sectorUsage[devta.directionCode];

    const prosperityScore = calculateProsperityScore(devta, coverage, usageType);
    const obstructionScore = calculateObstructionScore(devta, coverage, usageType);
    const mineralBalance = determineMineralBalance(prosperityScore, obstructionScore);

    const sector: DevtaKhanijSector = {
      devta,
      zones,
      coverage,
      hasStructure,
      usageType,
      isCompatible: prosperityScore > 60 && obstructionScore < 40,
      prosperityScore,
      obstructionScore,
      mineralBalance,
      recommendations: []
    };

    sector.recommendations = generateSectorRecommendations(sector);
    sectors.push(sector);

    totalProsperity += prosperityScore;
    totalObstruction += obstructionScore;
    totalMineralHarmony += (mineralBalance === 'optimal' ? 100 : mineralBalance === 'good' ? 75 : mineralBalance === 'deficient' ? 40 : 25);
  }

  const overallProsperity = Math.round(totalProsperity / sectors.length);
  const overallObstruction = Math.round(totalObstruction / sectors.length);
  const mineralHarmony = Math.round(totalMineralHarmony / sectors.length);

  const blessedDirections = sectors
    .filter(s => s.prosperityScore >= 70)
    .map(s => s.devta.direction);

  const obstructedDirections = sectors
    .filter(s => s.obstructionScore >= 60)
    .map(s => s.devta.direction);

  // Generate mineral remedies
  const mineralRemedies = sectors
    .filter(s => s.mineralBalance === 'deficient')
    .map(s => ({
      direction: s.devta.direction,
      mineral: s.devta.khanij[0],
      placement: `Place in ${s.devta.direction} sector`,
      purpose: `Enhance ${s.devta.devtaName}'s blessings and ${s.devta.qualities[0]}`
    }));

  // Generate devta appeasement
  const devtaAppeasement = sectors
    .filter(s => s.obstructionScore >= 60)
    .map(s => ({
      devta: s.devta.devtaName,
      direction: s.devta.direction,
      reason: `High obstruction due to incompatible usage`,
      remedy: `Daily prayers and offerings to ${s.devta.devtaName}. Install ${s.devta.khanij[0]} yantra.`
    }));

  // Generate overall recommendations
  const recommendations: string[] = [];

  recommendations.push(
    `Overall Prosperity Level: ${overallProsperity}/100 - ${
      overallProsperity >= 75 ? 'Excellent' :
      overallProsperity >= 60 ? 'Good' :
      overallProsperity >= 40 ? 'Moderate' : 'Needs Improvement'
    }`
  );

  recommendations.push(
    `Mineral Harmony Score: ${mineralHarmony}/100 - Balanced mineral influences ${
      mineralHarmony >= 70 ? 'are well maintained' : 'need attention'
    }.`
  );

  if (blessedDirections.length > 0) {
    recommendations.push(
      `Blessed Directions: ${blessedDirections.join(', ')} - These sectors have strong divine support.`
    );
  }

  if (obstructedDirections.length > 0) {
    recommendations.push(
      `⚠️ Obstructed Directions: ${obstructedDirections.join(', ')} - Immediate remedial action needed.`
    );
  }

  if (overallObstruction > 50) {
    recommendations.push(
      'High obstruction detected. Perform Vastu Shanti Puja and install appropriate minerals.'
    );
  }

  recommendations.push(
    'Maintain cleanliness and sanctity in all directions to honor the ruling Devtas.'
  );

  recommendations.push(
    'Use prescribed minerals and metals as per traditional Vastu guidelines for each direction.'
  );

  return {
    type: 'devta-khanij',
    timestamp: new Date(),
    boundaryPoints,
    recommendations,
    data: {
      sectors,
      overallProsperity,
      overallObstruction,
      mineralHarmony,
      blessedDirections,
      obstructedDirections,
      mineralRemedies,
      devtaAppeasement
    }
  };
}

export { DEVTA_KHANIJ_MAP };
