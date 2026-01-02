/**
 * Devta + Bhojan Analysis
 * 
 * Devta influence on food, nourishment, and intake zones.
 * Analyzes compatibility between directional deities and food-related activities.
 * 
 * Features:
 * - Kitchen and dining area directional mapping
 * - Devta influence on food preparation and consumption
 * - Direction-based food suitability analysis
 * - Health and digestion indicators
 * - Nutritional energy flow assessment
 */

import { Point, BoundingBox, AnalysisResult } from './types';
import { generate32CircleZones, CircleZone } from './circle-zones';

/**
 * Devta influence on food and nourishment
 */
export interface DevtaBhojanInfo {
  direction: string;
  directionCode: string;
  rulingDevta: string;
  devtaTitle: string;
  foodInfluence: string;
  nourishmentQuality: string;
  digestionEffect: string;
  healthImpact: string[];
  idealFoodActivities: string[];
  prohibitedFoodActivities: string[];
  idealFoodTypes: string[];
  avoidFoodTypes: string[];
  cookingMethod: string[];
  eatingTimings: string[];
  nutritionalBenefits: string[];
  healthRisks: string[];
}

/**
 * Food zone analysis
 */
export interface FoodZoneSector {
  devtaBhojan: DevtaBhojanInfo;
  zones: CircleZone[];
  coverage: number;
  hasKitchen: boolean;
  hasDining: boolean;
  hasStorage: boolean;
  foodActivityType?: 'cooking' | 'dining' | 'storage' | 'water-source' | 'none';
  isSuitable: boolean;
  healthScore: number;           // 0-100, health benefit score
  digestionScore: number;        // 0-100, digestion quality score
  nourishmentQuality: 'excellent' | 'good' | 'moderate' | 'poor' | 'harmful';
  recommendations: string[];
}

/**
 * Devta + Bhojan analysis result
 */
export interface DevtaBhojanAnalysisResult extends AnalysisResult {
  recommendations: string[];
  data: {
    sectors: FoodZoneSector[];
    kitchenAnalysis?: {
      direction: string;
      devta: string;
      suitability: number;
      healthImpact: string;
      recommendations: string[];
    };
    diningAnalysis?: {
      direction: string;
      devta: string;
      suitability: number;
      socialHarmony: string;
      recommendations: string[];
    };
    overallNourishmentScore: number;    // 0-100
    digestionHarmonyScore: number;      // 0-100
    healthIndicators: {
      positive: string[];
      negative: string[];
      neutral: string[];
    };
    foodEnergyFlow: {
      preparation: string;              // Energy quality during cooking
      consumption: string;              // Energy quality during eating
      storage: string;                  // Energy quality in storage
    };
    remedialMeasures: Array<{
      issue: string;
      remedy: string;
      priority: 'critical' | 'high' | 'medium' | 'low';
    }>;
  };
}

/**
 * Complete Devta + Bhojan mappings for 8 directions
 */
const DEVTA_BHOJAN_MAP: DevtaBhojanInfo[] = [
  {
    direction: 'North',
    directionCode: 'N',
    rulingDevta: 'Kubera',
    devtaTitle: 'Lord of Wealth and Treasures',
    foodInfluence: 'Abundance and Prosperity',
    nourishmentQuality: 'Moderate - Not ideal for food preparation',
    digestionEffect: 'Neutral to Cool',
    healthImpact: ['Mental clarity during meals', 'Peaceful eating environment', 'Moderate digestion'],
    idealFoodActivities: ['Dining Room (acceptable)', 'Food Storage', 'Pantry'],
    prohibitedFoodActivities: ['Kitchen', 'Cooking with Fire', 'Food Waste'],
    idealFoodTypes: ['Light foods', 'Cooling foods', 'Milk products', 'Sweets'],
    avoidFoodTypes: ['Heavy spices', 'Hot foods', 'Excessively cooked food'],
    cookingMethod: ['Minimal cooking', 'Cooling preparations'],
    eatingTimings: ['Morning', 'Midday'],
    nutritionalBenefits: ['Supports wealth consciousness', 'Enhances food appreciation', 'Promotes sharing'],
    healthRisks: ['Weak digestive fire', 'Cold-related issues', 'Slow metabolism']
  },
  {
    direction: 'Northeast',
    directionCode: 'NE',
    rulingDevta: 'Ishana (Shiva)',
    devtaTitle: 'Supreme Lord and Divine',
    foodInfluence: 'Purity and Sattvic Energy',
    nourishmentQuality: 'Excellent for clean water, poor for cooking',
    digestionEffect: 'Purifying',
    healthImpact: ['Spiritual nourishment', 'Mental purity', 'Clean energy intake'],
    idealFoodActivities: ['Water Source', 'Clean Water Storage', 'Drinking Water Area'],
    prohibitedFoodActivities: ['Kitchen', 'Cooking', 'Dining', 'Food Waste', 'Non-veg Storage'],
    idealFoodTypes: ['Pure water', 'Raw foods', 'Sattvic foods', 'Fruits', 'Nuts'],
    avoidFoodTypes: ['Cooked foods', 'Non-vegetarian', 'Tamasic foods', 'Leftover foods'],
    cookingMethod: ['No cooking', 'Raw preparations only'],
    eatingTimings: ['Early morning (Brahma Muhurta)', 'Sunrise'],
    nutritionalBenefits: ['Cleanses body', 'Purifies mind', 'Enhances prana', 'Spiritual energy'],
    healthRisks: ['Cooking here causes spiritual pollution', 'Disturbs divine energy', 'Creates impurity']
  },
  {
    direction: 'East',
    directionCode: 'E',
    rulingDevta: 'Indra',
    devtaTitle: 'King of Gods',
    foodInfluence: 'Social and Rejuvenating',
    nourishmentQuality: 'Good for dining, moderate for cooking',
    digestionEffect: 'Energizing',
    healthImpact: ['Good social eating', 'Morning energy boost', 'Healthy appetite'],
    idealFoodActivities: ['Dining Room', 'Breakfast Area', 'Social Eating'],
    prohibitedFoodActivities: ['Heavy Cooking', 'Food Waste', 'Garbage'],
    idealFoodTypes: ['Fresh foods', 'Morning foods', 'Energizing foods', 'Light breakfast'],
    avoidFoodTypes: ['Heavy dinner', 'Late meals', 'Stale foods'],
    cookingMethod: ['Light cooking', 'Fresh preparations', 'Morning cooking'],
    eatingTimings: ['Sunrise', 'Morning (6-10 AM)', 'Lunch'],
    nutritionalBenefits: ['Boosts vitality', 'Social bonding over food', 'Fresh energy intake'],
    healthRisks: ['Evening meals may disturb energy', 'Avoid heavy foods']
  },
  {
    direction: 'Southeast',
    directionCode: 'SE',
    rulingDevta: 'Agni',
    devtaTitle: 'Lord of Fire and Digestion',
    foodInfluence: 'Digestive Fire and Transformation',
    nourishmentQuality: 'Excellent - Most ideal for kitchen',
    digestionEffect: 'Strong Digestion',
    healthImpact: ['Strong digestive fire', 'Good metabolism', 'Energy transformation', 'Healthy cooking'],
    idealFoodActivities: ['Kitchen', 'Cooking', 'Fire-based Cooking', 'Food Preparation'],
    prohibitedFoodActivities: ['Water Storage', 'Cold Storage', 'Refrigeration (if possible)'],
    idealFoodTypes: ['All cooked foods', 'Spices', 'Hot foods', 'Cooked vegetables', 'Grains'],
    avoidFoodTypes: ['Raw foods only', 'Cold foods exclusively'],
    cookingMethod: ['Fire cooking', 'Baking', 'Roasting', 'Frying', 'All hot preparations'],
    eatingTimings: ['All times suitable', 'Best for lunch preparation'],
    nutritionalBenefits: ['Enhances digestive fire (Agni)', 'Perfect food transformation', 'Metabolic boost', 'Nutrient absorption'],
    healthRisks: ['None if used for cooking', 'Water features here harm digestion']
  },
  {
    direction: 'South',
    directionCode: 'S',
    rulingDevta: 'Yama',
    devtaTitle: 'Lord of Death and Dharma',
    foodInfluence: 'Heavy and Grounding',
    nourishmentQuality: 'Moderate - Heavy food energy',
    digestionEffect: 'Slow but Deep',
    healthImpact: ['Deep nourishment', 'Heavy energy', 'Long-lasting satiation'],
    idealFoodActivities: ['Dining (acceptable)', 'Heavy Food Storage', 'Root Vegetable Storage'],
    prohibitedFoodActivities: ['Primary Kitchen', 'Light Food Preparation', 'Fast Food'],
    idealFoodTypes: ['Heavy foods', 'Root vegetables', 'Proteins', 'Dense foods'],
    avoidFoodTypes: ['Light foods', 'Quick snacks', 'Fast foods'],
    cookingMethod: ['Slow cooking', 'Heavy preparations', 'Traditional methods'],
    eatingTimings: ['Lunch', 'Early dinner'],
    nutritionalBenefits: ['Deep tissue nourishment', 'Grounding energy', 'Strength building'],
    healthRisks: ['Slow digestion', 'Heaviness', 'Avoid late-night eating']
  },
  {
    direction: 'Southwest',
    directionCode: 'SW',
    rulingDevta: 'Nirriti',
    devtaTitle: 'Goddess of Dissolution',
    foodInfluence: 'Stability but Tamasic tendency',
    nourishmentQuality: 'Poor to Moderate for food activities',
    digestionEffect: 'Heavy and Stagnant',
    healthImpact: ['Heavy digestion', 'Possible stagnation', 'Grounding but inert'],
    idealFoodActivities: ['Dry Food Storage', 'Grain Storage', 'Non-perishable Storage'],
    prohibitedFoodActivities: ['Kitchen', 'Primary Dining', 'Fresh Food Preparation', 'Water Source'],
    idealFoodTypes: ['Dry foods', 'Grains', 'Stored foods', 'Preserved foods'],
    avoidFoodTypes: ['Fresh foods', 'Quick-cook foods', 'Light foods'],
    cookingMethod: ['Heavy cooking', 'Preservation methods'],
    eatingTimings: ['Avoid regular meals here'],
    nutritionalBenefits: ['Long-term storage suitability', 'Grain preservation'],
    healthRisks: ['Tamasic energy', 'Digestive sluggishness', 'Food stagnation', 'Heaviness']
  },
  {
    direction: 'West',
    directionCode: 'W',
    rulingDevta: 'Varuna',
    devtaTitle: 'Lord of Water and Oceans',
    foodInfluence: 'Satisfaction and Gains',
    nourishmentQuality: 'Good for dining, poor for cooking',
    digestionEffect: 'Moderate to Good',
    healthImpact: ['Satisfying meals', 'Emotional nourishment', 'Family bonding'],
    idealFoodActivities: ['Dining Room', 'Family Eating Area', 'Food Serving'],
    prohibitedFoodActivities: ['Kitchen', 'Fire-based Cooking', 'Food Waste'],
    idealFoodTypes: ['All foods', 'Family meals', 'Balanced diet', 'Cooked meals'],
    avoidFoodTypes: ['Tamasic foods', 'Stale foods'],
    cookingMethod: ['Avoid primary cooking', 'Light reheating acceptable'],
    eatingTimings: ['Evening meals', 'Dinner', 'Family time'],
    nutritionalBenefits: ['Family harmony during meals', 'Emotional satisfaction', 'Gains through food'],
    healthRisks: ['Cooking with fire not ideal', 'May cause expenses']
  },
  {
    direction: 'Northwest',
    directionCode: 'NW',
    rulingDevta: 'Vayu',
    devtaTitle: 'Lord of Wind',
    foodInfluence: 'Movement and Change',
    nourishmentQuality: 'Moderate - Temporary activities',
    digestionEffect: 'Light and Quick',
    healthImpact: ['Quick digestion', 'Light meals', 'Variable energy'],
    idealFoodActivities: ['Guest Dining', 'Temporary Kitchen', 'Pantry', 'Snack Storage'],
    prohibitedFoodActivities: ['Main Kitchen', 'Main Dining', 'Heavy Food Preparation'],
    idealFoodTypes: ['Light foods', 'Quick snacks', 'Guest foods', 'Travel foods'],
    avoidFoodTypes: ['Heavy meals', 'Main meals', 'Deep nourishment foods'],
    cookingMethod: ['Quick cooking', 'Light preparations', 'Reheating'],
    eatingTimings: ['Snack times', 'Guest meals', 'Irregular timings'],
    nutritionalBenefits: ['Quick energy', 'Light digestion', 'Suitable for guests'],
    healthRisks: ['Lack of deep nourishment', 'Instability', 'Irregular eating patterns']
  }
];

/**
 * Food activity compatibility scores
 */
const ACTIVITY_COMPATIBILITY: { [direction: string]: { [activity: string]: number } } = {
  'N': { 'cooking': 30, 'dining': 60, 'storage': 80, 'water-source': 70 },
  'NE': { 'cooking': 0, 'dining': 20, 'storage': 10, 'water-source': 100 },
  'E': { 'cooking': 50, 'dining': 90, 'storage': 60, 'water-source': 70 },
  'SE': { 'cooking': 100, 'dining': 60, 'storage': 70, 'water-source': 0 },
  'S': { 'cooking': 40, 'dining': 70, 'storage': 85, 'water-source': 30 },
  'SW': { 'cooking': 20, 'dining': 40, 'storage': 90, 'water-source': 10 },
  'W': { 'cooking': 30, 'dining': 95, 'storage': 75, 'water-source': 50 },
  'NW': { 'cooking': 50, 'dining': 65, 'storage': 80, 'water-source': 60 }
};

/**
 * Options for Devta + Bhojan analysis
 */
export interface DevtaBhojanAnalysisOptions {
  northRotation?: number;
  kitchenDirection?: string;
  diningDirection?: string;
  storageDirection?: string;
  waterSourceDirection?: string;
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
 * Calculate health score
 */
function calculateHealthScore(
  devtaBhojan: DevtaBhojanInfo,
  activityType?: 'cooking' | 'dining' | 'storage' | 'water-source' | 'none'
): number {
  if (!activityType || activityType === 'none') return 50;
  
  const compatibility = ACTIVITY_COMPATIBILITY[devtaBhojan.directionCode]?.[activityType] || 50;
  return compatibility;
}

/**
 * Calculate digestion score
 */
function calculateDigestionScore(
  devtaBhojan: DevtaBhojanInfo,
  activityType?: 'cooking' | 'dining' | 'storage' | 'water-source' | 'none'
): number {
  const baseScore: { [key: string]: number } = {
    'N': 50, 'NE': 70, 'E': 75, 'SE': 100, 'S': 60, 'SW': 30, 'W': 70, 'NW': 55
  };
  
  let score = baseScore[devtaBhojan.directionCode] || 50;
  
  if (activityType === 'cooking') {
    if (devtaBhojan.directionCode === 'SE') score = 100;
    else if (devtaBhojan.directionCode === 'NE') score = 0;
    else if (devtaBhojan.directionCode === 'SW') score = 20;
  }
  
  return score;
}

/**
 * Determine nourishment quality
 */
function determineNourishmentQuality(healthScore: number, digestionScore: number): 'excellent' | 'good' | 'moderate' | 'poor' | 'harmful' {
  const avgScore = (healthScore + digestionScore) / 2;
  if (avgScore >= 85) return 'excellent';
  if (avgScore >= 65) return 'good';
  if (avgScore >= 45) return 'moderate';
  if (avgScore >= 25) return 'poor';
  return 'harmful';
}

/**
 * Generate sector recommendations
 */
function generateFoodZoneRecommendations(sector: FoodZoneSector): string[] {
  const recs: string[] = [];
  const { devtaBhojan, foodActivityType, healthScore, nourishmentQuality } = sector;
  
  if (foodActivityType === 'cooking') {
    if (devtaBhojan.directionCode === 'SE') {
      recs.push(`✨ EXCELLENT: Kitchen in ${devtaBhojan.direction} (${devtaBhojan.rulingDevta}) is ideal! Maximum digestive benefits.`);
    } else if (devtaBhojan.directionCode === 'NE') {
      recs.push(`⚠️ CRITICAL: Kitchen in ${devtaBhojan.direction} is highly inauspicious! Relocate immediately.`);
      recs.push(`This placement disturbs ${devtaBhojan.rulingDevta} and causes spiritual pollution.`);
    } else if (healthScore < 50) {
      recs.push(`Kitchen in ${devtaBhojan.direction} is not ideal. Consider moving to Southeast.`);
    }
  }
  
  if (foodActivityType === 'dining') {
    if (devtaBhojan.directionCode === 'W' || devtaBhojan.directionCode === 'E') {
      recs.push(`Good placement! Dining in ${devtaBhojan.direction} promotes ${devtaBhojan.foodInfluence.toLowerCase()}.`);
    }
  }
  
  if (foodActivityType === 'water-source') {
    if (devtaBhojan.directionCode === 'NE') {
      recs.push(`Perfect! Water source in ${devtaBhojan.direction} ensures purity and divine blessings.`);
    } else if (devtaBhojan.directionCode === 'SE') {
      recs.push(`⚠️ Avoid water source in ${devtaBhojan.direction}. Conflicts with Agni element.`);
    }
  }
  
  if (nourishmentQuality === 'harmful' || nourishmentQuality === 'poor') {
    recs.push(`Current placement has negative health effects. Recommended foods: ${devtaBhojan.idealFoodTypes.slice(0, 2).join(', ')}.`);
    recs.push(`Avoid: ${devtaBhojan.avoidFoodTypes.slice(0, 2).join(', ')}.`);
  }
  
  recs.push(`Honor ${devtaBhojan.rulingDevta} with appropriate food offerings and cleanliness.`);
  
  return recs;
}

/**
 * Generate Devta + Bhojan analysis
 */
export function generateDevtaBhojan(
  boundaryPoints: Point[],
  options: DevtaBhojanAnalysisOptions = {}
): DevtaBhojanAnalysisResult {
  const {
    northRotation = 0,
    kitchenDirection,
    diningDirection,
    storageDirection,
    waterSourceDirection
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
  const sectors: FoodZoneSector[] = [];
  let totalHealth = 0;
  let totalDigestion = 0;

  for (const devtaBhojan of DEVTA_BHOJAN_MAP) {
    const zones = directionZones[devtaBhojan.directionCode] || [];
    const coverage = calculateZoneCoverage(zones, boundaryPoints, center, radius);
    
    const hasKitchen = kitchenDirection === devtaBhojan.directionCode;
    const hasDining = diningDirection === devtaBhojan.directionCode;
    const hasStorage = storageDirection === devtaBhojan.directionCode;
    
    let foodActivityType: 'cooking' | 'dining' | 'storage' | 'water-source' | 'none' = 'none';
    if (hasKitchen) foodActivityType = 'cooking';
    else if (hasDining) foodActivityType = 'dining';
    else if (hasStorage) foodActivityType = 'storage';
    else if (waterSourceDirection === devtaBhojan.directionCode) foodActivityType = 'water-source';

    const healthScore = calculateHealthScore(devtaBhojan, foodActivityType);
    const digestionScore = calculateDigestionScore(devtaBhojan, foodActivityType);
    const nourishmentQuality = determineNourishmentQuality(healthScore, digestionScore);
    const isSuitable = healthScore >= 60 && digestionScore >= 60;

    const sector: FoodZoneSector = {
      devtaBhojan,
      zones,
      coverage,
      hasKitchen,
      hasDining,
      hasStorage,
      foodActivityType,
      isSuitable,
      healthScore,
      digestionScore,
      nourishmentQuality,
      recommendations: []
    };

    sector.recommendations = generateFoodZoneRecommendations(sector);
    sectors.push(sector);

    totalHealth += healthScore;
    totalDigestion += digestionScore;
  }

  const overallNourishmentScore = Math.round(totalHealth / sectors.length);
  const digestionHarmonyScore = Math.round(totalDigestion / sectors.length);

  // Kitchen analysis
  let kitchenAnalysis: any = undefined;
  if (kitchenDirection) {
    const kitchenSector = sectors.find(s => s.devtaBhojan.directionCode === kitchenDirection);
    if (kitchenSector) {
      kitchenAnalysis = {
        direction: kitchenSector.devtaBhojan.direction,
        devta: kitchenSector.devtaBhojan.rulingDevta,
        suitability: kitchenSector.healthScore,
        healthImpact: kitchenSector.devtaBhojan.healthImpact.join('; '),
        recommendations: kitchenSector.recommendations
      };
    }
  }

  // Dining analysis
  let diningAnalysis: any = undefined;
  if (diningDirection) {
    const diningSector = sectors.find(s => s.devtaBhojan.directionCode === diningDirection);
    if (diningSector) {
      diningAnalysis = {
        direction: diningSector.devtaBhojan.direction,
        devta: diningSector.devtaBhojan.rulingDevta,
        suitability: diningSector.healthScore,
        socialHarmony: diningSector.devtaBhojan.foodInfluence,
        recommendations: diningSector.recommendations
      };
    }
  }

  // Health indicators
  const healthIndicators = {
    positive: sectors.filter(s => s.healthScore >= 70).map(s => 
      `${s.devtaBhojan.direction}: ${s.devtaBhojan.nutritionalBenefits[0]}`
    ),
    negative: sectors.filter(s => s.healthScore < 40).map(s => 
      `${s.devtaBhojan.direction}: ${s.devtaBhojan.healthRisks[0]}`
    ),
    neutral: sectors.filter(s => s.healthScore >= 40 && s.healthScore < 70).map(s => 
      `${s.devtaBhojan.direction}: Moderate influence`
    )
  };

  // Food energy flow
  const cookingSector = sectors.find(s => s.foodActivityType === 'cooking');
  const diningSectorFlow = sectors.find(s => s.foodActivityType === 'dining');
  const storageSector = sectors.find(s => s.foodActivityType === 'storage');

  const foodEnergyFlow = {
    preparation: cookingSector ? cookingSector.devtaBhojan.nourishmentQuality : 'Not specified',
    consumption: diningSectorFlow ? diningSectorFlow.devtaBhojan.nourishmentQuality : 'Not specified',
    storage: storageSector ? storageSector.devtaBhojan.nourishmentQuality : 'Not specified'
  };

  // Remedial measures
  const remedialMeasures: Array<{
    issue: string;
    remedy: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
  }> = [];

  if (kitchenDirection === 'NE') {
    remedialMeasures.push({
      issue: 'Kitchen in Northeast - Highly inauspicious',
      remedy: 'Relocate kitchen to Southeast immediately. Perform Vastu purification rituals.',
      priority: 'critical'
    });
  }

  if (kitchenDirection && kitchenDirection !== 'SE') {
    const kitchenScore = sectors.find(s => s.devtaBhojan.directionCode === kitchenDirection)?.healthScore || 50;
    if (kitchenScore < 50) {
      remedialMeasures.push({
        issue: `Kitchen in ${kitchenDirection} has low suitability`,
        remedy: 'Consider moving to Southeast. If not possible, enhance Agni element with red colors and maintain extreme cleanliness.',
        priority: 'high'
      });
    }
  }

  if (waterSourceDirection === 'SE') {
    remedialMeasures.push({
      issue: 'Water source in Southeast conflicts with fire element',
      remedy: 'Relocate water storage to Northeast or North. Keep kitchen and water separate.',
      priority: 'high'
    });
  }

  // Overall recommendations
  const recommendations: string[] = [];

  recommendations.push(
    `Overall Nourishment Score: ${overallNourishmentScore}/100 | Digestion Harmony: ${digestionHarmonyScore}/100`
  );

  if (kitchenAnalysis) {
    recommendations.push(
      `Kitchen in ${kitchenAnalysis.direction} (${kitchenAnalysis.devta}): ${kitchenAnalysis.suitability >= 80 ? 'Excellent' : kitchenAnalysis.suitability >= 60 ? 'Good' : kitchenAnalysis.suitability >= 40 ? 'Moderate' : 'Poor'} placement`
    );
  } else {
    recommendations.push(
      '🔥 IMPORTANT: Specify kitchen location for detailed analysis. Southeast (Agni) is most ideal.'
    );
  }

  if (diningAnalysis) {
    recommendations.push(
      `Dining in ${diningAnalysis.direction} promotes ${diningAnalysis.socialHarmony.toLowerCase()}.`
    );
  } else {
    recommendations.push(
      'Specify dining area location. West (Varuna) or East (Indra) are ideal for family meals.'
    );
  }

  if (remedialMeasures.length > 0) {
    const criticalCount = remedialMeasures.filter(r => r.priority === 'critical').length;
    if (criticalCount > 0) {
      recommendations.push(
        `⚠️ ${criticalCount} CRITICAL food-related issues require immediate attention!`
      );
    }
  }

  recommendations.push(
    'Southeast kitchen ensures strong digestive fire and metabolic health.'
  );

  recommendations.push(
    'Honor the ruling Devta of each direction through appropriate food offerings and cleanliness.'
  );

  recommendations.push(
    'Maintain purity in food preparation areas to enhance nutritional and spiritual benefits.'
  );

  return {
    type: 'devta-bhojan',
    timestamp: new Date(),
    boundaryPoints,
    recommendations,
    data: {
      sectors,
      kitchenAnalysis,
      diningAnalysis,
      overallNourishmentScore,
      digestionHarmonyScore,
      healthIndicators,
      foodEnergyFlow,
      remedialMeasures
    }
  };
}

export { DEVTA_BHOJAN_MAP };
