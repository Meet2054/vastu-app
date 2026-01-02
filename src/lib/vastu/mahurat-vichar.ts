/**
 * Mahurat Vichar Analysis
 * 
 * Time-direction harmony for important activities.
 * Analyzes compatibility between directions, time periods, and activities for auspicious timing.
 * 
 * Features:
 * - Direction-time slot mapping for 8 cardinal directions
 * - Seasonal and monthly time associations
 * - Activity-direction-time compatibility matrix
 * - Favorable/unfavorable timing calculations
 * - Muhurat (auspicious timing) recommendations
 */

import { Point, BoundingBox, AnalysisResult } from './types';
import { generate32CircleZones, CircleZone } from './circle-zones';

/**
 * Time period definition
 */
export interface TimePeriod {
  type: 'season' | 'month' | 'timeOfDay' | 'nakshatra';
  name: string;
  startDate?: string;    // For months/seasons
  endDate?: string;
  startHour?: number;    // For time of day (0-23)
  endHour?: number;
  favorability: number;  // 0-100
}

/**
 * Direction-time mapping
 */
export interface DirectionTimeMahurat {
  direction: string;
  directionCode: string;
  facingDescription: string;
  favorableSeasons: string[];
  unfavorableSeasons: string[];
  favorableMonths: string[];
  unfavorableMonths: string[];
  favorableTimeOfDay: string[];
  unfavorableTimeOfDay: string[];
  planetaryRuler: string;
  nakshatra: string[];          // Associated lunar mansions
  idealActivities: string[];
  timingPrinciple: string;
}

/**
 * Activity-time compatibility
 */
export interface ActivityMahurat {
  activity: string;
  idealDirections: string[];
  avoidDirections: string[];
  idealSeasons: string[];
  idealMonths: string[];
  idealTimeOfDay: string[];
  avoidTimeOfDay: string[];
  duration: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
}

/**
 * Mahurat analysis for a sector
 */
export interface MahuratSector {
  mahurat: DirectionTimeMahurat;
  zones: CircleZone[];
  coverage: number;
  hasStructure: boolean;
  plannedActivity?: string;
  currentSeason?: string;
  currentMonth?: string;
  currentTimeOfDay?: string;
  isFavorableTime: boolean;
  favorabilityScore: number;    // 0-100
  timingQuality: 'highly-auspicious' | 'auspicious' | 'neutral' | 'inauspicious' | 'highly-inauspicious';
  recommendations: string[];
}

/**
 * Mahurat Vichar analysis result
 */
export interface MahuratVicharAnalysisResult extends AnalysisResult {
  recommendations: string[];
  data: {
    sectors: MahuratSector[];
    currentDateTime: string;
    currentSeason: string;
    currentMonth: string;
    overallFavorability: number;         // 0-100
    mostAuspiciousDirections: string[];
    leastAuspiciousDirections: string[];
    activityRecommendations: Array<{
      activity: string;
      bestDirection: string;
      bestTime: string;
      favorability: number;
      reasoning: string;
    }>;
    timingGuidance: {
      immediate: string[];        // What can be done now
      nearFuture: string[];      // What to plan for soon
      avoid: string[];           // What to avoid now
    };
  };
}

/**
 * Direction-Time Mahurat mappings for 8 directions
 */
const DIRECTION_TIME_MAHURAT: DirectionTimeMahurat[] = [
  {
    direction: 'North',
    directionCode: 'N',
    facingDescription: 'North Facing - Wealth and Prosperity Direction',
    favorableSeasons: ['Winter', 'Early Spring'],
    unfavorableSeasons: ['Summer'],
    favorableMonths: ['November', 'December', 'January', 'February'],
    unfavorableMonths: ['May', 'June', 'July'],
    favorableTimeOfDay: ['Midnight (12 AM - 3 AM)', 'Morning (9 AM - 12 PM)'],
    unfavorableTimeOfDay: ['Afternoon (12 PM - 3 PM)'],
    planetaryRuler: 'Mercury (Budha)',
    nakshatra: ['Uttara Bhadrapada', 'Revati', 'Ashwini'],
    idealActivities: ['Financial Planning', 'Business Meetings', 'Investments', 'Wealth Rituals', 'Career Planning'],
    timingPrinciple: 'Best during Mercury hours and cool seasons for intellectual and financial activities'
  },
  {
    direction: 'Northeast',
    directionCode: 'NE',
    facingDescription: 'Northeast Facing - Divine and Spiritual Direction',
    favorableSeasons: ['Spring', 'Early Winter'],
    unfavorableSeasons: ['Monsoon'],
    favorableMonths: ['February', 'March', 'November', 'December'],
    unfavorableMonths: ['July', 'August', 'September'],
    favorableTimeOfDay: ['Brahma Muhurta (4 AM - 6 AM)', 'Morning (6 AM - 9 AM)', 'Sunset (6 PM - 7 PM)'],
    unfavorableTimeOfDay: ['Late Night (10 PM - 12 AM)'],
    planetaryRuler: 'Jupiter (Guru)',
    nakshatra: ['Punarvasu', 'Vishakha', 'Purva Bhadrapada'],
    idealActivities: ['Puja', 'Meditation', 'Spiritual Practices', 'Learning', 'Initiation Ceremonies', 'Yoga'],
    timingPrinciple: 'Most auspicious during Jupiter hours and dawn for spiritual elevation'
  },
  {
    direction: 'East',
    directionCode: 'E',
    facingDescription: 'East Facing - Social and Health Direction',
    favorableSeasons: ['Spring', 'Early Summer'],
    unfavorableSeasons: ['Late Monsoon'],
    favorableMonths: ['March', 'April', 'May'],
    unfavorableMonths: ['September', 'October'],
    favorableTimeOfDay: ['Sunrise (5 AM - 7 AM)', 'Morning (7 AM - 10 AM)'],
    unfavorableTimeOfDay: ['Evening (6 PM - 9 PM)'],
    planetaryRuler: 'Sun (Surya)',
    nakshatra: ['Krittika', 'Uttara Phalguni', 'Uttara Ashadha'],
    idealActivities: ['Exercise', 'Social Gatherings', 'Celebrations', 'New Beginnings', 'Health Activities'],
    timingPrinciple: 'Best during sunrise and Sun hours for vitality and new ventures'
  },
  {
    direction: 'Southeast',
    directionCode: 'SE',
    facingDescription: 'Southeast Facing - Fire and Energy Direction',
    favorableSeasons: ['Summer', 'Early Monsoon'],
    unfavorableSeasons: ['Winter'],
    favorableMonths: ['April', 'May', 'June', 'July'],
    unfavorableMonths: ['December', 'January'],
    favorableTimeOfDay: ['Morning (9 AM - 12 PM)', 'Afternoon (12 PM - 3 PM)'],
    unfavorableTimeOfDay: ['Night (9 PM - 12 AM)'],
    planetaryRuler: 'Venus (Shukra)',
    nakshatra: ['Bharani', 'Purva Phalguni', 'Purva Ashadha'],
    idealActivities: ['Cooking', 'Fire Ceremonies', 'Creative Work', 'Financial Transactions', 'Business Activities'],
    timingPrinciple: 'Favorable during Venus hours and warm seasons for transformation and prosperity'
  },
  {
    direction: 'South',
    directionCode: 'S',
    facingDescription: 'South Facing - Dharma and Longevity Direction',
    favorableSeasons: ['Monsoon', 'Autumn'],
    unfavorableSeasons: ['Spring'],
    favorableMonths: ['July', 'August', 'September', 'October'],
    unfavorableMonths: ['March', 'April'],
    favorableTimeOfDay: ['Afternoon (12 PM - 3 PM)', 'Late Afternoon (3 PM - 6 PM)'],
    unfavorableTimeOfDay: ['Early Morning (5 AM - 8 AM)'],
    planetaryRuler: 'Mars (Mangal)',
    nakshatra: ['Magha', 'Mula', 'Ashlesha'],
    idealActivities: ['Important Decisions', 'Legal Matters', 'Ancestor Worship', 'Serious Work', 'Administration'],
    timingPrinciple: 'Suitable during Mars hours and hot afternoons for discipline and authority'
  },
  {
    direction: 'Southwest',
    directionCode: 'SW',
    facingDescription: 'Southwest Facing - Stability and Relationships Direction',
    favorableSeasons: ['Autumn', 'Early Winter'],
    unfavorableSeasons: ['Spring', 'Early Summer'],
    favorableMonths: ['September', 'October', 'November'],
    unfavorableMonths: ['March', 'April', 'May'],
    favorableTimeOfDay: ['Late Afternoon (3 PM - 6 PM)', 'Evening (6 PM - 9 PM)'],
    unfavorableTimeOfDay: ['Morning (6 AM - 9 AM)'],
    planetaryRuler: 'Rahu (North Node)',
    nakshatra: ['Ardra', 'Swati', 'Shatabhisha'],
    idealActivities: ['Relationship Building', 'Marriage Ceremonies', 'Property Matters', 'Serious Commitments'],
    timingPrinciple: 'Favorable during afternoon decline for grounding and permanence'
  },
  {
    direction: 'West',
    directionCode: 'W',
    facingDescription: 'West Facing - Gains and Benefits Direction',
    favorableSeasons: ['Autumn', 'Winter'],
    unfavorableSeasons: ['Summer'],
    favorableMonths: ['September', 'October', 'November', 'December'],
    unfavorableMonths: ['May', 'June'],
    favorableTimeOfDay: ['Evening (6 PM - 9 PM)', 'Sunset (5 PM - 7 PM)'],
    unfavorableTimeOfDay: ['Morning (6 AM - 9 AM)'],
    planetaryRuler: 'Saturn (Shani)',
    nakshatra: ['Pushya', 'Anuradha', 'Uttara Bhadrapada'],
    idealActivities: ['Dining', 'Family Time', 'Profit-making', 'Receiving', 'Harvest Activities'],
    timingPrinciple: 'Best during Saturn hours and evening for gains and receiving'
  },
  {
    direction: 'Northwest',
    directionCode: 'NW',
    facingDescription: 'Northwest Facing - Movement and Support Direction',
    favorableSeasons: ['Winter', 'Early Spring'],
    unfavorableSeasons: ['Monsoon'],
    favorableMonths: ['January', 'February', 'March'],
    unfavorableMonths: ['July', 'August'],
    favorableTimeOfDay: ['Late Evening (9 PM - 12 AM)', 'Night (12 AM - 3 AM)'],
    unfavorableTimeOfDay: ['Afternoon (12 PM - 3 PM)'],
    planetaryRuler: 'Moon (Chandra)',
    nakshatra: ['Rohini', 'Hasta', 'Shravana'],
    idealActivities: ['Travel', 'Networking', 'Guest Relations', 'Communication', 'Temporary Activities'],
    timingPrinciple: 'Suitable during Moon hours and evening for movement and change'
  }
];

/**
 * Activity Mahurat definitions
 */
const ACTIVITY_MAHURAT: ActivityMahurat[] = [
  {
    activity: 'Griha Pravesh (House Warming)',
    idealDirections: ['N', 'NE', 'E'],
    avoidDirections: ['S', 'SW'],
    idealSeasons: ['Spring', 'Autumn'],
    idealMonths: ['March', 'April', 'October', 'November'],
    idealTimeOfDay: ['Morning (6 AM - 10 AM)'],
    avoidTimeOfDay: ['Night (9 PM onwards)'],
    duration: 'Fixed day ceremony',
    importance: 'critical'
  },
  {
    activity: 'Marriage Ceremony',
    idealDirections: ['NE', 'E', 'N'],
    avoidDirections: ['S', 'SW', 'W'],
    idealSeasons: ['Spring', 'Winter'],
    idealMonths: ['January', 'February', 'March', 'November', 'December'],
    idealTimeOfDay: ['Morning (9 AM - 12 PM)'],
    avoidTimeOfDay: ['Afternoon (1 PM - 4 PM)', 'Night (10 PM onwards)'],
    duration: 'Multiple hours',
    importance: 'critical'
  },
  {
    activity: 'Business Opening',
    idealDirections: ['N', 'E', 'NE'],
    avoidDirections: ['S', 'SW'],
    idealSeasons: ['Spring', 'Autumn'],
    idealMonths: ['March', 'April', 'October', 'November'],
    idealTimeOfDay: ['Morning (9 AM - 11 AM)'],
    avoidTimeOfDay: ['Evening (6 PM onwards)'],
    duration: 'Short ceremony',
    importance: 'high'
  },
  {
    activity: 'Education/Learning Initiation',
    idealDirections: ['NE', 'E', 'N'],
    avoidDirections: ['SW', 'S'],
    idealSeasons: ['Spring', 'Early Summer'],
    idealMonths: ['February', 'March', 'April', 'May'],
    idealTimeOfDay: ['Brahma Muhurta (4 AM - 6 AM)', 'Morning (8 AM - 10 AM)'],
    avoidTimeOfDay: ['Evening (6 PM onwards)'],
    duration: 'Short ritual',
    importance: 'high'
  },
  {
    activity: 'Property Purchase',
    idealDirections: ['N', 'E', 'W'],
    avoidDirections: ['S'],
    idealSeasons: ['Spring', 'Autumn', 'Winter'],
    idealMonths: ['February', 'March', 'October', 'November', 'December'],
    idealTimeOfDay: ['Morning (9 AM - 12 PM)'],
    avoidTimeOfDay: ['Night (8 PM onwards)'],
    duration: 'Transaction timing',
    importance: 'high'
  },
  {
    activity: 'Vehicle Purchase',
    idealDirections: ['NW', 'N', 'E'],
    avoidDirections: ['SW', 'S'],
    idealSeasons: ['Spring', 'Autumn'],
    idealMonths: ['March', 'April', 'October', 'November'],
    idealTimeOfDay: ['Morning (10 AM - 12 PM)'],
    avoidTimeOfDay: ['Evening (6 PM onwards)'],
    duration: 'Purchase moment',
    importance: 'medium'
  },
  {
    activity: 'Surgery/Medical Treatment',
    idealDirections: ['E', 'N', 'NE'],
    avoidDirections: ['S', 'SW', 'W'],
    idealSeasons: ['Spring', 'Autumn'],
    idealMonths: ['March', 'April', 'September', 'October'],
    idealTimeOfDay: ['Morning (8 AM - 11 AM)'],
    avoidTimeOfDay: ['Night (8 PM onwards)'],
    duration: 'As per medical need',
    importance: 'critical'
  },
  {
    activity: 'Construction Start',
    idealDirections: ['N', 'E', 'NE'],
    avoidDirections: ['S', 'SW'],
    idealSeasons: ['Spring', 'Autumn'],
    idealMonths: ['February', 'March', 'April', 'October', 'November'],
    idealTimeOfDay: ['Morning (6 AM - 10 AM)'],
    avoidTimeOfDay: ['Evening (5 PM onwards)'],
    duration: 'Foundation moment',
    importance: 'critical'
  }
];

/**
 * Get current season
 */
function getCurrentSeason(date: Date): string {
  const month = date.getMonth(); // 0-11
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  if (month >= 8 && month <= 9) return 'Autumn';
  if (month >= 10 || month <= 1) return 'Winter';
  return 'Spring';
}

/**
 * Get current month name
 */
function getMonthName(date: Date): string {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return months[date.getMonth()];
}

/**
 * Get time of day category
 */
function getTimeOfDay(date: Date): string {
  const hour = date.getHours();
  if (hour >= 4 && hour < 6) return 'Brahma Muhurta (4 AM - 6 AM)';
  if (hour >= 6 && hour < 9) return 'Morning (6 AM - 9 AM)';
  if (hour >= 9 && hour < 12) return 'Morning (9 AM - 12 PM)';
  if (hour >= 12 && hour < 15) return 'Afternoon (12 PM - 3 PM)';
  if (hour >= 15 && hour < 18) return 'Late Afternoon (3 PM - 6 PM)';
  if (hour >= 18 && hour < 21) return 'Evening (6 PM - 9 PM)';
  if (hour >= 21 || hour < 0) return 'Late Evening (9 PM - 12 AM)';
  return 'Night (12 AM - 3 AM)';
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
 * Calculate favorability score
 */
function calculateFavorabilityScore(
  mahurat: DirectionTimeMahurat,
  season: string,
  month: string,
  timeOfDay: string
): number {
  let score = 50; // Base neutral

  // Season check (40% weight)
  if (mahurat.favorableSeasons.includes(season)) {
    score += 20;
  } else if (mahurat.unfavorableSeasons.includes(season)) {
    score -= 20;
  }

  // Month check (30% weight)
  if (mahurat.favorableMonths.includes(month)) {
    score += 15;
  } else if (mahurat.unfavorableMonths.includes(month)) {
    score -= 15;
  }

  // Time of day check (30% weight)
  const timeMatch = mahurat.favorableTimeOfDay.some(time => timeOfDay.includes(time));
  const timeConflict = mahurat.unfavorableTimeOfDay.some(time => timeOfDay.includes(time));
  
  if (timeMatch) {
    score += 15;
  } else if (timeConflict) {
    score -= 15;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Determine timing quality
 */
function determineTimingQuality(score: number): 'highly-auspicious' | 'auspicious' | 'neutral' | 'inauspicious' | 'highly-inauspicious' {
  if (score >= 80) return 'highly-auspicious';
  if (score >= 60) return 'auspicious';
  if (score >= 40) return 'neutral';
  if (score >= 20) return 'inauspicious';
  return 'highly-inauspicious';
}

/**
 * Generate sector recommendations
 */
function generateMahuratRecommendations(sector: MahuratSector): string[] {
  const recs: string[] = [];
  const { mahurat, favorabilityScore, timingQuality } = sector;

  if (timingQuality === 'highly-auspicious') {
    recs.push(`✨ Highly auspicious time for ${mahurat.direction}! Excellent for: ${mahurat.idealActivities.slice(0, 2).join(', ')}.`);
  } else if (timingQuality === 'highly-inauspicious') {
    recs.push(`⚠️ Highly inauspicious timing for ${mahurat.direction}. Avoid major activities now.`);
    recs.push(`Wait for favorable period: ${mahurat.favorableMonths.slice(0, 2).join(' or ')}, ${mahurat.favorableTimeOfDay[0]}.`);
  }

  if (favorabilityScore < 50) {
    recs.push(`Current timing not ideal. Better seasons: ${mahurat.favorableSeasons.join(', ')}.`);
    recs.push(`Preferred months: ${mahurat.favorableMonths.slice(0, 3).join(', ')}.`);
  }

  recs.push(`Planetary ruler: ${mahurat.planetaryRuler}. Honor with appropriate rituals.`);

  return recs;
}

/**
 * Options for Mahurat Vichar analysis
 */
export interface MahuratVicharAnalysisOptions {
  northRotation?: number;
  analysisDateTime?: Date;
  plannedActivities?: { [direction: string]: string };
}

/**
 * Generate Mahurat Vichar analysis
 */
export function generateMahuratVichar(
  boundaryPoints: Point[],
  options: MahuratVicharAnalysisOptions = {}
): MahuratVicharAnalysisResult {
  const {
    northRotation = 0,
    analysisDateTime = new Date(),
    plannedActivities = {}
  } = options;

  const bbox = calculateBoundingBox(boundaryPoints);
  const center: Point = { x: bbox.centerX, y: bbox.centerY };
  const radius = Math.min(bbox.width, bbox.height) / 2;

  const currentSeason = getCurrentSeason(analysisDateTime);
  const currentMonth = getMonthName(analysisDateTime);
  const currentTimeOfDay = getTimeOfDay(analysisDateTime);

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
  const sectors: MahuratSector[] = [];
  let totalFavorability = 0;

  for (const mahurat of DIRECTION_TIME_MAHURAT) {
    const zones = directionZones[mahurat.directionCode] || [];
    const coverage = calculateZoneCoverage(zones, boundaryPoints, center, radius);
    const hasStructure = coverage > 10;
    const plannedActivity = plannedActivities[mahurat.directionCode];

    const favorabilityScore = calculateFavorabilityScore(mahurat, currentSeason, currentMonth, currentTimeOfDay);
    const timingQuality = determineTimingQuality(favorabilityScore);
    const isFavorableTime = favorabilityScore >= 60;

    const sector: MahuratSector = {
      mahurat,
      zones,
      coverage,
      hasStructure,
      plannedActivity,
      currentSeason,
      currentMonth,
      currentTimeOfDay,
      isFavorableTime,
      favorabilityScore,
      timingQuality,
      recommendations: []
    };

    sector.recommendations = generateMahuratRecommendations(sector);
    sectors.push(sector);
    totalFavorability += favorabilityScore;
  }

  const overallFavorability = Math.round(totalFavorability / sectors.length);

  const mostAuspiciousDirections = sectors
    .filter(s => s.timingQuality === 'highly-auspicious' || s.timingQuality === 'auspicious')
    .map(s => s.mahurat.direction);

  const leastAuspiciousDirections = sectors
    .filter(s => s.timingQuality === 'inauspicious' || s.timingQuality === 'highly-inauspicious')
    .map(s => s.mahurat.direction);

  // Activity recommendations
  const activityRecommendations = ACTIVITY_MAHURAT.map(activity => {
    let bestDirection = '';
    let maxScore = 0;

    for (const dirCode of activity.idealDirections) {
      const sector = sectors.find(s => s.mahurat.directionCode === dirCode);
      if (sector && sector.favorabilityScore > maxScore) {
        maxScore = sector.favorabilityScore;
        bestDirection = sector.mahurat.direction;
      }
    }

    const isSeasonGood = activity.idealSeasons.includes(currentSeason);
    const isMonthGood = activity.idealMonths.includes(currentMonth);
    const isTimeGood = activity.idealTimeOfDay.some(time => currentTimeOfDay.includes(time));

    const finalScore = Math.round((maxScore + (isSeasonGood ? 20 : 0) + (isMonthGood ? 15 : 0) + (isTimeGood ? 15 : 0)) / 1.5);

    return {
      activity: activity.activity,
      bestDirection,
      bestTime: activity.idealTimeOfDay[0],
      favorability: finalScore,
      reasoning: `${isSeasonGood ? 'Good season. ' : 'Not ideal season. '}${isMonthGood ? 'Favorable month. ' : ''}${isTimeGood ? 'Right time of day.' : 'Wait for better time.'}`
    };
  });

  // Timing guidance
  const immediate = activityRecommendations
    .filter(a => a.favorability >= 70)
    .map(a => `${a.activity} in ${a.bestDirection} direction`);

  const nearFuture = sectors
    .filter(s => s.timingQuality === 'neutral')
    .map(s => `Plan ${s.mahurat.idealActivities[0]} in ${s.mahurat.direction} during ${s.mahurat.favorableMonths[0]}`);

  const avoid = sectors
    .filter(s => s.timingQuality === 'highly-inauspicious')
    .map(s => `Avoid major activities in ${s.mahurat.direction} now`);

  // Overall recommendations
  const recommendations: string[] = [];

  recommendations.push(
    `Current Time Analysis: ${currentMonth} ${analysisDateTime.getDate()}, ${currentSeason}, ${currentTimeOfDay}`
  );

  recommendations.push(
    `Overall Favorability: ${overallFavorability}/100 - ${
      overallFavorability >= 75 ? 'Highly Auspicious Period' :
      overallFavorability >= 60 ? 'Auspicious Period' :
      overallFavorability >= 40 ? 'Neutral Period' : 'Inauspicious Period'
    }`
  );

  if (mostAuspiciousDirections.length > 0) {
    recommendations.push(
      `🌟 Most Auspicious Directions Now: ${mostAuspiciousDirections.join(', ')}`
    );
  }

  if (leastAuspiciousDirections.length > 0) {
    recommendations.push(
      `⚠️ Avoid Important Activities In: ${leastAuspiciousDirections.join(', ')}`
    );
  }

  recommendations.push(
    'Consult a qualified Jyotish (Vedic astrologer) for personalized Muhurat calculations.'
  );

  recommendations.push(
    'Consider planetary positions, Nakshatra, Tithi, and individual birth chart for critical ceremonies.'
  );

  return {
    type: 'mahurat-vichar',
    timestamp: new Date(),
    boundaryPoints,
    recommendations,
    data: {
      sectors,
      currentDateTime: analysisDateTime.toISOString(),
      currentSeason,
      currentMonth,
      overallFavorability,
      mostAuspiciousDirections,
      leastAuspiciousDirections,
      activityRecommendations,
      timingGuidance: { immediate, nearFuture, avoid }
    }
  };
}

export { DIRECTION_TIME_MAHURAT, ACTIVITY_MAHURAT };
