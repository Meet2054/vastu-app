/**
 * Devta Chinha Aadi Analysis
 * 
 * Extended symbolic reading with multi-symbol overlay.
 * Advanced analysis combining multiple symbolic systems with conflict aggregation.
 * 
 * Features:
 * - Multi-layer symbolic overlay (Devta, Planetary, Elemental, Geometric)
 * - Cross-system conflict aggregation
 * - Symbolic coherence analysis
 * - Advanced symbolic harmony scoring
 * - Priority-based remediation recommendations
 * - Comprehensive symbolic report
 */

import { Point, BoundingBox, AnalysisResult } from './types';
import { generate32CircleZones, CircleZone } from './circle-zones';

/**
 * Symbol layer types
 */
export type SymbolLayerType = 'devta' | 'planetary' | 'elemental' | 'geometric' | 'yantra' | 'animal';

/**
 * Multi-layer symbol
 */
export interface MultiLayerSymbol {
  layer: SymbolLayerType;
  name: string;
  sanskritName: string;
  energy: 'positive' | 'neutral' | 'negative';
  strength: number;               // 0-100
  compatibility: string[];        // Compatible symbols
  conflicts: string[];            // Conflicting symbols
  remedialAction: string;
}

/**
 * Zone symbolic profile
 */
export interface ZoneSymbolicProfile {
  zone: CircleZone;
  direction: string;
  directionCode: string;
  devtaLayer: MultiLayerSymbol;
  planetaryLayer: MultiLayerSymbol;
  elementalLayer: MultiLayerSymbol;
  geometricLayer: MultiLayerSymbol;
  yantricLayer: MultiLayerSymbol;
  animalLayer: MultiLayerSymbol;
  presentSymbols: string[];       // Actual symbols present
  symbolicCoherence: number;      // 0-100, how well layers align
  conflictCount: number;
  harmonyScore: number;           // 0-100
  dominantEnergy: 'positive' | 'neutral' | 'negative' | 'mixed';
}

/**
 * Cross-layer conflict
 */
export interface CrossLayerConflict {
  zone: string;
  direction: string;
  layer1: SymbolLayerType;
  symbol1: string;
  layer2: SymbolLayerType;
  symbol2: string;
  conflictType: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  energyClash: string;
  impact: string;
  remedy: string;
  priority: number;               // 1-10, higher = more urgent
}

/**
 * Symbolic coherence metrics
 */
export interface SymbolicCoherenceMetrics {
  overallCoherence: number;       // 0-100
  layerAlignment: number;         // 0-100, how well layers work together
  conflictDensity: number;        // 0-100, lower is better
  harmonyIndex: number;           // 0-100, overall harmony
  energyBalance: {
    positive: number;
    neutral: number;
    negative: number;
  };
  coherenceByDirection: { [direction: string]: number };
}

/**
 * Devta Chinha Aadi analysis result
 */
export interface DevtaChinhaAadiAnalysisResult extends AnalysisResult {
  recommendations: string[];
  data: {
    zoneProfiles: ZoneSymbolicProfile[];
    crossLayerConflicts: CrossLayerConflict[];
    symbolicCoherence: SymbolicCoherenceMetrics;
    criticalConflictZones: string[];
    harmoniousZones: string[];
    priorityRemediation: Array<{
      zone: string;
      direction: string;
      issue: string;
      priority: 'immediate' | 'urgent' | 'high' | 'medium' | 'low';
      action: string;
      expectedImprovement: string;
    }>;
    advancedReport: {
      symbolicStrengths: string[];
      symbolicWeaknesses: string[];
      hiddenConflicts: string[];
      synergisticZones: string[];
      remediationRoadmap: string[];
    };
  };
}

/**
 * Devta layer symbols (8 directions)
 */
const DEVTA_LAYER_MAP: { [key: string]: MultiLayerSymbol } = {
  'N': {
    layer: 'devta',
    name: 'Kubera',
    sanskritName: 'कुबेर',
    energy: 'positive',
    strength: 90,
    compatibility: ['Water', 'Mercury', 'Silver', 'Wealth symbols'],
    conflicts: ['Fire', 'Iron', 'Dark colors', 'Heavy construction'],
    remedialAction: 'Keep light and open with water features'
  },
  'NE': {
    layer: 'devta',
    name: 'Ishana (Shiva)',
    sanskritName: 'ईशान',
    energy: 'positive',
    strength: 100,
    compatibility: ['Ether', 'Crystal', 'White', 'Jupiter', 'Purity symbols'],
    conflicts: ['ANY construction', 'Impurity', 'Heavy materials', 'Dark colors'],
    remedialAction: 'Keep completely open and pure'
  },
  'E': {
    layer: 'devta',
    name: 'Indra (Surya)',
    sanskritName: 'इंद्र',
    energy: 'positive',
    strength: 85,
    compatibility: ['Fire', 'Sun', 'Copper', 'Red', 'Growth symbols'],
    conflicts: ['Blockages', 'Dark', 'Stagnation', 'Cold'],
    remedialAction: 'Keep open with warm colors and copper'
  },
  'SE': {
    layer: 'devta',
    name: 'Agni',
    sanskritName: 'अग्नि',
    energy: 'positive',
    strength: 80,
    compatibility: ['Fire', 'Red', 'Iron', 'Triangle', 'Mars'],
    conflicts: ['Water', 'Cool colors', 'Aluminum'],
    remedialAction: 'Use fire-resistant materials and red colors'
  },
  'S': {
    layer: 'devta',
    name: 'Yama',
    sanskritName: 'यम',
    energy: 'neutral',
    strength: 75,
    compatibility: ['Earth', 'Heavy materials', 'Dark colors', 'Stability'],
    conflicts: ['Light construction', 'Movement', 'Openness'],
    remedialAction: 'Build heavy and stable structures'
  },
  'SW': {
    layer: 'devta',
    name: 'Nirriti (Pitru)',
    sanskritName: 'निऋति',
    energy: 'neutral',
    strength: 85,
    compatibility: ['Earth', 'Heavy materials', 'Ancestors', 'Rahu', 'Foundation'],
    conflicts: ['Light construction', 'Openness', 'Modern symbols'],
    remedialAction: 'Build heaviest structures here'
  },
  'W': {
    layer: 'devta',
    name: 'Varuna',
    sanskritName: 'वरुण',
    energy: 'positive',
    strength: 80,
    compatibility: ['Water', 'White', 'Gain symbols', 'Saturn', 'Pearl'],
    conflicts: ['Loss symbols', 'Fire', 'Expense areas'],
    remedialAction: 'Use moderate construction with water element'
  },
  'NW': {
    layer: 'devta',
    name: 'Vayu',
    sanskritName: 'वायु',
    energy: 'neutral',
    strength: 70,
    compatibility: ['Air', 'Movement', 'Light materials', 'Moon', 'Change'],
    conflicts: ['Heavy construction', 'Permanent fixtures', 'Stagnation'],
    remedialAction: 'Keep light with good ventilation'
  }
};

/**
 * Planetary layer symbols
 */
const PLANETARY_LAYER_MAP: { [key: string]: MultiLayerSymbol } = {
  'N': {
    layer: 'planetary',
    name: 'Mercury (Budha)',
    sanskritName: 'बुध',
    energy: 'positive',
    strength: 85,
    compatibility: ['Trade', 'Communication', 'Green', 'Wednesday'],
    conflicts: ['Stagnation', 'Blockage', 'Silence'],
    remedialAction: 'Enhance communication and trade areas'
  },
  'NE': {
    layer: 'planetary',
    name: 'Jupiter (Guru)',
    sanskritName: 'गुरु',
    energy: 'positive',
    strength: 100,
    compatibility: ['Wisdom', 'Yellow', 'Thursday', 'Learning', 'Gold'],
    conflicts: ['Ignorance', 'Impurity', 'Darkness'],
    remedialAction: 'Sacred space for worship and learning'
  },
  'E': {
    layer: 'planetary',
    name: 'Sun (Surya)',
    sanskritName: 'सूर्य',
    energy: 'positive',
    strength: 95,
    compatibility: ['Power', 'Authority', 'Red', 'Sunday', 'Ruby'],
    conflicts: ['Darkness', 'Weakness', 'Submission'],
    remedialAction: 'Ensure morning sunlight and power symbols'
  },
  'SE': {
    layer: 'planetary',
    name: 'Venus (Shukra)',
    sanskritName: 'शुक्र',
    energy: 'positive',
    strength: 80,
    compatibility: ['Luxury', 'Beauty', 'White', 'Friday', 'Diamond'],
    conflicts: ['Ugliness', 'Discomfort', 'Harshness'],
    remedialAction: 'Beautiful and comfortable design'
  },
  'S': {
    layer: 'planetary',
    name: 'Mars (Mangal)',
    sanskritName: 'मंगल',
    energy: 'neutral',
    strength: 85,
    compatibility: ['Strength', 'Red', 'Tuesday', 'Coral', 'Action'],
    conflicts: ['Weakness', 'Passivity', 'Fragility'],
    remedialAction: 'Strong and protective structures'
  },
  'SW': {
    layer: 'planetary',
    name: 'Rahu (North Node)',
    sanskritName: 'राहु',
    energy: 'neutral',
    strength: 75,
    compatibility: ['Mystery', 'Transformation', 'Saturday', 'Hessonite'],
    conflicts: ['Simplicity', 'Transparency', 'Light'],
    remedialAction: 'Heavy and protective construction'
  },
  'W': {
    layer: 'planetary',
    name: 'Saturn (Shani)',
    sanskritName: 'शनि',
    energy: 'neutral',
    strength: 80,
    compatibility: ['Discipline', 'Blue', 'Saturday', 'Sapphire', 'Work'],
    conflicts: ['Laziness', 'Indiscipline', 'Chaos'],
    remedialAction: 'Structured and disciplined spaces'
  },
  'NW': {
    layer: 'planetary',
    name: 'Moon (Chandra)',
    sanskritName: 'चंद्र',
    energy: 'positive',
    strength: 75,
    compatibility: ['Emotions', 'White', 'Monday', 'Pearl', 'Water'],
    conflicts: ['Harshness', 'Dryness', 'Rigidity'],
    remedialAction: 'Soft and flexible spaces'
  }
};

/**
 * Elemental layer symbols
 */
const ELEMENTAL_LAYER_MAP: { [key: string]: MultiLayerSymbol } = {
  'N': { layer: 'elemental', name: 'Water', sanskritName: 'जल', energy: 'positive', strength: 90, compatibility: ['Flow', 'Cool', 'Blue'], conflicts: ['Fire', 'Heat', 'Dryness'], remedialAction: 'Water features' },
  'NE': { layer: 'elemental', name: 'Ether/Space', sanskritName: 'आकाश', energy: 'positive', strength: 100, compatibility: ['Openness', 'Void', 'Clear'], conflicts: ['Blockage', 'Fill', 'Obstruction'], remedialAction: 'Maximum openness' },
  'E': { layer: 'elemental', name: 'Fire', sanskritName: 'अग्नि', energy: 'positive', strength: 85, compatibility: ['Heat', 'Light', 'Red'], conflicts: ['Water', 'Cold', 'Dark'], remedialAction: 'Light and warmth' },
  'SE': { layer: 'elemental', name: 'Fire', sanskritName: 'अग्नि', energy: 'positive', strength: 90, compatibility: ['Heat', 'Cooking', 'Transform'], conflicts: ['Water', 'Cool', 'Raw'], remedialAction: 'Kitchen and heat sources' },
  'S': { layer: 'elemental', name: 'Earth', sanskritName: 'पृथ्वी', energy: 'neutral', strength: 85, compatibility: ['Heavy', 'Stable', 'Solid'], conflicts: ['Light', 'Movement', 'Air'], remedialAction: 'Heavy construction' },
  'SW': { layer: 'elemental', name: 'Earth', sanskritName: 'पृथ्वी', energy: 'positive', strength: 95, compatibility: ['Heavy', 'Grounding', 'Foundation'], conflicts: ['Light', 'Floating', 'Air'], remedialAction: 'Heaviest construction' },
  'W': { layer: 'elemental', name: 'Water', sanskritName: 'जल', energy: 'positive', strength: 80, compatibility: ['Flow', 'Gain', 'Cool'], conflicts: ['Loss', 'Fire', 'Heat'], remedialAction: 'Water balance' },
  'NW': { layer: 'elemental', name: 'Air', sanskritName: 'वायु', energy: 'neutral', strength: 75, compatibility: ['Movement', 'Change', 'Light'], conflicts: ['Heavy', 'Stable', 'Permanent'], remedialAction: 'Good ventilation' }
};

/**
 * Geometric layer symbols
 */
const GEOMETRIC_LAYER_MAP: { [key: string]: MultiLayerSymbol } = {
  'N': { layer: 'geometric', name: 'Flowing Lines', sanskritName: 'प्रवाह रेखा', energy: 'positive', strength: 80, compatibility: ['Curves', 'Water patterns'], conflicts: ['Sharp angles', 'Blocks'], remedialAction: 'Curved designs' },
  'NE': { layer: 'geometric', name: 'Sacred Geometry', sanskritName: 'पवित्र ज्यामिती', energy: 'positive', strength: 100, compatibility: ['Sri Yantra', 'Mandala', 'Om'], conflicts: ['Irregular shapes', 'Chaos'], remedialAction: 'Sacred patterns' },
  'E': { layer: 'geometric', name: 'Rising Triangle', sanskritName: 'उर्ध्व त्रिकोण', energy: 'positive', strength: 85, compatibility: ['Upward', 'Growth', 'Fire'], conflicts: ['Downward', 'Square', 'Heavy'], remedialAction: 'Upward patterns' },
  'SE': { layer: 'geometric', name: 'Fire Triangle', sanskritName: 'अग्नि त्रिकोण', energy: 'positive', strength: 90, compatibility: ['Red triangle', 'Sharp', 'Pointed'], conflicts: ['Water triangle', 'Round', 'Soft'], remedialAction: 'Triangular elements' },
  'S': { layer: 'geometric', name: 'Square/Rectangle', sanskritName: 'चतुर्भुज', energy: 'neutral', strength: 85, compatibility: ['Stable', 'Heavy', 'Grounded'], conflicts: ['Circles', 'Floating', 'Light'], remedialAction: 'Rectangular forms' },
  'SW': { layer: 'geometric', name: 'Heavy Square', sanskritName: 'गुरु चतुर्भुज', energy: 'positive', strength: 95, compatibility: ['Foundation', 'Cube', 'Solid'], conflicts: ['Light shapes', 'Circles', 'Triangles'], remedialAction: 'Solid square forms' },
  'W': { layer: 'geometric', name: 'Horizontal Lines', sanskritName: 'क्षैतिज रेखा', energy: 'positive', strength: 80, compatibility: ['Balance', 'Calm', 'Moderate'], conflicts: ['Vertical excess', 'Diagonal chaos'], remedialAction: 'Balanced proportions' },
  'NW': { layer: 'geometric', name: 'Light Circles', sanskritName: 'लघु वृत्त', energy: 'neutral', strength: 75, compatibility: ['Round', 'Soft', 'Movement'], conflicts: ['Heavy squares', 'Sharp angles'], remedialAction: 'Circular patterns' }
};

/**
 * Yantric layer symbols
 */
const YANTRIC_LAYER_MAP: { [key: string]: MultiLayerSymbol } = {
  'N': { layer: 'yantra', name: 'Kubera Yantra', sanskritName: 'कुबेर यन्त्र', energy: 'positive', strength: 90, compatibility: ['Wealth grid', '72 squares'], conflicts: ['Poverty symbols'], remedialAction: 'Kubera yantra installation' },
  'NE': { layer: 'yantra', name: 'Sri Yantra', sanskritName: 'श्री यन्त्र', energy: 'positive', strength: 100, compatibility: ['Sacred geometry', '9 triangles'], conflicts: ['Impure symbols'], remedialAction: 'Sri Yantra meditation' },
  'E': { layer: 'yantra', name: 'Surya Yantra', sanskritName: 'सूर्य यन्त्र', energy: 'positive', strength: 90, compatibility: ['6x6 grid', 'Solar power'], conflicts: ['Darkness symbols'], remedialAction: 'Surya yantra for vitality' },
  'SE': { layer: 'yantra', name: 'Agni Yantra', sanskritName: 'अग्नि यन्त्र', energy: 'positive', strength: 85, compatibility: ['Fire triangle', 'Red'], conflicts: ['Water symbols'], remedialAction: 'Agni yantra in kitchen' },
  'S': { layer: 'yantra', name: 'Yama Yantra', sanskritName: 'यम यन्त्र', energy: 'neutral', strength: 75, compatibility: ['Discipline grid'], conflicts: ['Chaos'], remedialAction: 'Yama yantra for protection' },
  'SW': { layer: 'yantra', name: 'Rahu Yantra', sanskritName: 'राहु यन्त्र', energy: 'neutral', strength: 80, compatibility: ['Transformation grid'], conflicts: ['Light symbols'], remedialAction: 'Rahu yantra for stability' },
  'W': { layer: 'yantra', name: 'Shani Yantra', sanskritName: 'शनि यन्त्र', energy: 'neutral', strength: 80, compatibility: ['3x3 grid', 'Saturn power'], conflicts: ['Indiscipline'], remedialAction: 'Shani yantra for gains' },
  'NW': { layer: 'yantra', name: 'Chandra Yantra', sanskritName: 'चंद्र यन्त्र', energy: 'positive', strength: 75, compatibility: ['Moon grid', 'Emotions'], conflicts: ['Harshness'], remedialAction: 'Chandra yantra for peace' }
};

/**
 * Animal layer symbols
 */
const ANIMAL_LAYER_MAP: { [key: string]: MultiLayerSymbol } = {
  'N': { layer: 'animal', name: 'Horse', sanskritName: 'अश्व', energy: 'positive', strength: 85, compatibility: ['Speed', 'Trade', 'Movement'], conflicts: ['Slow animals', 'Stagnation'], remedialAction: 'Horse symbol facing in' },
  'NE': { layer: 'animal', name: 'Bull (Nandi)', sanskritName: 'नंदी', energy: 'positive', strength: 95, compatibility: ['Shiva', 'Purity', 'Devotion'], conflicts: ['Impure animals'], remedialAction: 'Nandi facing Shiva' },
  'E': { layer: 'animal', name: 'Garuda (Eagle)', sanskritName: 'गरुड़', energy: 'positive', strength: 90, compatibility: ['Flight', 'Vision', 'Power'], conflicts: ['Ground animals', 'Weakness'], remedialAction: 'Garuda symbol soaring' },
  'SE': { layer: 'animal', name: 'Ram/Sheep', sanskritName: 'मेष', energy: 'positive', strength: 80, compatibility: ['Fire sign', 'Energy'], conflicts: ['Water animals'], remedialAction: 'Ram symbol for energy' },
  'S': { layer: 'animal', name: 'Buffalo', sanskritName: 'महिष', energy: 'neutral', strength: 85, compatibility: ['Strength', 'Endurance', 'Heavy'], conflicts: ['Light animals', 'Speed'], remedialAction: 'Buffalo for stability' },
  'SW': { layer: 'animal', name: 'Elephant', sanskritName: 'गज', energy: 'positive', strength: 90, compatibility: ['Strength', 'Memory', 'Wisdom'], conflicts: ['Light animals', 'Flying'], remedialAction: 'Elephant for foundation' },
  'W': { layer: 'animal', name: 'Fish', sanskritName: 'मत्स्य', energy: 'positive', strength: 80, compatibility: ['Water', 'Prosperity', 'Flow'], conflicts: ['Fire', 'Dryness'], remedialAction: 'Fish for gains' },
  'NW': { layer: 'animal', name: 'Bird', sanskritName: 'पक्षी', energy: 'neutral', strength: 75, compatibility: ['Flight', 'Freedom', 'Air'], conflicts: ['Cages', 'Heavy animals'], remedialAction: 'Free-flying birds' }
};

/**
 * Options for Devta Chinha Aadi analysis
 */
export interface DevtaChinhaAadiAnalysisOptions {
  northRotation?: number;
  presentSymbols?: { [direction: string]: string[] };
  enabledLayers?: SymbolLayerType[];
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
 * Detect cross-layer conflicts
 */
function detectCrossLayerConflicts(
  profile: ZoneSymbolicProfile
): CrossLayerConflict[] {
  const conflicts: CrossLayerConflict[] = [];
  const layers: Array<{ type: SymbolLayerType; symbol: MultiLayerSymbol }> = [
    { type: 'devta', symbol: profile.devtaLayer },
    { type: 'planetary', symbol: profile.planetaryLayer },
    { type: 'elemental', symbol: profile.elementalLayer },
    { type: 'geometric', symbol: profile.geometricLayer },
    { type: 'yantra', symbol: profile.yantricLayer },
    { type: 'animal', symbol: profile.animalLayer }
  ];

  // Check conflicts between all layer pairs
  for (let i = 0; i < layers.length; i++) {
    for (let j = i + 1; j < layers.length; j++) {
      const layer1 = layers[i];
      const layer2 = layers[j];

      // Check if layer1's conflicts include layer2's name
      const hasConflict = layer1.symbol.conflicts.some(conflict =>
        layer2.symbol.name.toLowerCase().includes(conflict.toLowerCase()) ||
        conflict.toLowerCase().includes(layer2.symbol.name.toLowerCase())
      );

      if (hasConflict) {
        let severity: 'critical' | 'high' | 'medium' | 'low' = 'medium';
        if (['NE', 'N'].includes(profile.directionCode)) severity = 'critical';
        else if (['S', 'SW'].includes(profile.directionCode)) severity = 'high';

        conflicts.push({
          zone: profile.zone.directionCode,
          direction: profile.direction,
          layer1: layer1.type,
          symbol1: layer1.symbol.name,
          layer2: layer2.type,
          symbol2: layer2.symbol.name,
          conflictType: `${layer1.type}-${layer2.type} incompatibility`,
          severity,
          energyClash: `${layer1.symbol.energy} vs ${layer2.symbol.energy}`,
          impact: `Symbolic disharmony in ${profile.direction}`,
          remedy: `${layer1.symbol.remedialAction} OR ${layer2.symbol.remedialAction}`,
          priority: severity === 'critical' ? 10 : severity === 'high' ? 7 : severity === 'medium' ? 5 : 3
        });
      }
    }
  }

  // Check present symbols against recommended symbols
  for (const presentSymbol of profile.presentSymbols) {
    for (const layer of layers) {
      if (layer.symbol.conflicts.some(c => presentSymbol.toLowerCase().includes(c.toLowerCase()))) {
        conflicts.push({
          zone: profile.zone.directionCode,
          direction: profile.direction,
          layer1: layer.type,
          symbol1: layer.symbol.name,
          layer2: layer.type,
          symbol2: presentSymbol,
          conflictType: 'present-symbol conflict',
          severity: ['NE', 'N'].includes(profile.directionCode) ? 'critical' : 'high',
          energyClash: `${layer.symbol.energy} vs negative`,
          impact: `Present symbol conflicts with ${layer.type} layer`,
          remedy: `Remove ${presentSymbol} from ${profile.direction}`,
          priority: ['NE', 'N'].includes(profile.directionCode) ? 10 : 7
        });
      }
    }
  }

  return conflicts;
}

/**
 * Calculate symbolic coherence
 */
function calculateSymbolicCoherence(
  devtaLayer: MultiLayerSymbol,
  planetaryLayer: MultiLayerSymbol,
  elementalLayer: MultiLayerSymbol,
  geometricLayer: MultiLayerSymbol,
  yantricLayer: MultiLayerSymbol,
  animalLayer: MultiLayerSymbol
): number {
  const layers = [devtaLayer, planetaryLayer, elementalLayer, geometricLayer, yantricLayer, animalLayer];
  
  let totalCompatibility = 0;
  let checks = 0;

  for (let i = 0; i < layers.length; i++) {
    for (let j = i + 1; j < layers.length; j++) {
      const compatible = layers[i].compatibility.some(c =>
        layers[j].name.toLowerCase().includes(c.toLowerCase()) ||
        layers[j].compatibility.some(c2 => c2.toLowerCase().includes(c.toLowerCase()))
      );
      
      if (compatible) totalCompatibility++;
      checks++;
    }
  }

  return Math.round((totalCompatibility / checks) * 100);
}

/**
 * Calculate harmony score
 */
function calculateHarmonyScore(
  coherence: number,
  conflictCount: number,
  energyStrength: number
): number {
  const conflictPenalty = Math.min(conflictCount * 15, 50);
  return Math.max(0, Math.round(coherence * 0.5 + energyStrength * 0.3 - conflictPenalty + 20));
}

/**
 * Determine dominant energy
 */
function determineDominantEnergy(layers: MultiLayerSymbol[]): 'positive' | 'neutral' | 'negative' | 'mixed' {
  const positive = layers.filter(l => l.energy === 'positive').length;
  const neutral = layers.filter(l => l.energy === 'neutral').length;
  const negative = layers.filter(l => l.energy === 'negative').length;

  if (positive >= 4) return 'positive';
  if (negative >= 3) return 'negative';
  if (positive === neutral || (positive > 0 && neutral > 0 && negative > 0)) return 'mixed';
  return 'neutral';
}

/**
 * Generate Devta Chinha Aadi analysis
 */
export function generateDevtaChinhaAadi(
  boundaryPoints: Point[],
  options: DevtaChinhaAadiAnalysisOptions = {}
): DevtaChinhaAadiAnalysisResult {
  const {
    northRotation = 0,
    presentSymbols = {},
  } = options;

  const bbox = calculateBoundingBox(boundaryPoints);
  const center: Point = { x: bbox.centerX, y: bbox.centerY };
  const radius = Math.min(bbox.width, bbox.height) / 2;

  const circleZones = generate32CircleZones(center.x, center.y, radius, northRotation);
  const allZones = circleZones.zones;

  // Build zone profiles
  const zoneProfiles: ZoneSymbolicProfile[] = [];
  const allConflicts: CrossLayerConflict[] = [];

  for (const zone of allZones) {
    const mainDir = getMainDirection(zone);
    const dirPresent = presentSymbols[mainDir] || [];

    const devtaLayer = DEVTA_LAYER_MAP[mainDir];
    const planetaryLayer = PLANETARY_LAYER_MAP[mainDir];
    const elementalLayer = ELEMENTAL_LAYER_MAP[mainDir];
    const geometricLayer = GEOMETRIC_LAYER_MAP[mainDir];
    const yantricLayer = YANTRIC_LAYER_MAP[mainDir];
    const animalLayer = ANIMAL_LAYER_MAP[mainDir];

    const coherence = calculateSymbolicCoherence(
      devtaLayer, planetaryLayer, elementalLayer, geometricLayer, yantricLayer, animalLayer
    );

    const profile: ZoneSymbolicProfile = {
      zone,
      direction: zone.direction,
      directionCode: mainDir,
      devtaLayer,
      planetaryLayer,
      elementalLayer,
      geometricLayer,
      yantricLayer,
      animalLayer,
      presentSymbols: dirPresent,
      symbolicCoherence: coherence,
      conflictCount: 0,
      harmonyScore: 0,
      dominantEnergy: 'positive'
    };

    const conflicts = detectCrossLayerConflicts(profile);
    profile.conflictCount = conflicts.length;
    allConflicts.push(...conflicts);

    const avgStrength = (devtaLayer.strength + planetaryLayer.strength + elementalLayer.strength +
                        geometricLayer.strength + yantricLayer.strength + animalLayer.strength) / 6;
    profile.harmonyScore = calculateHarmonyScore(coherence, conflicts.length, avgStrength);
    profile.dominantEnergy = determineDominantEnergy([devtaLayer, planetaryLayer, elementalLayer, geometricLayer, yantricLayer, animalLayer]);

    zoneProfiles.push(profile);
  }

  // Aggregate metrics by direction
  const directionCoherence: { [dir: string]: number } = {};
  const dirGroups: { [dir: string]: ZoneSymbolicProfile[] } = {};

  for (const profile of zoneProfiles) {
    if (!dirGroups[profile.directionCode]) dirGroups[profile.directionCode] = [];
    dirGroups[profile.directionCode].push(profile);
  }

  for (const dir in dirGroups) {
    const zones = dirGroups[dir];
    directionCoherence[dir] = Math.round(zones.reduce((sum, z) => sum + z.symbolicCoherence, 0) / zones.length);
  }

  const overallCoherence = Math.round(zoneProfiles.reduce((sum, z) => sum + z.symbolicCoherence, 0) / zoneProfiles.length);
  const conflictDensity = Math.min(100, allConflicts.length * 3);
  const layerAlignment = Math.max(0, 100 - conflictDensity);
  const harmonyIndex = Math.round(zoneProfiles.reduce((sum, z) => sum + z.harmonyScore, 0) / zoneProfiles.length);

  const energyBalance = {
    positive: Math.round((zoneProfiles.filter(z => z.dominantEnergy === 'positive').length / zoneProfiles.length) * 100),
    neutral: Math.round((zoneProfiles.filter(z => z.dominantEnergy === 'neutral').length / zoneProfiles.length) * 100),
    negative: Math.round((zoneProfiles.filter(z => z.dominantEnergy === 'negative').length / zoneProfiles.length) * 100)
  };

  const symbolicCoherence: SymbolicCoherenceMetrics = {
    overallCoherence,
    layerAlignment,
    conflictDensity,
    harmonyIndex,
    energyBalance,
    coherenceByDirection: directionCoherence
  };

  // Critical zones
  const criticalConflictZones = [...new Set(allConflicts.filter(c => c.severity === 'critical').map(c => c.direction))];
  const harmoniousZones = Object.keys(dirGroups).filter(dir => 
    dirGroups[dir].every(z => z.harmonyScore >= 75 && z.conflictCount === 0)
  );

  // Priority remediation
  const priorityRemediation: Array<{
    zone: string;
    direction: string;
    issue: string;
    priority: 'immediate' | 'urgent' | 'high' | 'medium' | 'low';
    action: string;
    expectedImprovement: string;
  }> = [];

  const sortedConflicts = [...allConflicts].sort((a, b) => b.priority - a.priority);
  for (const conflict of sortedConflicts.slice(0, 10)) {
    priorityRemediation.push({
      zone: conflict.zone,
      direction: conflict.direction,
      issue: `${conflict.conflictType}: ${conflict.symbol1} vs ${conflict.symbol2}`,
      priority: conflict.priority >= 9 ? 'immediate' : conflict.priority >= 7 ? 'urgent' : conflict.priority >= 5 ? 'high' : 'medium',
      action: conflict.remedy,
      expectedImprovement: `Resolve ${conflict.severity} conflict, improve harmony by 15-25%`
    });
  }

  // Advanced report
  const symbolicStrengths: string[] = [];
  const symbolicWeaknesses: string[] = [];
  const hiddenConflicts: string[] = [];
  const synergisticZones: string[] = [];

  for (const dir in dirGroups) {
    const zones = dirGroups[dir];
    const avgHarmony = zones.reduce((sum, z) => sum + z.harmonyScore, 0) / zones.length;
    const avgCoherence = zones.reduce((sum, z) => sum + z.symbolicCoherence, 0) / zones.length;

    if (avgHarmony >= 80 && avgCoherence >= 75) {
      symbolicStrengths.push(`${dir}: Excellent symbolic alignment (Harmony ${Math.round(avgHarmony)}/100)`);
      if (zones.every(z => z.conflictCount === 0)) {
        synergisticZones.push(`${dir}: All 6 layers working in perfect synergy`);
      }
    } else if (avgHarmony < 50) {
      symbolicWeaknesses.push(`${dir}: Poor symbolic harmony (${Math.round(avgHarmony)}/100), needs remediation`);
    }

    const dirConflicts = allConflicts.filter(c => c.direction === dir);
    if (dirConflicts.length >= 3) {
      hiddenConflicts.push(`${dir}: ${dirConflicts.length} cross-layer conflicts detected - requires multi-layer healing`);
    }
  }

  const remediationRoadmap: string[] = [
    `Phase 1 (Immediate): Address ${priorityRemediation.filter(r => r.priority === 'immediate').length} critical conflicts in ${criticalConflictZones.join(', ')}`,
    `Phase 2 (Urgent): Resolve ${priorityRemediation.filter(r => r.priority === 'urgent').length} high-priority conflicts`,
    `Phase 3 (Medium-term): Enhance coherence in weak zones (${symbolicWeaknesses.length} identified)`,
    `Phase 4 (Long-term): Amplify strengths in harmonious zones (${harmoniousZones.length} zones)`,
    `Phase 5 (Maintenance): Regular symbolic alignment checks and adjustments`
  ];

  const advancedReport = {
    symbolicStrengths,
    symbolicWeaknesses,
    hiddenConflicts,
    synergisticZones,
    remediationRoadmap
  };

  // Overall recommendations
  const recommendations: string[] = [];

  recommendations.push(
    `Symbolic Coherence: ${overallCoherence}/100 | Layer Alignment: ${layerAlignment}/100 | Harmony Index: ${harmonyIndex}/100`
  );

  if (allConflicts.length > 0) {
    const criticalCount = allConflicts.filter(c => c.severity === 'critical').length;
    recommendations.push(
      `🔴 ${allConflicts.length} cross-layer conflict(s) detected${criticalCount > 0 ? ` (${criticalCount} critical)` : ''}!`
    );
  }

  if (criticalConflictZones.length > 0) {
    recommendations.push(
      `URGENT: Critical symbolic conflicts in ${criticalConflictZones.join(', ')}. Multi-layer remediation required.`
    );
  }

  recommendations.push(
    `Energy Balance: ${energyBalance.positive}% Positive | ${energyBalance.neutral}% Neutral | ${energyBalance.negative}% Negative`
  );

  if (harmoniousZones.length > 0) {
    recommendations.push(
      `✅ Perfect symbolic synergy in ${harmoniousZones.length} direction(s): ${harmoniousZones.join(', ')}`
    );
  }

  if (synergisticZones.length > 0) {
    recommendations.push(
      `Synergistic zones (all 6 layers aligned): ${synergisticZones.length} found`
    );
  }

  recommendations.push(
    `Priority actions: ${priorityRemediation.slice(0, 3).map(r => r.action).join(' | ')}`
  );

  return {
    type: 'devta-chinha-aadi',
    timestamp: new Date(),
    boundaryPoints,
    recommendations,
    data: {
      zoneProfiles,
      crossLayerConflicts: allConflicts,
      symbolicCoherence,
      criticalConflictZones,
      harmoniousZones,
      priorityRemediation,
      advancedReport
    }
  };
}

export { DEVTA_LAYER_MAP, PLANETARY_LAYER_MAP, ELEMENTAL_LAYER_MAP, GEOMETRIC_LAYER_MAP, YANTRIC_LAYER_MAP, ANIMAL_LAYER_MAP };
