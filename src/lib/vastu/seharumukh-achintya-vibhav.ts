/**
 * Seharumukh Achintya Vibhav Analysis
 * 
 * Highly advanced, intangible influence mapping used by senior Vastu consultants.
 * Analyzes subtle, non-physical energies and influences beyond standard measurements.
 * 
 * Features:
 * - Multi-layer directional overlay (9 layers)
 * - Intuition-weighted scoring with rule-based logic
 * - Subtle energy detection and mapping
 * - Intangible influence assessment
 * - Expert-level insights and advanced remediation
 * - Consultant-grade professional analysis
 */

import { Point, BoundingBox, AnalysisResult } from './types';
import { generate32CircleZones, CircleZone } from './circle-zones';

/**
 * Intangible influence layer types
 */
export type IntangibleLayerType = 
  | 'devta-presence'        // Divine presence and blessing
  | 'karmic-imprint'        // Past karma and ancestral influence
  | 'subtle-energy'         // Prana and energy flow
  | 'planetary-influence'   // Graha and celestial impact
  | 'elemental-resonance'   // Pancha mahabhuta harmony
  | 'consciousness-field'   // Mental and spiritual vibration
  | 'time-cycle'            // Temporal influence (Kala)
  | 'spatial-quality'       // Directional essence (Disha)
  | 'intention-field';      // Purpose and occupant aspiration

/**
 * Intangible influence layer
 */
export interface IntangibleLayer {
  type: IntangibleLayerType;
  name: string;
  sanskritName: string;
  description: string;
  detectionMethod: string;
  baseWeight: number;           // 0-1, importance weight
  sensitivity: 'very-high' | 'high' | 'moderate' | 'low';
  professionalLevel: 'master' | 'senior' | 'intermediate' | 'beginner';
}

/**
 * Directional intangible profile
 */
export interface DirectionalIntangibleProfile {
  direction: string;
  directionCode: string;
  layers: {
    [key in IntangibleLayerType]: {
      strength: number;           // 0-100
      quality: 'auspicious' | 'neutral' | 'inauspicious' | 'mixed';
      dominantInfluence: string;
      subtleIndicators: string[];
      intuitionScore: number;     // 0-100, expert intuition weight
      confidence: number;         // 0-100, assessment confidence
    };
  };
  overallIntangibleScore: number;     // 0-100
  achintya: {                         // Inconceivable aspects
    beyondRules: string[];
    paradoxicalFindings: string[];
    unexplainedInfluences: string[];
  };
  seharumukh: {                       // Threshold/boundary aspects
    transitionQuality: string;
    boundaryEffect: string;
    edgeInfluence: number;            // 0-100
  };
}

/**
 * Zone intangible analysis
 */
export interface ZoneIntangibleAnalysis {
  zone: CircleZone;
  profile: DirectionalIntangibleProfile;
  coverage: number;
  intangibleResonance: number;        // 0-100
  harmonicIndex: number;              // 0-100, how well layers harmonize
  dissonanceIndex: number;            // 0-100, conflicting influences
  recommendations: string[];
}

/**
 * Expert insight
 */
export interface ExpertInsight {
  category: 'critical' | 'strategic' | 'tactical' | 'observational';
  level: 'master' | 'senior' | 'intermediate';
  insight: string;
  reasoning: string;
  intangibleBasis: string[];
  confidence: number;                 // 0-100
  actionability: 'immediate' | 'short-term' | 'long-term' | 'informational';
  remediation?: string;
}

/**
 * Seharumukh Achintya Vibhav analysis result
 */
export interface SeharumukhAchintyaVibhavAnalysisResult extends AnalysisResult {
  recommendations: string[];
  data: {
    zoneAnalyses: ZoneIntangibleAnalysis[];
    
    // Layer-wise analysis
    layerAnalyses: {
      layer: IntangibleLayer;
      overallStrength: number;
      distribution: { direction: string; strength: number }[];
      criticalFindings: string[];
    }[];
    
    // Overall metrics
    overallIntangibleHarmony: number;     // 0-100
    overallSubtleEnergyFlow: number;      // 0-100
    overallKarmicBalance: number;         // 0-100
    overallConsciousnessField: number;    // 0-100
    
    // Achintya (inconceivable) findings
    achintyaFindings: {
      finding: string;
      category: 'paradox' | 'beyond-rules' | 'unexplained' | 'transcendent';
      implications: string;
      masterInterpretation: string;
    }[];
    
    // Seharumukh (threshold) analysis
    seharumukhAnalysis: {
      criticalThresholds: {
        location: string;
        type: 'energy-gate' | 'transition-zone' | 'boundary-effect' | 'edge-influence';
        quality: string;
        significance: string;
      }[];
      transitionQuality: number;          // 0-100
      boundaryHarmony: number;            // 0-100
    };
    
    // Expert insights (main output)
    expertInsights: ExpertInsight[];
    
    // Advanced remediation
    advancedRemediation: {
      priority: number;
      category: 'energetic' | 'karmic' | 'consciousness' | 'elemental' | 'temporal' | 'spatial';
      intervention: string;
      methodology: string;
      expectedOutcome: string;
      implementationLevel: 'master' | 'senior' | 'intermediate';
      timeline: string;
    }[];
    
    // Consultant notes
    consultantNotes: {
      overallAssessment: string;
      keyStrengths: string[];
      criticalWeaknesses: string[];
      hiddenOpportunities: string[];
      subtleWarnings: string[];
      professionalRecommendation: string;
    };
  };
}

/**
 * Define intangible layers
 */
const INTANGIBLE_LAYERS: IntangibleLayer[] = [
  {
    type: 'devta-presence',
    name: 'Divine Presence',
    sanskritName: 'देवता उपस्थिति',
    description: 'Detection of divine blessing and deity influence in each direction',
    detectionMethod: 'Mantra response, sacred geometry, directional deity alignment',
    baseWeight: 0.15,
    sensitivity: 'very-high',
    professionalLevel: 'master'
  },
  {
    type: 'karmic-imprint',
    name: 'Karmic Imprint',
    sanskritName: 'कर्म संस्कार',
    description: 'Assessment of ancestral karma and past-life influences',
    detectionMethod: 'Occupant history, lineage patterns, recurring issues',
    baseWeight: 0.12,
    sensitivity: 'high',
    professionalLevel: 'master'
  },
  {
    type: 'subtle-energy',
    name: 'Subtle Energy Flow',
    sanskritName: 'सूक्ष्म प्राण प्रवाह',
    description: 'Prana flow patterns and subtle energy circulation',
    detectionMethod: 'Energy sensing, dowsing, directional vitality',
    baseWeight: 0.14,
    sensitivity: 'very-high',
    professionalLevel: 'senior'
  },
  {
    type: 'planetary-influence',
    name: 'Planetary Influence',
    sanskritName: 'ग्रह प्रभाव',
    description: 'Nine planetary forces and their directional impact',
    detectionMethod: 'Astrological correlation, graha-disha alignment',
    baseWeight: 0.11,
    sensitivity: 'high',
    professionalLevel: 'senior'
  },
  {
    type: 'elemental-resonance',
    name: 'Elemental Resonance',
    sanskritName: 'पंच महाभूत अनुनाद',
    description: 'Five element harmony and directional elemental strength',
    detectionMethod: 'Elemental balance testing, directional element dominance',
    baseWeight: 0.13,
    sensitivity: 'high',
    professionalLevel: 'senior'
  },
  {
    type: 'consciousness-field',
    name: 'Consciousness Field',
    sanskritName: 'चेतना क्षेत्र',
    description: 'Mental and spiritual vibration quality in each direction',
    detectionMethod: 'Meditation response, consciousness clarity, mental peace',
    baseWeight: 0.10,
    sensitivity: 'very-high',
    professionalLevel: 'master'
  },
  {
    type: 'time-cycle',
    name: 'Temporal Influence',
    sanskritName: 'काल चक्र',
    description: 'Time cycle effects and temporal energy patterns',
    detectionMethod: 'Muhurta correlation, temporal harmony, cycle analysis',
    baseWeight: 0.09,
    sensitivity: 'moderate',
    professionalLevel: 'intermediate'
  },
  {
    type: 'spatial-quality',
    name: 'Spatial Quality',
    sanskritName: 'दिशा गुण',
    description: 'Inherent directional essence and spatial characteristics',
    detectionMethod: 'Directional quality assessment, spatial harmony',
    baseWeight: 0.08,
    sensitivity: 'moderate',
    professionalLevel: 'intermediate'
  },
  {
    type: 'intention-field',
    name: 'Intention Field',
    sanskritName: 'संकल्प क्षेत्र',
    description: 'Purpose alignment and occupant aspiration support',
    detectionMethod: 'Goal achievement tracking, aspiration resonance',
    baseWeight: 0.08,
    sensitivity: 'high',
    professionalLevel: 'senior'
  }
];

/**
 * Directional intangible mappings
 */
const DIRECTIONAL_INTANGIBLE_DATA: { [key: string]: Partial<DirectionalIntangibleProfile> } = {
  'N': {
    direction: 'North',
    directionCode: 'N',
    seharumukh: {
      transitionQuality: 'Magnetic threshold - attracts prosperity',
      boundaryEffect: 'Wealth accumulation boundary',
      edgeInfluence: 85
    }
  },
  'NE': {
    direction: 'Northeast',
    directionCode: 'NE',
    seharumukh: {
      transitionQuality: 'Divine gateway - highest spiritual threshold',
      boundaryEffect: 'Sacred boundary - purity required',
      edgeInfluence: 100
    }
  },
  'E': {
    direction: 'East',
    directionCode: 'E',
    seharumukh: {
      transitionQuality: 'Solar threshold - new beginnings',
      boundaryEffect: 'Growth and expansion boundary',
      edgeInfluence: 90
    }
  },
  'SE': {
    direction: 'Southeast',
    directionCode: 'SE',
    seharumukh: {
      transitionQuality: 'Fire threshold - transformation zone',
      boundaryEffect: 'Energy activation boundary',
      edgeInfluence: 80
    }
  },
  'S': {
    direction: 'South',
    directionCode: 'S',
    seharumukh: {
      transitionQuality: 'Dharma threshold - duty and discipline',
      boundaryEffect: 'Structural stability boundary',
      edgeInfluence: 75
    }
  },
  'SW': {
    direction: 'Southwest',
    directionCode: 'SW',
    seharumukh: {
      transitionQuality: 'Ancestral threshold - grounding zone',
      boundaryEffect: 'Foundation and stability boundary',
      edgeInfluence: 85
    }
  },
  'W': {
    direction: 'West',
    directionCode: 'W',
    seharumukh: {
      transitionQuality: 'Completion threshold - fulfillment zone',
      boundaryEffect: 'Gain and satisfaction boundary',
      edgeInfluence: 80
    }
  },
  'NW': {
    direction: 'Northwest',
    directionCode: 'NW',
    seharumukh: {
      transitionQuality: 'Air threshold - movement and change',
      boundaryEffect: 'Support and assistance boundary',
      edgeInfluence: 70
    }
  }
};

/**
 * Options for analysis
 */
export interface SeharumukhAchintyaVibhavAnalysisOptions {
  northRotation?: number;
  consultantLevel?: 'master' | 'senior' | 'intermediate';
  intuitionWeight?: number;           // 0-1, how much to weight intuition
  occupantAspiration?: string;
  currentChallenges?: string[];
}

/**
 * Calculate bounding box
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
 * Calculate intuition-weighted score
 */
function calculateIntuitionScore(
  baseScore: number,
  direction: string,
  layerType: IntangibleLayerType,
  intuitionWeight: number
): number {
  // Rule-based intuition adjustments
  let intuitionAdjustment = 0;
  
  // NE is always highly auspicious (master intuition)
  if (direction === 'NE') {
    if (layerType === 'devta-presence' || layerType === 'consciousness-field') {
      intuitionAdjustment = 20;
    } else {
      intuitionAdjustment = 10;
    }
  }
  
  // SW has strong karmic grounding (senior intuition)
  if (direction === 'SW' && layerType === 'karmic-imprint') {
    intuitionAdjustment = 15;
  }
  
  // E has strong solar/consciousness influence
  if (direction === 'E' && (layerType === 'subtle-energy' || layerType === 'consciousness-field')) {
    intuitionAdjustment = 12;
  }
  
  // N has prosperity intuition
  if (direction === 'N' && layerType === 'intention-field') {
    intuitionAdjustment = 10;
  }
  
  // SE fire transformation
  if (direction === 'SE' && layerType === 'elemental-resonance') {
    intuitionAdjustment = 10;
  }
  
  const finalScore = baseScore + (intuitionAdjustment * intuitionWeight);
  return Math.max(0, Math.min(100, finalScore));
}

/**
 * Generate directional intangible profile
 */
function generateDirectionalProfile(
  direction: string,
  intuitionWeight: number
): DirectionalIntangibleProfile {
  const baseData = DIRECTIONAL_INTANGIBLE_DATA[direction] || {
    seharumukh: { transitionQuality: 'Standard', boundaryEffect: 'Neutral', edgeInfluence: 50 }
  };
  
  const layers: any = {};
  let totalScore = 0;
  
  // Generate scores for each layer
  for (const layer of INTANGIBLE_LAYERS) {
    // Base scores vary by direction and layer
    let baseStrength = 50 + Math.random() * 30;
    
    // Direction-specific adjustments
    if (direction === 'NE') baseStrength += 20;
    if (direction === 'N' || direction === 'E') baseStrength += 10;
    if (direction === 'SW') baseStrength += 8;
    if (direction === 'S') baseStrength -= 5;
    
    const intuitionScore = calculateIntuitionScore(baseStrength, direction, layer.type, intuitionWeight);
    
    const quality: 'auspicious' | 'neutral' | 'inauspicious' | 'mixed' = 
      intuitionScore >= 75 ? 'auspicious' :
      intuitionScore >= 55 ? 'neutral' :
      intuitionScore >= 40 ? 'mixed' : 'inauspicious';
    
    layers[layer.type] = {
      strength: Math.round(intuitionScore),
      quality,
      dominantInfluence: `${layer.name} in ${direction}`,
      subtleIndicators: [
        `${layer.sanskritName}`,
        `Detection: ${layer.detectionMethod}`
      ],
      intuitionScore: Math.round(intuitionScore),
      confidence: 70 + Math.random() * 25
    };
    
    totalScore += intuitionScore * layer.baseWeight;
  }
  
  const overallScore = Math.round(totalScore / INTANGIBLE_LAYERS.reduce((sum, l) => sum + l.baseWeight, 0));
  
  return {
    direction: baseData.direction || direction,
    directionCode: direction,
    layers,
    overallIntangibleScore: overallScore,
    achintya: {
      beyondRules: direction === 'NE' ? ['Divine grace beyond measurement', 'Transcendent purity'] : [],
      paradoxicalFindings: [],
      unexplainedInfluences: []
    },
    seharumukh: baseData.seharumukh || { transitionQuality: 'Standard', boundaryEffect: 'Neutral', edgeInfluence: 50 }
  };
}

/**
 * Generate Seharumukh Achintya Vibhav analysis
 */
export function generateSeharumukhAchintyaVibhav(
  boundaryPoints: Point[],
  options: SeharumukhAchintyaVibhavAnalysisOptions = {}
): SeharumukhAchintyaVibhavAnalysisResult {
  const {
    northRotation = 0,
    consultantLevel = 'senior',
    intuitionWeight = 0.5,
    occupantAspiration = '',
  } = options;
  
  // Calculate center and radius from boundary points
  const bbox = calculateBoundingBox(boundaryPoints);
  const center: Point = { x: bbox.centerX, y: bbox.centerY };
  const radius = Math.min(bbox.width, bbox.height) / 2;
  
  const circleZones = generate32CircleZones(center.x, center.y, radius, northRotation);
  const allZones = circleZones.zones;
  
  // Group zones by main direction
  const directionZones: { [key: string]: CircleZone[] } = {};
  const mainDirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  
  for (const zone of allZones) {
    for (const dir of mainDirs) {
      if (zone.directionCode === dir || zone.directionCode.startsWith(dir)) {
        if (!directionZones[dir]) directionZones[dir] = [];
        directionZones[dir].push(zone);
        break;
      }
    }
  }
  
  // Analyze each direction
  const zoneAnalyses: ZoneIntangibleAnalysis[] = [];
  const dirProfiles: { [key: string]: DirectionalIntangibleProfile } = {};
  
  for (const dir of mainDirs) {
    const profile = generateDirectionalProfile(dir, intuitionWeight);
    dirProfiles[dir] = profile;
    
    const zones = directionZones[dir] || [];
    const coverage = zones.length > 0 ? 100 / 8 : 0; // Simplified
    
    // Calculate harmonic and dissonance
    const layerScores = Object.values(profile.layers).map((l: any) => l.strength);
    const avgScore = layerScores.reduce((a, b) => a + b, 0) / layerScores.length;
    const variance = layerScores.map(s => Math.pow(s - avgScore, 2)).reduce((a, b) => a + b, 0) / layerScores.length;
    const harmonicIndex = Math.max(0, 100 - Math.sqrt(variance));
    const dissonanceIndex = 100 - harmonicIndex;
    
    for (const zone of zones) {
      zoneAnalyses.push({
        zone,
        profile,
        coverage,
        intangibleResonance: profile.overallIntangibleScore,
        harmonicIndex: Math.round(harmonicIndex),
        dissonanceIndex: Math.round(dissonanceIndex),
        recommendations: [
          `${profile.direction}: Overall intangible score ${profile.overallIntangibleScore}/100`,
          profile.seharumukh.transitionQuality
        ]
      });
    }
  }
  
  // Layer-wise analysis
  const layerAnalyses = INTANGIBLE_LAYERS.map(layer => {
    const distribution = mainDirs.map(dir => ({
      direction: dir,
      strength: dirProfiles[dir].layers[layer.type].strength
    }));
    
    const overallStrength = Math.round(
      distribution.reduce((sum, d) => sum + d.strength, 0) / distribution.length
    );
    
    const criticalFindings: string[] = [];
    if (overallStrength < 50) {
      criticalFindings.push(`${layer.name} is weak overall - requires ${layer.detectionMethod}`);
    }
    
    return { layer, overallStrength, distribution, criticalFindings };
  });
  
  // Overall metrics
  const overallIntangibleHarmony = Math.round(
    Object.values(dirProfiles).reduce((sum, p) => sum + p.overallIntangibleScore, 0) / mainDirs.length
  );
  
  const subtleEnergyLayer = layerAnalyses.find(l => l.layer.type === 'subtle-energy');
  const karmicLayer = layerAnalyses.find(l => l.layer.type === 'karmic-imprint');
  const consciousnessLayer = layerAnalyses.find(l => l.layer.type === 'consciousness-field');
  
  const overallSubtleEnergyFlow = subtleEnergyLayer?.overallStrength || 50;
  const overallKarmicBalance = karmicLayer?.overallStrength || 50;
  const overallConsciousnessField = consciousnessLayer?.overallStrength || 50;
  
  // Achintya findings
  const achintyaFindings: any[] = [];
  
  if (dirProfiles['NE'].overallIntangibleScore > 90) {
    achintyaFindings.push({
      finding: 'Northeast shows transcendent divine presence beyond standard measurement',
      category: 'transcendent',
      implications: 'Exceptional spiritual potential and grace',
      masterInterpretation: 'This is a rare configuration indicating divine blessing - maintain absolute purity'
    });
  }
  
  if (Math.abs(dirProfiles['N'].overallIntangibleScore - dirProfiles['S'].overallIntangibleScore) > 40) {
    achintyaFindings.push({
      finding: 'North-South axis shows paradoxical energy imbalance',
      category: 'paradox',
      implications: 'Wealth vs stability conflict',
      masterInterpretation: 'Balance required between material gains (N) and karmic grounding (S)'
    });
  }
  
  // Seharumukh analysis
  const criticalThresholds = mainDirs
    .filter(dir => dirProfiles[dir].seharumukh.edgeInfluence > 80)
    .map(dir => ({
      location: dir,
      type: 'energy-gate' as const,
      quality: dirProfiles[dir].seharumukh.transitionQuality,
      significance: `High edge influence (${dirProfiles[dir].seharumukh.edgeInfluence}/100)`
    }));
  
  const transitionQuality = Math.round(
    mainDirs.reduce((sum, dir) => sum + dirProfiles[dir].seharumukh.edgeInfluence, 0) / mainDirs.length
  );
  
  // Expert insights (main output)
  const expertInsights: ExpertInsight[] = [];
  
  // Critical insights
  if (dirProfiles['NE'].overallIntangibleScore < 70) {
    expertInsights.push({
      category: 'critical',
      level: 'master',
      insight: 'Northeast intangible harmony is compromised',
      reasoning: `Score ${dirProfiles['NE'].overallIntangibleScore}/100 indicates blocked divine energy`,
      intangibleBasis: ['devta-presence', 'consciousness-field', 'subtle-energy'],
      confidence: 95,
      actionability: 'immediate',
      remediation: 'Perform daily prayers, maintain absolute cleanliness, install sacred geometry'
    });
  }
  
  // Strategic insights
  if (occupantAspiration) {
    expertInsights.push({
      category: 'strategic',
      level: 'senior',
      insight: `Intention field alignment for aspiration: "${occupantAspiration}"`,
      reasoning: 'Multiple intangible layers show resonance patterns',
      intangibleBasis: ['intention-field', 'consciousness-field', 'planetary-influence'],
      confidence: 80,
      actionability: 'short-term',
      remediation: 'Strengthen North (prosperity) and East (growth) sectors'
    });
  }
  
  // Observational insights
  expertInsights.push({
    category: 'observational',
    level: consultantLevel,
    insight: `Overall intangible harmony at ${overallIntangibleHarmony}/100`,
    reasoning: 'Composite analysis of all 9 intangible layers across 8 directions',
    intangibleBasis: INTANGIBLE_LAYERS.map(l => l.type) as string[],
    confidence: 85,
    actionability: 'informational'
  });
  
  // Advanced remediation
  const advancedRemediation: any[] = [];
  
  if (overallSubtleEnergyFlow < 60) {
    advancedRemediation.push({
      priority: 1,
      category: 'energetic',
      intervention: 'Prana activation ritual',
      methodology: 'Daily pranayama at sunrise in Northeast, yantra installation',
      expectedOutcome: 'Restore subtle energy circulation within 40 days',
      implementationLevel: 'senior',
      timeline: '40-90 days'
    });
  }
  
  if (overallKarmicBalance < 55) {
    advancedRemediation.push({
      priority: 2,
      category: 'karmic',
      intervention: 'Ancestral appeasement ceremony',
      methodology: 'Pitru tarpana, Southwest enhancement, lineage healing',
      expectedOutcome: 'Clear karmic blockages, stabilize family harmony',
      implementationLevel: 'master',
      timeline: '3-6 months'
    });
  }
  
  // Consultant notes
  const consultantNotes = {
    overallAssessment: `This property shows ${overallIntangibleHarmony >= 75 ? 'strong' : overallIntangibleHarmony >= 60 ? 'moderate' : 'weak'} intangible harmony. Consultant level: ${consultantLevel}.`,
    keyStrengths: Object.entries(dirProfiles)
      .filter(([_, p]) => p.overallIntangibleScore > 75)
      .map(([dir, p]) => `${dir}: ${p.overallIntangibleScore}/100 - ${p.seharumukh.transitionQuality}`),
    criticalWeaknesses: Object.entries(dirProfiles)
      .filter(([_, p]) => p.overallIntangibleScore < 55)
      .map(([dir, p]) => `${dir}: ${p.overallIntangibleScore}/100 - Requires attention`),
    hiddenOpportunities: achintyaFindings
      .filter(f => f.category === 'transcendent' || f.category === 'beyond-rules')
      .map(f => f.finding),
    subtleWarnings: achintyaFindings
      .filter(f => f.category === 'paradox' || f.category === 'unexplained')
      .map(f => f.finding),
    professionalRecommendation: expertInsights[0]?.remediation || 'Continue monitoring intangible patterns'
  };
  
  // Recommendations
  const recommendations: string[] = [];
  
  recommendations.push(
    `🔮 Intangible Harmony: ${overallIntangibleHarmony}/100 | Subtle Energy: ${overallSubtleEnergyFlow}/100 | Karmic Balance: ${overallKarmicBalance}/100`
  );
  
  recommendations.push(
    `Consciousness Field: ${overallConsciousnessField}/100 | Transition Quality: ${transitionQuality}/100`
  );
  
  if (expertInsights.some(i => i.category === 'critical')) {
    recommendations.push('🔴 Critical intangible imbalances detected - Master consultant intervention recommended');
  }
  
  recommendations.push(
    `${expertInsights.length} expert insight(s) | ${achintyaFindings.length} achintya finding(s) | ${criticalThresholds.length} critical threshold(s)`
  );
  
  if (consultantNotes.keyStrengths.length > 0) {
    recommendations.push(`✅ Strengths: ${consultantNotes.keyStrengths[0]}`);
  }
  
  if (advancedRemediation.length > 0) {
    recommendations.push(`🔧 ${advancedRemediation.length} advanced remediation(s) recommended`);
  }
  
  return {
    type: 'seharumukh-achintya-vibhav',
    timestamp: new Date(),
    boundaryPoints,
    recommendations,
    data: {
      zoneAnalyses,
      layerAnalyses,
      overallIntangibleHarmony,
      overallSubtleEnergyFlow,
      overallKarmicBalance,
      overallConsciousnessField,
      achintyaFindings,
      seharumukhAnalysis: {
        criticalThresholds,
        transitionQuality,
        boundaryHarmony: transitionQuality
      },
      expertInsights,
      advancedRemediation,
      consultantNotes
    }
  };
}

export { INTANGIBLE_LAYERS, DIRECTIONAL_INTANGIBLE_DATA };
