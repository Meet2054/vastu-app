/**
 * Devta Bhojan Aadi Analysis
 * 
 * Extended nourishment logic with comprehensive lifestyle impact.
 * Analyzes food, eating habits, lifestyle patterns, and their health implications.
 * 
 * Features:
 * - Bhojan (food/nourishment) analysis per direction
 * - Aadi (extended) lifestyle factors
 * - Multi-dimensional health impact scoring
 * - Lifestyle activity recommendations
 * - Eating habits and meal timing analysis
 * - Comprehensive health and wellness guidance
 */

import { Point, BoundingBox, AnalysisResult } from './types';
import { generate32CircleZones, CircleZone } from './circle-zones';

/**
 * Food category information
 */
export interface FoodCategoryInfo {
  name: string;
  sanskritName: string;
  nature: 'heating' | 'cooling' | 'neutral';
  guna: 'sattvic' | 'rajasic' | 'tamasic';
  digestibility: 'light' | 'moderate' | 'heavy';
  recommendedDirections: string[];
  prohibitedDirections: string[];
}

/**
 * Lifestyle activity information
 */
export interface LifestyleActivityInfo {
  name: string;
  category: 'physical' | 'mental' | 'rest' | 'work' | 'social' | 'spiritual';
  intensity: 'high' | 'moderate' | 'low';
  idealDirections: string[];
  idealTiming: string[];
  healthBenefits: string[];
}

/**
 * Directional Bhojan Aadi information
 */
export interface DirectionalBhojanAadiInfo {
  direction: string;
  directionCode: string;
  devta: string;
  // Food/Nourishment aspects
  idealFoodTypes: FoodCategoryInfo[];
  idealCookingMethods: string[];
  idealMealTypes: string[];
  foodEnergyQuality: string;
  digestiveImpact: number;        // 0-100, higher = better digestion
  nutritionalBenefit: number;     // 0-100, higher = more nourishing
  // Lifestyle aspects (Aadi)
  idealLifestyleActivities: LifestyleActivityInfo[];
  idealSleepPattern: string;
  idealWorkActivities: string[];
  idealRelaxationActivities: string[];
  idealExerciseTypes: string[];
  idealSocialActivities: string[];
  // Health impact
  physicalHealthImpact: number;   // 0-100
  mentalHealthImpact: number;     // 0-100
  emotionalHealthImpact: number;  // 0-100
  spiritualHealthImpact: number;  // 0-100
  immunityBoost: number;          // 0-100
  longevityImpact: number;        // 0-100
  // Timing recommendations
  idealMealTimes: string[];
  idealActivityTimes: string[];
  // Guidelines
  lifestyleGuidelines: string[];
  prohibitedActivities: string[];
}

/**
 * Zone Bhojan Aadi analysis
 */
export interface ZoneBhojanAadiSector {
  bhojanAadiInfo: DirectionalBhojanAadiInfo;
  zones: CircleZone[];
  coverage: number;
  presentActivities: string[];
  // Scores
  nourishmentScore: number;       // 0-100, food aspect
  lifestyleScore: number;         // 0-100, lifestyle aspect
  healthImpactScore: number;      // 0-100, overall health impact
  wellnessIndex: number;          // 0-100, comprehensive wellness
  // Analysis
  currentUsageAlignment: 'excellent' | 'good' | 'moderate' | 'poor' | 'harmful';
  missingOptimalActivities: string[];
  presentHarmfulActivities: string[];
  recommendations: string[];
}

/**
 * Devta Bhojan Aadi analysis result
 */
export interface DevtaBhojanAadiAnalysisResult extends AnalysisResult {
  recommendations: string[];
  data: {
    sectors: ZoneBhojanAadiSector[];
    overallNourishmentQuality: number;  // 0-100
    overallLifestyleQuality: number;    // 0-100
    overallHealthIndex: number;         // 0-100
    overallWellnessScore: number;       // 0-100
    healthDimensions: {
      physical: number;
      mental: number;
      emotional: number;
      spiritual: number;
      immunity: number;
      longevity: number;
    };
    lifestyleRecommendations: {
      diet: string[];
      exercise: string[];
      sleep: string[];
      work: string[];
      relaxation: string[];
      social: string[];
      spiritual: string[];
    };
    criticalIssues: Array<{
      direction: string;
      category: 'food' | 'lifestyle' | 'health';
      issue: string;
      severity: 'critical' | 'high' | 'medium' | 'low';
      impact: string;
      remedy: string;
    }>;
    optimalDailyRoutine: {
      morning: string[];
      afternoon: string[];
      evening: string[];
      night: string[];
    };
  };
}

/**
 * Complete directional Bhojan Aadi mappings for 8 directions
 */
const DIRECTIONAL_BHOJAN_AADI_MAP: DirectionalBhojanAadiInfo[] = [
  {
    direction: 'North',
    directionCode: 'N',
    devta: 'Kubera',
    idealFoodTypes: [
      { name: 'Fresh Fruits', sanskritName: 'ताज़े फल', nature: 'cooling', guna: 'sattvic', digestibility: 'light', recommendedDirections: ['N', 'NE', 'E'], prohibitedDirections: ['S', 'SW'] },
      { name: 'Light Grains', sanskritName: 'हल्के अनाज', nature: 'neutral', guna: 'sattvic', digestibility: 'light', recommendedDirections: ['N', 'NE'], prohibitedDirections: [] },
      { name: 'Dairy (Light)', sanskritName: 'हल्का दुग्ध', nature: 'cooling', guna: 'sattvic', digestibility: 'moderate', recommendedDirections: ['N', 'W'], prohibitedDirections: ['SE'] }
    ],
    idealCookingMethods: ['Steaming', 'Light boiling', 'Raw preparations', 'Minimal cooking'],
    idealMealTypes: ['Light breakfast', 'Snacks', 'Fresh salads', 'Smoothies'],
    foodEnergyQuality: 'Light, cooling, and prosperity-enhancing',
    digestiveImpact: 85,
    nutritionalBenefit: 80,
    idealLifestyleActivities: [
      { name: 'Financial Planning', category: 'work', intensity: 'moderate', idealDirections: ['N'], idealTiming: ['Morning', 'Afternoon'], healthBenefits: ['Mental clarity', 'Reduced stress'] },
      { name: 'Accounting Work', category: 'work', intensity: 'low', idealDirections: ['N'], idealTiming: ['Morning'], healthBenefits: ['Focus', 'Prosperity mindset'] }
    ],
    idealSleepPattern: 'Not ideal for sleep (too activating)',
    idealWorkActivities: ['Financial work', 'Banking', 'Trade', 'Commerce', 'Business planning'],
    idealRelaxationActivities: ['Light reading', 'Planning', 'Organizing'],
    idealExerciseTypes: ['Walking', 'Light yoga', 'Breathing exercises'],
    idealSocialActivities: ['Business meetings', 'Financial discussions', 'Networking'],
    physicalHealthImpact: 75,
    mentalHealthImpact: 90,
    emotionalHealthImpact: 80,
    spiritualHealthImpact: 70,
    immunityBoost: 75,
    longevityImpact: 80,
    idealMealTimes: ['7-9 AM (light breakfast)', '10-11 AM (snacks)'],
    idealActivityTimes: ['6-11 AM (work)', '4-6 PM (planning)'],
    lifestyleGuidelines: [
      'Keep North area light and active during morning',
      'Ideal for wealth-generating activities',
      'Use for financial record-keeping',
      'Light meals and snacks only'
    ],
    prohibitedActivities: ['Heavy cooking', 'Heavy meals', 'Sleeping', 'Toilets', 'Garbage']
  },
  {
    direction: 'Northeast',
    directionCode: 'NE',
    devta: 'Ishana (Shiva)',
    idealFoodTypes: [
      { name: 'Sacred Foods', sanskritName: 'प्रसाद', nature: 'neutral', guna: 'sattvic', digestibility: 'light', recommendedDirections: ['NE'], prohibitedDirections: ['SE', 'S', 'SW'] },
      { name: 'Pure Water', sanskritName: 'शुद्ध जल', nature: 'cooling', guna: 'sattvic', digestibility: 'light', recommendedDirections: ['NE', 'N'], prohibitedDirections: [] },
      { name: 'Light Offerings', sanskritName: 'हल्की भोज्य सामग्री', nature: 'cooling', guna: 'sattvic', digestibility: 'light', recommendedDirections: ['NE'], prohibitedDirections: ['SE'] }
    ],
    idealCookingMethods: ['NO COOKING - Sacred space only'],
    idealMealTypes: ['Prasad only', 'Holy water', 'Simple offerings'],
    foodEnergyQuality: 'Pure, sacred, spiritually elevating',
    digestiveImpact: 90,
    nutritionalBenefit: 70,
    idealLifestyleActivities: [
      { name: 'Prayer & Meditation', category: 'spiritual', intensity: 'low', idealDirections: ['NE'], idealTiming: ['Early morning', 'Evening'], healthBenefits: ['Mental peace', 'Spiritual growth', 'Stress relief'] },
      { name: 'Yoga & Pranayama', category: 'physical', intensity: 'moderate', idealDirections: ['NE'], idealTiming: ['4-6 AM', '6-8 PM'], healthBenefits: ['Flexibility', 'Respiratory health', 'Energy balance'] }
    ],
    idealSleepPattern: 'Not for sleeping (too sacred and energizing)',
    idealWorkActivities: ['Spiritual practices', 'Study', 'Contemplation', 'Prayer'],
    idealRelaxationActivities: ['Meditation', 'Prayer', 'Reading scriptures', 'Contemplation'],
    idealExerciseTypes: ['Yoga', 'Pranayama', 'Light stretching', 'Tai Chi'],
    idealSocialActivities: ['Spiritual gatherings', 'Satsang', 'Group meditation'],
    physicalHealthImpact: 85,
    mentalHealthImpact: 100,
    emotionalHealthImpact: 95,
    spiritualHealthImpact: 100,
    immunityBoost: 90,
    longevityImpact: 95,
    idealMealTimes: ['NONE - No eating in sacred space'],
    idealActivityTimes: ['4-6 AM (meditation)', '6-8 PM (prayer)'],
    lifestyleGuidelines: [
      'CRITICAL: Keep completely pure and sacred',
      'Only spiritual and devotional activities',
      'Daily prayer and meditation mandatory',
      'Absolutely no cooking, eating, or sleeping',
      'Water offerings and bathing acceptable'
    ],
    prohibitedActivities: ['Cooking', 'Heavy eating', 'Sleeping', 'Toilets', 'Impure activities', 'Heavy work', 'Arguments']
  },
  {
    direction: 'East',
    directionCode: 'E',
    devta: 'Indra (Surya)',
    idealFoodTypes: [
      { name: 'Fresh Breakfast Foods', sanskritName: 'प्रातः भोजन', nature: 'heating', guna: 'sattvic', digestibility: 'moderate', recommendedDirections: ['E'], prohibitedDirections: ['W'] },
      { name: 'Whole Grains', sanskritName: 'सम्पूर्ण अनाज', nature: 'neutral', guna: 'sattvic', digestibility: 'moderate', recommendedDirections: ['E', 'N'], prohibitedDirections: [] },
      { name: 'Energizing Foods', sanskritName: 'ऊर्जादायक भोजन', nature: 'heating', guna: 'rajasic', digestibility: 'moderate', recommendedDirections: ['E'], prohibitedDirections: ['NE'] }
    ],
    idealCookingMethods: ['Light cooking', 'Breakfast preparations', 'Quick sautéing'],
    idealMealTypes: ['Breakfast', 'Morning meals', 'Energizing snacks'],
    foodEnergyQuality: 'Energizing, growth-promoting, vitality-boosting',
    digestiveImpact: 90,
    nutritionalBenefit: 85,
    idealLifestyleActivities: [
      { name: 'Morning Exercise', category: 'physical', intensity: 'high', idealDirections: ['E'], idealTiming: ['5-8 AM'], healthBenefits: ['Cardiovascular health', 'Energy boost', 'Mental alertness'] },
      { name: 'New Ventures', category: 'work', intensity: 'moderate', idealDirections: ['E'], idealTiming: ['Morning'], healthBenefits: ['Motivation', 'Confidence', 'Success orientation'] }
    ],
    idealSleepPattern: 'Not ideal for sleep (activating energy)',
    idealWorkActivities: ['Client meetings', 'New projects', 'Marketing', 'Public relations', 'Creative work'],
    idealRelaxationActivities: ['Sunrise viewing', 'Morning walks', 'Light socializing'],
    idealExerciseTypes: ['Running', 'Cardio', 'Dynamic yoga', 'Sports', 'Active workouts'],
    idealSocialActivities: ['Morning gatherings', 'Professional networking', 'Community events'],
    physicalHealthImpact: 95,
    mentalHealthImpact: 90,
    emotionalHealthImpact: 85,
    spiritualHealthImpact: 75,
    immunityBoost: 85,
    longevityImpact: 90,
    idealMealTimes: ['6-9 AM (breakfast)', '10-11 AM (mid-morning snack)'],
    idealActivityTimes: ['5-8 AM (exercise)', '9 AM-12 PM (work)'],
    lifestyleGuidelines: [
      'Perfect for morning routines and breakfast',
      'Energizing activities in morning hours',
      'Catch morning sunlight for vitamin D',
      'Start new initiatives from East'
    ],
    prohibitedActivities: ['Heavy dinner', 'Sleeping', 'Dark rooms', 'Stagnant activities']
  },
  {
    direction: 'Southeast',
    directionCode: 'SE',
    devta: 'Agni',
    idealFoodTypes: [
      { name: 'Cooked Foods', sanskritName: 'पका भोजन', nature: 'heating', guna: 'rajasic', digestibility: 'moderate', recommendedDirections: ['SE'], prohibitedDirections: ['N', 'NE'] },
      { name: 'Spicy Foods', sanskritName: 'मसालेदार भोजन', nature: 'heating', guna: 'rajasic', digestibility: 'moderate', recommendedDirections: ['SE'], prohibitedDirections: ['NE'] },
      { name: 'Protein-Rich Foods', sanskritName: 'प्रोटीन युक्त भोजन', nature: 'heating', guna: 'rajasic', digestibility: 'heavy', recommendedDirections: ['SE', 'S'], prohibitedDirections: ['NE'] }
    ],
    idealCookingMethods: ['High-heat cooking', 'Frying', 'Grilling', 'Roasting', 'All cooking methods'],
    idealMealTypes: ['All main meals', 'Lunch', 'Dinner', 'Cooked dishes'],
    foodEnergyQuality: 'Transformative, energizing, digestive fire-supporting',
    digestiveImpact: 95,
    nutritionalBenefit: 90,
    idealLifestyleActivities: [
      { name: 'Cooking', category: 'work', intensity: 'moderate', idealDirections: ['SE'], idealTiming: ['Meal times'], healthBenefits: ['Nourishment creation', 'Family bonding'] },
      { name: 'Active Work', category: 'physical', intensity: 'high', idealDirections: ['SE'], idealTiming: ['Daytime'], healthBenefits: ['Energy expenditure', 'Productivity'] }
    ],
    idealSleepPattern: 'Not ideal for sleep (too activating)',
    idealWorkActivities: ['Kitchen work', 'Active production', 'Energy-intensive tasks', 'Transformation activities'],
    idealRelaxationActivities: ['Light cooking', 'Warm baths'],
    idealExerciseTypes: ['High-intensity workouts', 'Weight training', 'Power yoga', 'Martial arts'],
    idealSocialActivities: ['Family meals', 'Cooking together', 'Dining events'],
    physicalHealthImpact: 90,
    mentalHealthImpact: 80,
    emotionalHealthImpact: 85,
    spiritualHealthImpact: 65,
    immunityBoost: 85,
    longevityImpact: 80,
    idealMealTimes: ['12-2 PM (lunch)', '7-9 PM (dinner)'],
    idealActivityTimes: ['11 AM-2 PM (cooking)', '6-9 PM (dinner prep)'],
    lifestyleGuidelines: [
      'IDEAL for kitchen and all cooking',
      'All main meals should be cooked here',
      'Supports digestive fire (Agni)',
      'High-energy activities suitable'
    ],
    prohibitedActivities: ['Water storage', 'Sleeping', 'Cool activities', 'Toilets']
  },
  {
    direction: 'South',
    directionCode: 'S',
    devta: 'Yama',
    idealFoodTypes: [
      { name: 'Heavy Foods', sanskritName: 'गुरु भोजन', nature: 'neutral', guna: 'tamasic', digestibility: 'heavy', recommendedDirections: ['S', 'SW'], prohibitedDirections: ['N', 'NE'] },
      { name: 'Grounding Foods', sanskritName: 'स्थिर भोजन', nature: 'neutral', guna: 'tamasic', digestibility: 'heavy', recommendedDirections: ['S'], prohibitedDirections: ['E'] },
      { name: 'Long-stored Foods', sanskritName: 'संचित भोजन', nature: 'neutral', guna: 'tamasic', digestibility: 'moderate', recommendedDirections: ['S', 'SW'], prohibitedDirections: ['NE'] }
    ],
    idealCookingMethods: ['Slow cooking', 'Pressure cooking', 'Storage'],
    idealMealTypes: ['Heavy dinner', 'Storage of provisions', 'Preserved foods'],
    foodEnergyQuality: 'Grounding, stabilizing, longevity-supporting',
    digestiveImpact: 70,
    nutritionalBenefit: 75,
    idealLifestyleActivities: [
      { name: 'Disciplined Work', category: 'work', intensity: 'moderate', idealDirections: ['S'], idealTiming: ['Afternoon'], healthBenefits: ['Structure', 'Discipline', 'Stability'] },
      { name: 'Storage Activities', category: 'work', intensity: 'low', idealDirections: ['S', 'SW'], idealTiming: ['Anytime'], healthBenefits: ['Organization', 'Security'] }
    ],
    idealSleepPattern: 'Acceptable but not ideal (too heavy)',
    idealWorkActivities: ['Record-keeping', 'Documentation', 'Storage management', 'Legal work'],
    idealRelaxationActivities: ['Reading', 'Quiet contemplation', 'Solitary activities'],
    idealExerciseTypes: ['Slow yoga', 'Weight-bearing exercises', 'Grounding practices'],
    idealSocialActivities: ['Formal gatherings', 'Serious discussions', 'Elder consultations'],
    physicalHealthImpact: 75,
    mentalHealthImpact: 70,
    emotionalHealthImpact: 65,
    spiritualHealthImpact: 70,
    immunityBoost: 70,
    longevityImpact: 85,
    idealMealTimes: ['8-10 PM (late dinner if needed)'],
    idealActivityTimes: ['2-6 PM (disciplined work)'],
    lifestyleGuidelines: [
      'Good for storage of heavy items',
      'Suitable for disciplined activities',
      'Heavy structures beneficial',
      'Limit to storage and structured work'
    ],
    prohibitedActivities: ['Main entrance', 'Active kitchens', 'Light activities', 'Excessive social activity']
  },
  {
    direction: 'Southwest',
    directionCode: 'SW',
    devta: 'Nirriti (Pitru)',
    idealFoodTypes: [
      { name: 'Heavy Meals', sanskritName: 'भारी भोजन', nature: 'neutral', guna: 'tamasic', digestibility: 'heavy', recommendedDirections: ['SW', 'S'], prohibitedDirections: ['N', 'NE', 'E'] },
      { name: 'Stored Provisions', sanskritName: 'भंडारित खाद्य', nature: 'neutral', guna: 'tamasic', digestibility: 'moderate', recommendedDirections: ['SW'], prohibitedDirections: ['NE'] },
      { name: 'Traditional Foods', sanskritName: 'परंपरागत भोजन', nature: 'neutral', guna: 'sattvic', digestibility: 'moderate', recommendedDirections: ['SW'], prohibitedDirections: [] }
    ],
    idealCookingMethods: ['Traditional cooking', 'Long-preparation dishes', 'Storage'],
    idealMealTypes: ['Heavy dinner', 'Food storage', 'Traditional preparations'],
    foodEnergyQuality: 'Grounding, ancestral, foundation-building',
    digestiveImpact: 65,
    nutritionalBenefit: 80,
    idealLifestyleActivities: [
      { name: 'Deep Sleep', category: 'rest', intensity: 'low', idealDirections: ['SW'], idealTiming: ['Night'], healthBenefits: ['Rest', 'Recovery', 'Longevity', 'Stability'] },
      { name: 'Decision Making', category: 'work', intensity: 'moderate', idealDirections: ['SW'], idealTiming: ['Evening'], healthBenefits: ['Clarity', 'Wisdom', 'Groundedness'] }
    ],
    idealSleepPattern: 'IDEAL for sleep - Most important sleeping direction',
    idealWorkActivities: ['Strategic planning', 'Important decisions', 'Master bedroom', 'Valuable storage'],
    idealRelaxationActivities: ['Deep rest', 'Reflection', 'Family time', 'Ancestral remembrance'],
    idealExerciseTypes: ['Restorative yoga', 'Gentle stretching', 'Grounding exercises'],
    idealSocialActivities: ['Family gatherings', 'Elder interactions', 'Intimate meetings'],
    physicalHealthImpact: 85,
    mentalHealthImpact: 90,
    emotionalHealthImpact: 90,
    spiritualHealthImpact: 85,
    immunityBoost: 80,
    longevityImpact: 95,
    idealMealTimes: ['8-9 PM (early dinner before sleep)'],
    idealActivityTimes: ['10 PM-6 AM (sleep)', '6-8 PM (family time)'],
    lifestyleGuidelines: [
      'CRITICAL: Master bedroom in Southwest',
      'Best direction for sleeping',
      'Important decision-making here',
      'Heavy construction mandatory',
      'Storage of valuables ideal'
    ],
    prohibitedActivities: ['Kitchen', 'Main entrance', 'Toilets', 'Active work areas']
  },
  {
    direction: 'West',
    directionCode: 'W',
    devta: 'Varuna',
    idealFoodTypes: [
      { name: 'Evening Meals', sanskritName: 'संध्या भोजन', nature: 'cooling', guna: 'sattvic', digestibility: 'moderate', recommendedDirections: ['W'], prohibitedDirections: [] },
      { name: 'Cooling Foods', sanskritName: 'शीतल भोजन', nature: 'cooling', guna: 'sattvic', digestibility: 'light', recommendedDirections: ['W', 'N'], prohibitedDirections: ['SE'] },
      { name: 'Satisfying Meals', sanskritName: 'तृप्तिदायक भोजन', nature: 'neutral', guna: 'sattvic', digestibility: 'moderate', recommendedDirections: ['W'], prohibitedDirections: [] }
    ],
    idealCookingMethods: ['Moderate cooking', 'Evening preparations', 'Balanced methods'],
    idealMealTypes: ['Early dinner', 'Evening meals', 'Satisfying dishes'],
    foodEnergyQuality: 'Satisfying, profit-enhancing, emotionally fulfilling',
    digestiveImpact: 80,
    nutritionalBenefit: 85,
    idealLifestyleActivities: [
      { name: 'Dining Area', category: 'social', intensity: 'low', idealDirections: ['W'], idealTiming: ['Evening'], healthBenefits: ['Satisfaction', 'Family bonding', 'Emotional fulfillment'] },
      { name: 'Profit Activities', category: 'work', intensity: 'moderate', idealDirections: ['W'], idealTiming: ['Afternoon/Evening'], healthBenefits: ['Financial gains', 'Success satisfaction'] }
    ],
    idealSleepPattern: 'Moderate for sleep (better for dining/relaxation)',
    idealWorkActivities: ['Client service', 'Sales', 'Profit collection', 'Customer relations'],
    idealRelaxationActivities: ['Dining', 'Family time', 'Evening entertainment', 'Sunset viewing'],
    idealExerciseTypes: ['Moderate exercise', 'Evening walks', 'Swimming', 'Balanced yoga'],
    idealSocialActivities: ['Dining together', 'Evening gatherings', 'Entertainment', 'Celebrations'],
    physicalHealthImpact: 80,
    mentalHealthImpact: 85,
    emotionalHealthImpact: 90,
    spiritualHealthImpact: 75,
    immunityBoost: 80,
    longevityImpact: 85,
    idealMealTimes: ['6-8 PM (dinner)', '4-5 PM (evening snacks)'],
    idealActivityTimes: ['5-9 PM (dining and relaxation)'],
    lifestyleGuidelines: [
      'Excellent for dining area',
      'Good for profit-related activities',
      'Suitable for evening meals',
      'Family gathering space'
    ],
    prohibitedActivities: ['Heavy cooking (use SE)', 'Main kitchen', 'Toilets']
  },
  {
    direction: 'Northwest',
    directionCode: 'NW',
    devta: 'Vayu',
    idealFoodTypes: [
      { name: 'Light Snacks', sanskritName: 'हल्के नाश्ते', nature: 'neutral', guna: 'rajasic', digestibility: 'light', recommendedDirections: ['NW', 'N'], prohibitedDirections: [] },
      { name: 'Variable Foods', sanskritName: 'परिवर्तनशील भोजन', nature: 'neutral', guna: 'rajasic', digestibility: 'light', recommendedDirections: ['NW'], prohibitedDirections: [] },
      { name: 'Guest Foods', sanskritName: 'अतिथि भोजन', nature: 'neutral', guna: 'sattvic', digestibility: 'moderate', recommendedDirections: ['NW'], prohibitedDirections: [] }
    ],
    idealCookingMethods: ['Quick cooking', 'Light preparations', 'Temporary setups'],
    idealMealTypes: ['Snacks', 'Guest meals', 'Variable meals'],
    foodEnergyQuality: 'Light, changeable, movement-supporting',
    digestiveImpact: 75,
    nutritionalBenefit: 70,
    idealLifestyleActivities: [
      { name: 'Guest Activities', category: 'social', intensity: 'moderate', idealDirections: ['NW'], idealTiming: ['Variable'], healthBenefits: ['Social connection', 'Networking', 'Support systems'] },
      { name: 'Movement Activities', category: 'physical', intensity: 'moderate', idealDirections: ['NW'], idealTiming: ['Variable'], healthBenefits: ['Flexibility', 'Adaptability', 'Circulation'] }
    ],
    idealSleepPattern: 'Not ideal for master bedroom (guest rooms acceptable)',
    idealWorkActivities: ['Temporary work', 'Guest relations', 'Variable tasks', 'Support activities'],
    idealRelaxationActivities: ['Light socializing', 'Guest entertainment', 'Variable activities'],
    idealExerciseTypes: ['Walking', 'Light aerobics', 'Dynamic movements', 'Dance'],
    idealSocialActivities: ['Guest hosting', 'Networking events', 'Temporary gatherings', 'Support meetings'],
    physicalHealthImpact: 70,
    mentalHealthImpact: 75,
    emotionalHealthImpact: 80,
    spiritualHealthImpact: 65,
    immunityBoost: 70,
    longevityImpact: 70,
    idealMealTimes: ['Variable - guest timings', 'Snack times'],
    idealActivityTimes: ['Variable based on needs'],
    lifestyleGuidelines: [
      'Good for guest rooms and activities',
      'Suitable for temporary arrangements',
      'Light and changeable usage',
      'Support and networking activities'
    ],
    prohibitedActivities: ['Master bedroom', 'Permanent storage', 'Main kitchen', 'Heavy fixtures']
  }
];

/**
 * Options for Devta Bhojan Aadi analysis
 */
export interface DevtaBhojanAadiAnalysisOptions {
  northRotation?: number;
  presentActivities?: { [direction: string]: string[] };
  lifestylePreferences?: string[];
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
 * Calculate lifestyle scores
 */
function calculateLifestyleScores(
  bhojanAadiInfo: DirectionalBhojanAadiInfo,
  presentActivities: string[]
): { nourishment: number; lifestyle: number; health: number; wellness: number } {
  let nourishmentScore = bhojanAadiInfo.digestiveImpact * 0.5 + bhojanAadiInfo.nutritionalBenefit * 0.5;
  let lifestyleScore = 70; // Base

  // Check for ideal activities
  const hasIdealActivity = presentActivities.some(activity => 
    bhojanAadiInfo.idealWorkActivities.some(ideal => activity.toLowerCase().includes(ideal.toLowerCase())) ||
    bhojanAadiInfo.idealLifestyleActivities.some(ideal => activity.toLowerCase().includes(ideal.name.toLowerCase()))
  );
  if (hasIdealActivity) lifestyleScore += 20;

  // Check for prohibited activities
  const hasProhibited = presentActivities.some(activity =>
    bhojanAadiInfo.prohibitedActivities.some(prohibited => activity.toLowerCase().includes(prohibited.toLowerCase()))
  );
  if (hasProhibited) {
    nourishmentScore -= 30;
    lifestyleScore -= 40;
  }

  const healthScore = (bhojanAadiInfo.physicalHealthImpact + bhojanAadiInfo.mentalHealthImpact + 
                      bhojanAadiInfo.emotionalHealthImpact + bhojanAadiInfo.spiritualHealthImpact) / 4;
  const wellnessScore = (nourishmentScore + lifestyleScore + healthScore) / 3;

  return {
    nourishment: Math.max(0, Math.min(100, Math.round(nourishmentScore))),
    lifestyle: Math.max(0, Math.min(100, Math.round(lifestyleScore))),
    health: Math.round(healthScore),
    wellness: Math.max(0, Math.min(100, Math.round(wellnessScore)))
  };
}

/**
 * Determine usage alignment
 */
function determineUsageAlignment(scores: { wellness: number }): 'excellent' | 'good' | 'moderate' | 'poor' | 'harmful' {
  if (scores.wellness >= 85) return 'excellent';
  if (scores.wellness >= 70) return 'good';
  if (scores.wellness >= 50) return 'moderate';
  if (scores.wellness >= 30) return 'poor';
  return 'harmful';
}

/**
 * Generate Devta Bhojan Aadi analysis
 */
export function generateDevtaBhojanAadi(
  boundaryPoints: Point[],
  options: DevtaBhojanAadiAnalysisOptions = {}
): DevtaBhojanAadiAnalysisResult {
  const {
    northRotation = 0,
    presentActivities = {},
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
  const sectors: ZoneBhojanAadiSector[] = [];
  let totalNourishment = 0, totalLifestyle = 0, totalHealth = 0, totalWellness = 0;
  const healthDimensionsSum = { physical: 0, mental: 0, emotional: 0, spiritual: 0, immunity: 0, longevity: 0 };
  const criticalIssues: Array<{ direction: string; category: 'food' | 'lifestyle' | 'health'; issue: string; severity: 'critical' | 'high' | 'medium' | 'low'; impact: string; remedy: string }> = [];

  for (const bhojanAadiInfo of DIRECTIONAL_BHOJAN_AADI_MAP) {
    const zones = directionZones[bhojanAadiInfo.directionCode] || [];
    const coverage = calculateZoneCoverage(zones, boundaryPoints, center, radius);
    const dirPresentActivities = presentActivities[bhojanAadiInfo.directionCode] || [];

    const scores = calculateLifestyleScores(bhojanAadiInfo, dirPresentActivities);
    const alignment = determineUsageAlignment(scores);

    const missingOptimal: string[] = [];
    if (bhojanAadiInfo.directionCode === 'SE' && !dirPresentActivities.some(a => a.toLowerCase().includes('kitchen'))) {
      missingOptimal.push('Kitchen (ideal location)');
    }
    if (bhojanAadiInfo.directionCode === 'SW' && !dirPresentActivities.some(a => a.toLowerCase().includes('bedroom'))) {
      missingOptimal.push('Master bedroom (critical for stability)');
    }
    if (bhojanAadiInfo.directionCode === 'NE' && !dirPresentActivities.some(a => a.toLowerCase().includes('prayer') || a.toLowerCase().includes('meditation'))) {
      missingOptimal.push('Prayer/meditation space (highly important)');
    }

    const presentHarmful = dirPresentActivities.filter(activity =>
      bhojanAadiInfo.prohibitedActivities.some(prohibited => activity.toLowerCase().includes(prohibited.toLowerCase()))
    );

    const sector: ZoneBhojanAadiSector = {
      bhojanAadiInfo,
      zones,
      coverage,
      presentActivities: dirPresentActivities,
      nourishmentScore: scores.nourishment,
      lifestyleScore: scores.lifestyle,
      healthImpactScore: scores.health,
      wellnessIndex: scores.wellness,
      currentUsageAlignment: alignment,
      missingOptimalActivities: missingOptimal,
      presentHarmfulActivities: presentHarmful,
      recommendations: []
    };

    // Generate recommendations
    if (presentHarmful.length > 0) {
      sector.recommendations.push(`🔴 Remove ${presentHarmful[0]} from ${bhojanAadiInfo.direction} immediately!`);
      criticalIssues.push({
        direction: bhojanAadiInfo.direction,
        category: 'lifestyle',
        issue: `Prohibited activity: ${presentHarmful[0]}`,
        severity: ['NE', 'N'].includes(bhojanAadiInfo.directionCode) ? 'critical' : 'high',
        impact: `Violates ${bhojanAadiInfo.devta} principles`,
        remedy: `Remove ${presentHarmful[0]} from ${bhojanAadiInfo.direction}`
      });
    }

    if (missingOptimal.length > 0) {
      sector.recommendations.push(`Add: ${missingOptimal[0]}`);
    }

    if (scores.wellness < 50) {
      sector.recommendations.push(`Low wellness score (${scores.wellness}/100) - review usage`);
    }

    sector.recommendations.push(`Ideal: ${bhojanAadiInfo.lifestyleGuidelines[0]}`);

    sectors.push(sector);

    totalNourishment += scores.nourishment;
    totalLifestyle += scores.lifestyle;
    totalHealth += scores.health;
    totalWellness += scores.wellness;

    healthDimensionsSum.physical += bhojanAadiInfo.physicalHealthImpact;
    healthDimensionsSum.mental += bhojanAadiInfo.mentalHealthImpact;
    healthDimensionsSum.emotional += bhojanAadiInfo.emotionalHealthImpact;
    healthDimensionsSum.spiritual += bhojanAadiInfo.spiritualHealthImpact;
    healthDimensionsSum.immunity += bhojanAadiInfo.immunityBoost;
    healthDimensionsSum.longevity += bhojanAadiInfo.longevityImpact;
  }

  const sectorCount = sectors.length;
  const overallNourishmentQuality = Math.round(totalNourishment / sectorCount);
  const overallLifestyleQuality = Math.round(totalLifestyle / sectorCount);
  const overallHealthIndex = Math.round(totalHealth / sectorCount);
  const overallWellnessScore = Math.round(totalWellness / sectorCount);

  const healthDimensions = {
    physical: Math.round(healthDimensionsSum.physical / sectorCount),
    mental: Math.round(healthDimensionsSum.mental / sectorCount),
    emotional: Math.round(healthDimensionsSum.emotional / sectorCount),
    spiritual: Math.round(healthDimensionsSum.spiritual / sectorCount),
    immunity: Math.round(healthDimensionsSum.immunity / sectorCount),
    longevity: Math.round(healthDimensionsSum.longevity / sectorCount)
  };

  // Lifestyle recommendations
  const lifestyleRecommendations = {
    diet: [
      'Cook all main meals in Southeast (Agni direction)',
      'Have light breakfast in East with morning sunlight',
      'Dine in West direction for satisfaction and gains',
      'Store provisions in South/Southwest for longevity',
      'Never cook or eat in Northeast sacred space'
    ],
    exercise: [
      'Morning exercise in East (5-8 AM) for vitality',
      'Yoga and pranayama in Northeast for spiritual growth',
      'High-intensity workouts in Southeast for energy',
      'Evening walks in West for relaxation'
    ],
    sleep: [
      'CRITICAL: Master bedroom in Southwest for stability',
      'Head towards South or West while sleeping',
      'Avoid sleeping in North, Northeast, or East',
      'Retire by 10 PM for optimal health'
    ],
    work: [
      'Financial work in North for prosperity',
      'Client meetings and new projects in East',
      'Active production in Southeast',
      'Decision-making in Southwest evening'
    ],
    relaxation: [
      'Meditation and prayer in Northeast (daily)',
      'Family time in West during evening',
      'Contemplation in Southwest before sleep',
      'Light reading in North'
    ],
    social: [
      'Host guests in Northwest',
      'Family meals in West',
      'Professional networking in East',
      'Spiritual gatherings in Northeast'
    ],
    spiritual: [
      'Daily meditation in Northeast (4-6 AM)',
      'Evening prayer in Northeast (6-8 PM)',
      'Keep Northeast pure and sacred always',
      'Regular offerings to deities'
    ]
  };

  // Optimal daily routine
  const optimalDailyRoutine = {
    morning: [
      '4-6 AM: Meditation in Northeast',
      '6-7 AM: Morning exercise in East',
      '7-9 AM: Light breakfast in East',
      '9 AM-12 PM: Active work in appropriate directions'
    ],
    afternoon: [
      '12-2 PM: Main lunch cooked in Southeast',
      '2-4 PM: Work activities',
      '4-5 PM: Light snacks, short rest'
    ],
    evening: [
      '5-7 PM: Exercise or relaxation',
      '6-8 PM: Evening prayer in Northeast',
      '7-9 PM: Dinner in West direction',
      '8-9 PM: Family time in Southwest'
    ],
    night: [
      '9-10 PM: Light reading, relaxation',
      '10 PM: Sleep in Southwest master bedroom',
      'Head towards South or West'
    ]
  };

  // Overall recommendations
  const recommendations: string[] = [];

  recommendations.push(
    `Overall Wellness: ${overallWellnessScore}/100 | Nourishment: ${overallNourishmentQuality}/100 | Lifestyle: ${overallLifestyleQuality}/100 | Health: ${overallHealthIndex}/100`
  );

  if (criticalIssues.length > 0) {
    recommendations.push(
      `🔴 ${criticalIssues.length} critical lifestyle issue(s) detected! Immediate action required.`
    );
  }

  recommendations.push(
    `Health Profile: Physical ${healthDimensions.physical} | Mental ${healthDimensions.mental} | Emotional ${healthDimensions.emotional} | Spiritual ${healthDimensions.spiritual}`
  );

  const seSector = sectors.find(s => s.bhojanAadiInfo.directionCode === 'SE');
  if (seSector && !seSector.presentActivities.some(a => a.toLowerCase().includes('kitchen'))) {
    recommendations.push('⚠️ IMPORTANT: Place kitchen in Southeast for optimal digestive health!');
  }

  const swSector = sectors.find(s => s.bhojanAadiInfo.directionCode === 'SW');
  if (swSector && !swSector.presentActivities.some(a => a.toLowerCase().includes('bedroom'))) {
    recommendations.push('⚠️ CRITICAL: Master bedroom must be in Southwest for stability and longevity!');
  }

  const neSector = sectors.find(s => s.bhojanAadiInfo.directionCode === 'NE');
  if (neSector && neSector.presentHarmfulActivities.length > 0) {
    recommendations.push('🔴 URGENT: Remove all impure activities from Northeast immediately!');
  }

  recommendations.push(
    `Immunity: ${healthDimensions.immunity}/100 | Longevity: ${healthDimensions.longevity}/100`
  );

  return {
    type: 'devta-bhojan-aadi',
    timestamp: new Date(),
    boundaryPoints,
    recommendations,
    data: {
      sectors,
      overallNourishmentQuality,
      overallLifestyleQuality,
      overallHealthIndex,
      overallWellnessScore,
      healthDimensions,
      lifestyleRecommendations,
      criticalIssues,
      optimalDailyRoutine
    }
  };
}

export { DIRECTIONAL_BHOJAN_AADI_MAP };
