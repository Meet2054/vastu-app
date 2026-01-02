/**
 * Devta Chinha Analysis
 * 
 * Symbolic indicators per direction.
 * Analyzes directional symbols, their meanings, and detects conflicts.
 * 
 * Features:
 * - Direction-wise symbol mapping
 * - Symbol meaning and interpretation
 * - Symbol conflict detection
 * - Symbolic remedy suggestions
 * - Auspicious vs inauspicious symbol identification
 * - Placement guidelines for corrective symbols
 */

import { Point, BoundingBox, AnalysisResult } from './types';
import { generate32CircleZones, CircleZone } from './circle-zones';

/**
 * Symbol information
 */
export interface SymbolInfo {
  name: string;
  sanskritName: string;
  category: 'deity' | 'animal' | 'geometric' | 'natural' | 'celestial' | 'yantra' | 'plant';
  meaning: string;
  significance: string;
  energyType: 'positive' | 'neutral' | 'negative';
  conflictsWith: string[];          // Symbols that conflict with this one
  enhancesWith: string[];           // Symbols that enhance this one
  placement: string;                 // Where to place this symbol
  material: string;                  // Recommended material
  color: string;                     // Recommended color
}

/**
 * Directional symbol information
 */
export interface DirectionalSymbolInfo {
  direction: string;
  directionCode: string;
  devta: string;
  primarySymbols: SymbolInfo[];      // Main auspicious symbols
  secondarySymbols: SymbolInfo[];    // Supporting symbols
  prohibitedSymbols: string[];       // Symbols to avoid
  symbolicMeaning: string;           // Overall symbolic meaning
  symbolicQualities: string[];       // Qualities represented
  auspiciousIndicators: string[];    // Signs of positive energy
  inauspiciousIndicators: string[];  // Signs of negative energy
  remedialSymbols: SymbolInfo[];     // Symbols for correction
  symbolPlacementRules: string[];    // Placement guidelines
}

/**
 * Symbol zone analysis
 */
export interface SymbolZoneSector {
  symbolInfo: DirectionalSymbolInfo;
  zones: CircleZone[];
  coverage: number;
  hasConflict: boolean;
  conflictDetails: Array<{
    conflictType: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    remedy: string;
  }>;
  symbolScore: number;               // 0-100, symbolic harmony
  energyBalance: 'positive' | 'balanced' | 'neutral' | 'imbalanced' | 'negative';
  presentSymbols: string[];          // Symbols currently present
  missingSymbols: string[];          // Important symbols missing
  recommendations: string[];
}

/**
 * Devta Chinha analysis result
 */
export interface DevtaChinhaAnalysisResult extends AnalysisResult {
  recommendations: string[];
  data: {
    sectors: SymbolZoneSector[];
    overallSymbolicHarmony: number;  // 0-100
    conflictIndex: number;           // 0-100, lower is better
    energyBalanceIndex: number;      // 0-100, higher is better
    criticalConflicts: Array<{
      direction: string;
      conflictType: string;
      severity: 'critical' | 'high' | 'medium' | 'low';
      remedy: string;
    }>;
    symbolicRemedies: Array<{
      direction: string;
      symbolName: string;
      purpose: string;
      placement: string;
      urgency: 'immediate' | 'soon' | 'moderate' | 'optional';
    }>;
    directionalSymbolMap: {
      strongSymbols: string[];         // Directions with good symbols
      weakSymbols: string[];           // Directions with weak symbols
      conflictedSymbols: string[];     // Directions with conflicts
    };
  };
}

/**
 * Complete directional symbol mappings for 8 directions
 */
const DIRECTIONAL_SYMBOL_MAP: DirectionalSymbolInfo[] = [
  {
    direction: 'North',
    directionCode: 'N',
    devta: 'Kubera',
    primarySymbols: [
      {
        name: 'Kubera Yantra',
        sanskritName: 'कुबेर यन्त्र',
        category: 'yantra',
        meaning: 'Wealth and prosperity yantra',
        significance: 'Attracts wealth, abundance, and financial stability',
        energyType: 'positive',
        conflictsWith: ['Skull', 'Broken items', 'Dark symbols'],
        enhancesWith: ['Gold coins', 'Lakshmi symbol', 'Mercury'],
        placement: 'North wall, facing center',
        material: 'Copper or Gold',
        color: 'Yellow or Gold'
      },
      {
        name: 'Water Feature',
        sanskritName: 'जल तत्व',
        category: 'natural',
        meaning: 'Flowing water element',
        significance: 'Represents continuous flow of wealth',
        energyType: 'positive',
        conflictsWith: ['Fire symbols', 'Dry/barren symbols'],
        enhancesWith: ['Fish symbol', 'Lotus', 'Silver'],
        placement: 'North corner or wall',
        material: 'Water in metal/ceramic',
        color: 'Blue or Silver'
      },
      {
        name: 'Horse Symbol',
        sanskritName: 'अश्व',
        category: 'animal',
        meaning: 'Speed and success in trade',
        significance: 'Brings swift business growth and trade success',
        energyType: 'positive',
        conflictsWith: ['Slow animals', 'Stagnant symbols'],
        enhancesWith: ['Kubera yantra', 'Mercury symbol'],
        placement: 'North wall, running inward',
        material: 'Metal (preferably brass)',
        color: 'White or Silver'
      }
    ],
    secondarySymbols: [
      {
        name: 'Lotus',
        sanskritName: 'कमल',
        category: 'plant',
        meaning: 'Purity and prosperity',
        significance: 'Symbol of growth and spiritual wealth',
        energyType: 'positive',
        conflictsWith: ['Withered plants', 'Thorny symbols'],
        enhancesWith: ['Water feature', 'Lakshmi'],
        placement: 'In water feature or as art',
        material: 'Natural or artistic',
        color: 'Pink or White'
      }
    ],
    prohibitedSymbols: ['Weapons', 'Fire symbols', 'Death symbols', 'Broken items', 'Dark/heavy images'],
    symbolicMeaning: 'Abundance, Wealth, and Prosperity Flow',
    symbolicQualities: ['Richness', 'Abundance', 'Flow', 'Growth', 'Stability'],
    auspiciousIndicators: [
      'Water flowing properly',
      'Wealth symbols clean and bright',
      'Open and well-lit space',
      'Fresh and vibrant energy'
    ],
    inauspiciousIndicators: [
      'Blocked or stagnant water',
      'Broken wealth symbols',
      'Dark and cluttered space',
      'Heavy obstructions'
    ],
    remedialSymbols: [
      {
        name: 'Mercury Bowl',
        sanskritName: 'पारद पात्र',
        category: 'natural',
        meaning: 'Liquid wealth attractor',
        significance: 'Powerful wealth magnet',
        energyType: 'positive',
        conflictsWith: [],
        enhancesWith: ['Kubera yantra', 'Silver'],
        placement: 'North corner in silver bowl',
        material: 'Mercury in Silver',
        color: 'Silver'
      }
    ],
    symbolPlacementRules: [
      'All wealth symbols should face inward (toward center)',
      'Keep area well-lit and clean',
      'Avoid placing heavy furniture blocking symbols',
      'Water features should have clean, flowing water'
    ]
  },
  {
    direction: 'Northeast',
    directionCode: 'NE',
    devta: 'Ishana (Shiva)',
    primarySymbols: [
      {
        name: 'Shiva Linga',
        sanskritName: 'शिवलिङ्ग',
        category: 'deity',
        meaning: 'Divine consciousness and energy',
        significance: 'Represents supreme divine energy and spiritual clarity',
        energyType: 'positive',
        conflictsWith: ['Impure symbols', 'Non-spiritual items'],
        enhancesWith: ['Om symbol', 'Crystal', 'Water'],
        placement: 'Northeast corner, elevated',
        material: 'Stone or Crystal',
        color: 'White or Crystal'
      },
      {
        name: 'Crystal',
        sanskritName: 'स्फटिक',
        category: 'natural',
        meaning: 'Clarity and purity',
        significance: 'Amplifies positive energy and brings clarity',
        energyType: 'positive',
        conflictsWith: ['Dark stones', 'Heavy metals'],
        enhancesWith: ['Shiva linga', 'White flowers'],
        placement: 'Northeast, in sunlight',
        material: 'Natural crystal/quartz',
        color: 'Clear or White'
      },
      {
        name: 'Om Symbol',
        sanskritName: 'ॐ',
        category: 'yantra',
        meaning: 'Primordial sound and consciousness',
        significance: 'Universal divine vibration',
        energyType: 'positive',
        conflictsWith: ['Negative symbols', 'Demonic imagery'],
        enhancesWith: ['Shiva linga', 'Incense'],
        placement: 'Northeast wall, at eye level',
        material: 'Pure materials (gold, silver, crystal)',
        color: 'Gold, White, or Saffron'
      }
    ],
    secondarySymbols: [
      {
        name: 'White Flowers',
        sanskritName: 'श्वेत पुष्प',
        category: 'plant',
        meaning: 'Purity and devotion',
        significance: 'Offerings that please divine energies',
        energyType: 'positive',
        conflictsWith: ['Artificial flowers', 'Wilted flowers'],
        enhancesWith: ['Shiva linga', 'Water'],
        placement: 'Near deity or in water',
        material: 'Fresh natural flowers',
        color: 'White'
      }
    ],
    prohibitedSymbols: ['Toilet', 'Garbage', 'Shoes', 'Kitchen items', 'Impure objects', 'Heavy furniture'],
    symbolicMeaning: 'Divine Grace, Spiritual Enlightenment, and Purity',
    symbolicQualities: ['Divinity', 'Purity', 'Clarity', 'Wisdom', 'Grace'],
    auspiciousIndicators: [
      'Clean and sacred space',
      'Proper worship items',
      'Fresh flowers and incense',
      'Natural light and openness'
    ],
    inauspiciousIndicators: [
      'Impure or dirty conditions',
      'Heavy construction',
      'Negative symbols or imagery',
      'Blocked or dark space'
    ],
    remedialSymbols: [
      {
        name: 'Rudraksha Mala',
        sanskritName: 'रुद्राक्ष माला',
        category: 'plant',
        meaning: 'Divine protection',
        significance: 'Shields from negative energies',
        energyType: 'positive',
        conflictsWith: [],
        enhancesWith: ['Shiva linga', 'Om'],
        placement: 'Hang in Northeast',
        material: 'Natural rudraksha beads',
        color: 'Brown (natural)'
      }
    ],
    symbolPlacementRules: [
      'MUST keep this area completely pure and sacred',
      'Only spiritual symbols allowed',
      'No impure activities or items',
      'Daily cleaning and worship recommended'
    ]
  },
  {
    direction: 'East',
    directionCode: 'E',
    devta: 'Indra (Surya)',
    primarySymbols: [
      {
        name: 'Rising Sun',
        sanskritName: 'उदय सूर्य',
        category: 'celestial',
        meaning: 'New beginnings and vitality',
        significance: 'Represents growth, health, and new opportunities',
        energyType: 'positive',
        conflictsWith: ['Setting sun', 'Dark symbols', 'Nocturnal imagery'],
        enhancesWith: ['Red colors', 'Fire symbols', 'Copper'],
        placement: 'East wall, facing west',
        material: 'Copper or brass',
        color: 'Red, Orange, or Gold'
      },
      {
        name: 'Swastika',
        sanskritName: 'स्वस्तिक',
        category: 'geometric',
        meaning: 'Auspiciousness and prosperity',
        significance: 'Ancient symbol of good fortune and well-being',
        energyType: 'positive',
        conflictsWith: ['Negative symbols', 'Broken lines'],
        enhancesWith: ['Sun symbol', 'Red kumkum'],
        placement: 'East entrance or wall',
        material: 'Red kumkum or paint',
        color: 'Red or Orange'
      },
      {
        name: 'Eagle or Garuda',
        sanskritName: 'गरुड़',
        category: 'animal',
        meaning: 'Strength and vision',
        significance: 'Represents power, clarity, and spiritual elevation',
        energyType: 'positive',
        conflictsWith: ['Weak animals', 'Ground symbols'],
        enhancesWith: ['Sun symbol', 'Vishnu symbol'],
        placement: 'East wall, flying/soaring',
        material: 'Metal or stone',
        color: 'Gold or Bronze'
      }
    ],
    secondarySymbols: [
      {
        name: 'Morning Glory Flowers',
        sanskritName: 'प्रातः पुष्प',
        category: 'plant',
        meaning: 'Fresh beginnings',
        significance: 'Symbolizes daily renewal and freshness',
        energyType: 'positive',
        conflictsWith: ['Night-blooming flowers'],
        enhancesWith: ['Sun symbol', 'Fresh air'],
        placement: 'East windows or balcony',
        material: 'Live plants',
        color: 'Bright colors'
      }
    ],
    prohibitedSymbols: ['Sunset images', 'Dark/nocturnal symbols', 'Weapons', 'Sad imagery', 'Heavy blockages'],
    symbolicMeaning: 'Vitality, Growth, and New Opportunities',
    symbolicQualities: ['Energy', 'Growth', 'Success', 'Health', 'New beginnings'],
    auspiciousIndicators: [
      'Morning sunlight entering freely',
      'Bright and vibrant symbols',
      'Fresh and open atmosphere',
      'Upward/rising imagery'
    ],
    inauspiciousIndicators: [
      'Blocked morning light',
      'Dark or declining symbols',
      'Stagnant or closed feeling',
      'Downward imagery'
    ],
    remedialSymbols: [
      {
        name: 'Copper Sun Disc',
        sanskritName: 'ताम्र सूर्य चक्र',
        category: 'celestial',
        meaning: 'Solar power enhancer',
        significance: 'Amplifies positive solar energy',
        energyType: 'positive',
        conflictsWith: [],
        enhancesWith: ['Rising sun', 'Red colors'],
        placement: 'East wall, center',
        material: 'Pure copper',
        color: 'Copper/Gold'
      }
    ],
    symbolPlacementRules: [
      'All symbols should represent rising, growth, and vitality',
      'Use warm, bright colors',
      'Ensure morning sunlight reaches symbols',
      'Keep area open and unobstructed'
    ]
  },
  {
    direction: 'Southeast',
    directionCode: 'SE',
    devta: 'Agni',
    primarySymbols: [
      {
        name: 'Agni Symbol (Fire)',
        sanskritName: 'अग्नि',
        category: 'natural',
        meaning: 'Transformation and energy',
        significance: 'Represents digestive fire and transformative power',
        energyType: 'positive',
        conflictsWith: ['Water symbols', 'Cold symbols'],
        enhancesWith: ['Red colors', 'Triangle pointing up'],
        placement: 'Southeast corner',
        material: 'Red stone or metal',
        color: 'Red or Orange'
      },
      {
        name: 'Upward Triangle',
        sanskritName: 'उर्ध्व त्रिकोण',
        category: 'geometric',
        meaning: 'Fire element symbol',
        significance: 'Represents rising energy and transformation',
        energyType: 'positive',
        conflictsWith: ['Downward triangle (water)', 'Horizontal lines'],
        enhancesWith: ['Agni symbol', 'Red yantra'],
        placement: 'Southeast wall',
        material: 'Red or orange material',
        color: 'Red or Orange'
      },
      {
        name: 'Kitchen Implements',
        sanskritName: 'रसोई यन्त्र',
        category: 'natural',
        meaning: 'Nourishment and transformation',
        significance: 'Sacred cooking tools for sustenance',
        energyType: 'positive',
        conflictsWith: ['Water storage', 'Cold items'],
        enhancesWith: ['Agni symbol', 'Red colors'],
        placement: 'Southeast kitchen',
        material: 'Stainless steel or iron',
        color: 'Metallic'
      }
    ],
    secondarySymbols: [
      {
        name: 'Red Chili',
        sanskritName: 'लाल मिर्च',
        category: 'plant',
        meaning: 'Protection and energy',
        significance: 'Wards off negative energies',
        energyType: 'positive',
        conflictsWith: [],
        enhancesWith: ['Lemon', 'Agni symbol'],
        placement: 'Southeast entrance',
        material: 'Natural dried chilies',
        color: 'Red'
      }
    ],
    prohibitedSymbols: ['Water containers', 'Cool/cold symbols', 'Downward triangles', 'Blue colors'],
    symbolicMeaning: 'Transformation, Energy, and Digestive Power',
    symbolicQualities: ['Energy', 'Transformation', 'Health', 'Vitality', 'Digestion'],
    auspiciousIndicators: [
      'Clean cooking area',
      'Active fire element',
      'Warm colors and energy',
      'Good kitchen functioning'
    ],
    inauspiciousIndicators: [
      'Water storage in SE',
      'Cold or damp conditions',
      'Malfunctioning appliances',
      'Dark or neglected kitchen'
    ],
    remedialSymbols: [
      {
        name: 'Red Coral',
        sanskritName: 'लाल मूंगा',
        category: 'natural',
        meaning: 'Mars energy enhancer',
        significance: 'Strengthens fire element',
        energyType: 'positive',
        conflictsWith: [],
        enhancesWith: ['Agni symbol', 'Red yantra'],
        placement: 'Southeast corner',
        material: 'Natural red coral',
        color: 'Red'
      }
    ],
    symbolPlacementRules: [
      'Fire-related symbols only',
      'Use warm colors (red, orange, yellow)',
      'No water symbols or storage',
      'Keep area active and warm'
    ]
  },
  {
    direction: 'South',
    directionCode: 'S',
    devta: 'Yama',
    primarySymbols: [
      {
        name: 'Buffalo Symbol',
        sanskritName: 'महिष',
        category: 'animal',
        meaning: 'Strength and endurance',
        significance: 'Represents stability and power',
        energyType: 'neutral',
        conflictsWith: ['Light/airy symbols', 'Upward movement'],
        enhancesWith: ['Heavy structures', 'Dark colors'],
        placement: 'South wall, stationary',
        material: 'Heavy stone or metal',
        color: 'Dark colors'
      },
      {
        name: 'Heavy Geometric Patterns',
        sanskritName: 'गुरु ज्यामिती',
        category: 'geometric',
        meaning: 'Grounding and stability',
        significance: 'Creates downward energy for stability',
        energyType: 'positive',
        conflictsWith: ['Light patterns', 'Upward arrows'],
        enhancesWith: ['Heavy materials', 'Dark colors'],
        placement: 'South walls or floor',
        material: 'Stone or heavy materials',
        color: 'Brown, Black, or Dark Grey'
      },
      {
        name: 'Mountain Symbol',
        sanskritName: 'पर्वत',
        category: 'natural',
        meaning: 'Immovability and protection',
        significance: 'Represents solid foundation and security',
        energyType: 'positive',
        conflictsWith: ['Water symbols', 'Light symbols'],
        enhancesWith: ['Heavy structures', 'Earth colors'],
        placement: 'South wall',
        material: 'Stone or heavy material',
        color: 'Earth tones'
      }
    ],
    secondarySymbols: [
      {
        name: 'Root Vegetables',
        sanskritName: 'मूल शाक',
        category: 'plant',
        meaning: 'Grounding energy',
        significance: 'Connects to earth element',
        energyType: 'positive',
        conflictsWith: ['Light foods', 'Airy symbols'],
        enhancesWith: ['Earth element', 'Brown colors'],
        placement: 'South storage',
        material: 'Natural',
        color: 'Brown/Earth'
      }
    ],
    prohibitedSymbols: ['Water features', 'Light/airy symbols', 'Upward movement', 'Bright colors', 'Main entrance'],
    symbolicMeaning: 'Stability, Longevity, and Grounding',
    symbolicQualities: ['Stability', 'Endurance', 'Protection', 'Longevity', 'Grounding'],
    auspiciousIndicators: [
      'Heavy and stable structures',
      'Grounding symbols present',
      'Dark, stable colors',
      'Sense of protection and security'
    ],
    inauspiciousIndicators: [
      'Light or unstable structures',
      'Bright, moving symbols',
      'Main entrance (energy exits)',
      'Water features'
    ],
    remedialSymbols: [
      {
        name: 'Black Tourmaline',
        sanskritName: 'कृष्ण वज्र',
        category: 'natural',
        meaning: 'Protection and grounding',
        significance: 'Shields from negative energies',
        energyType: 'positive',
        conflictsWith: [],
        enhancesWith: ['Heavy structures', 'Earth element'],
        placement: 'South corners',
        material: 'Natural black tourmaline',
        color: 'Black'
      }
    ],
    symbolPlacementRules: [
      'Use heavy, grounding symbols',
      'Dark, stable colors preferred',
      'No light or upward-moving imagery',
      'Emphasize stability and protection'
    ]
  },
  {
    direction: 'Southwest',
    directionCode: 'SW',
    devta: 'Nirriti (Pitru - Ancestors)',
    primarySymbols: [
      {
        name: 'Ancestor Symbol',
        sanskritName: 'पितृ प्रतीक',
        category: 'deity',
        meaning: 'Ancestral blessings and stability',
        significance: 'Connects to lineage and family strength',
        energyType: 'positive',
        conflictsWith: ['Youthful symbols', 'New/modern items'],
        enhancesWith: ['Heavy structures', 'Traditional items'],
        placement: 'Southwest corner',
        material: 'Traditional materials (wood, stone)',
        color: 'Earth tones'
      },
      {
        name: 'Elephant Symbol',
        sanskritName: 'गज',
        category: 'animal',
        meaning: 'Strength and wisdom',
        significance: 'Represents stable power and memory',
        energyType: 'positive',
        conflictsWith: ['Light animals', 'Flying symbols'],
        enhancesWith: ['Heavy structures', 'Earth element'],
        placement: 'Southwest wall or corner',
        material: 'Stone or heavy metal',
        color: 'Grey or Brown'
      },
      {
        name: 'Square/Cube Symbol',
        sanskritName: 'चतुर्भुज',
        category: 'geometric',
        meaning: 'Foundation and stability',
        significance: 'Represents solid earth element',
        energyType: 'positive',
        conflictsWith: ['Circles', 'Light shapes'],
        enhancesWith: ['Heavy materials', 'Dark colors'],
        placement: 'Southwest foundation',
        material: 'Stone or concrete',
        color: 'Brown or Grey'
      }
    ],
    secondarySymbols: [
      {
        name: 'Oak Tree',
        sanskritName: 'दृढ़ वृक्ष',
        category: 'plant',
        meaning: 'Strength and longevity',
        significance: 'Represents family tree and stability',
        energyType: 'positive',
        conflictsWith: ['Weak plants', 'Flowering plants'],
        enhancesWith: ['Heavy structure', 'Earth'],
        placement: 'Southwest side',
        material: 'Strong wood',
        color: 'Brown'
      }
    ],
    prohibitedSymbols: ['Water features', 'Light/airy symbols', 'Main entrance', 'Bright colors', 'New/modern symbols'],
    symbolicMeaning: 'Ancestral Strength, Foundation, and Stability',
    symbolicQualities: ['Foundation', 'Stability', 'Wisdom', 'Protection', 'Lineage'],
    auspiciousIndicators: [
      'Heaviest structures in property',
      'Ancestral respect and symbols',
      'Stable, grounded feeling',
      'Traditional and enduring items'
    ],
    inauspiciousIndicators: [
      'Light or unstable structures',
      'Disrespect to ancestors',
      'Modern or changing items',
      'Water or open spaces'
    ],
    remedialSymbols: [
      {
        name: 'Hematite Stone',
        sanskritName: 'लौह पाषाण',
        category: 'natural',
        meaning: 'Grounding and protection',
        significance: 'Strongest grounding stone',
        energyType: 'positive',
        conflictsWith: [],
        enhancesWith: ['Ancestor symbols', 'Heavy structure'],
        placement: 'Southwest corners',
        material: 'Natural hematite',
        color: 'Metallic grey/black'
      }
    ],
    symbolPlacementRules: [
      'CRITICAL: Heaviest and most stable symbols',
      'Ancestral and traditional items preferred',
      'No light, airy, or modern symbols',
      'Maximum grounding and stability'
    ]
  },
  {
    direction: 'West',
    directionCode: 'W',
    devta: 'Varuna',
    primarySymbols: [
      {
        name: 'Setting Sun',
        sanskritName: 'अस्त सूर्य',
        category: 'celestial',
        meaning: 'Completion and gains',
        significance: 'Represents fulfillment and profit realization',
        energyType: 'positive',
        conflictsWith: ['Rising sun', 'Beginning symbols'],
        enhancesWith: ['Gold symbols', 'Varuna symbol'],
        placement: 'West wall',
        material: 'Gold or brass',
        color: 'Gold or Orange'
      },
      {
        name: 'Water Pot (Kalasha)',
        sanskritName: 'कलश',
        category: 'natural',
        meaning: 'Abundance and blessings',
        significance: 'Container of prosperity and divine grace',
        energyType: 'positive',
        conflictsWith: ['Empty vessels', 'Broken pots'],
        enhancesWith: ['Varuna symbol', 'Blue colors'],
        placement: 'West side',
        material: 'Copper or brass',
        color: 'Copper'
      },
      {
        name: 'Fish Symbol',
        sanskritName: 'मत्स्य',
        category: 'animal',
        meaning: 'Prosperity and abundance',
        significance: 'Represents continuous flow of gains',
        energyType: 'positive',
        conflictsWith: ['Dry/barren symbols'],
        enhancesWith: ['Water symbols', 'Varuna'],
        placement: 'West wall or feature',
        material: 'Metal or artistic',
        color: 'Silver or Blue'
      }
    ],
    secondarySymbols: [
      {
        name: 'Conch Shell',
        sanskritName: 'शंख',
        category: 'natural',
        meaning: 'Victory and prosperity',
        significance: 'Sacred symbol of Varuna',
        energyType: 'positive',
        conflictsWith: ['Negative sounds'],
        enhancesWith: ['Water element', 'Varuna'],
        placement: 'West side, in worship',
        material: 'Natural conch',
        color: 'White'
      }
    ],
    prohibitedSymbols: ['Fire symbols', 'Loss symbols', 'Expense imagery', 'Broken items'],
    symbolicMeaning: 'Gains, Profits, and Fulfillment',
    symbolicQualities: ['Profit', 'Gains', 'Fulfillment', 'Pleasure', 'Completion'],
    auspiciousIndicators: [
      'Profit and gain symbols present',
      'Clean and prosperous feeling',
      'Well-maintained area',
      'Sense of completion and satisfaction'
    ],
    inauspiciousIndicators: [
      'Loss or expense symbols',
      'Broken or damaged items',
      'Neglected appearance',
      'Feeling of incompleteness'
    ],
    remedialSymbols: [
      {
        name: 'White Pearl',
        sanskritName: 'मोती',
        category: 'natural',
        meaning: 'Moon energy and profits',
        significance: 'Enhances gains and emotional satisfaction',
        energyType: 'positive',
        conflictsWith: [],
        enhancesWith: ['Varuna symbol', 'Water element'],
        placement: 'West side, in silver',
        material: 'Natural pearl',
        color: 'White'
      }
    ],
    symbolPlacementRules: [
      'Use symbols of completion and gain',
      'Maintain cleanliness and prosperity',
      'Colors: white, blue, gold',
      'Avoid symbols of loss or expense'
    ]
  },
  {
    direction: 'Northwest',
    directionCode: 'NW',
    devta: 'Vayu',
    primarySymbols: [
      {
        name: 'Wind Symbol',
        sanskritName: 'वायु',
        category: 'natural',
        meaning: 'Movement and change',
        significance: 'Represents air element and flexibility',
        energyType: 'neutral',
        conflictsWith: ['Heavy symbols', 'Static imagery'],
        enhancesWith: ['Light colors', 'Moving symbols'],
        placement: 'Northwest areas',
        material: 'Light materials',
        color: 'White or Light Grey'
      },
      {
        name: 'Bird Symbol',
        sanskritName: 'पक्षी',
        category: 'animal',
        meaning: 'Freedom and communication',
        significance: 'Represents movement and connections',
        energyType: 'positive',
        conflictsWith: ['Caged birds', 'Heavy animals'],
        enhancesWith: ['Wind symbols', 'Open spaces'],
        placement: 'Northwest, in flight',
        material: 'Light materials',
        color: 'White or Light colors'
      },
      {
        name: 'Flag or Banner',
        sanskritName: 'ध्वज',
        category: 'geometric',
        meaning: 'Movement and victory',
        significance: 'Represents dynamic energy',
        energyType: 'positive',
        conflictsWith: ['Static symbols'],
        enhancesWith: ['Wind element', 'Movement'],
        placement: 'Northwest, outside',
        material: 'Light fabric',
        color: 'White or Multicolor'
      }
    ],
    secondarySymbols: [
      {
        name: 'Wind Chimes',
        sanskritName: 'वात घंटी',
        category: 'natural',
        meaning: 'Air movement and sound',
        significance: 'Creates positive sound vibrations',
        energyType: 'positive',
        conflictsWith: ['Silence symbols'],
        enhancesWith: ['Wind element', 'Open areas'],
        placement: 'Northwest entrance or window',
        material: 'Metal or bamboo',
        color: 'Metallic'
      }
    ],
    prohibitedSymbols: ['Heavy structures', 'Permanent storage', 'Static imagery', 'Dark colors'],
    symbolicMeaning: 'Movement, Change, and Connections',
    symbolicQualities: ['Movement', 'Change', 'Communication', 'Travel', 'Support'],
    auspiciousIndicators: [
      'Good air circulation',
      'Light and airy feeling',
      'Movement and activity',
      'Open and unblocked'
    ],
    inauspiciousIndicators: [
      'Stagnant air',
      'Heavy obstructions',
      'Closed and blocked feeling',
      'Excessive storage'
    ],
    remedialSymbols: [
      {
        name: 'Clear Quartz',
        sanskritName: 'स्फटिक',
        category: 'natural',
        meaning: 'Clarity and amplification',
        significance: 'Enhances communication and movement',
        energyType: 'positive',
        conflictsWith: [],
        enhancesWith: ['Air element', 'Light'],
        placement: 'Northwest window',
        material: 'Natural clear quartz',
        color: 'Clear'
      }
    ],
    symbolPlacementRules: [
      'Use light, moving symbols',
      'Maintain air circulation',
      'Light colors preferred',
      'Avoid permanent or heavy items'
    ]
  }
];

/**
 * Options for Devta Chinha analysis
 */
export interface DevtaChinhaAnalysisOptions {
  northRotation?: number;
  presentSymbols?: { [direction: string]: string[] }; // Symbols currently present
  conflictSensitivity?: 'strict' | 'moderate' | 'lenient';
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
 * Detect symbol conflicts
 */
function detectSymbolConflicts(
  symbolInfo: DirectionalSymbolInfo,
  presentSymbols: string[]
): Array<{ conflictType: string; severity: 'critical' | 'high' | 'medium' | 'low'; description: string; remedy: string }> {
  const conflicts: Array<{ conflictType: string; severity: 'critical' | 'high' | 'medium' | 'low'; description: string; remedy: string }> = [];

  // Check prohibited symbols
  for (const prohibited of symbolInfo.prohibitedSymbols) {
    for (const present of presentSymbols) {
      if (present.toLowerCase().includes(prohibited.toLowerCase())) {
        conflicts.push({
          conflictType: 'Prohibited Symbol Present',
          severity: 'critical',
          description: `${prohibited} found in ${symbolInfo.direction}, which is highly inauspicious`,
          remedy: `URGENT: Remove ${prohibited} from ${symbolInfo.direction} immediately`
        });
      }
    }
  }

  // Check symbol-specific conflicts
  for (const primarySymbol of symbolInfo.primarySymbols) {
    for (const conflictsWith of primarySymbol.conflictsWith) {
      for (const present of presentSymbols) {
        if (present.toLowerCase().includes(conflictsWith.toLowerCase())) {
          conflicts.push({
            conflictType: 'Symbol Conflict',
            severity: 'high',
            description: `${present} conflicts with ${primarySymbol.name} in ${symbolInfo.direction}`,
            remedy: `Remove ${conflictsWith} or add ${primarySymbol.name} for harmony`
          });
        }
      }
    }
  }

  return conflicts;
}

/**
 * Calculate symbol score
 */
function calculateSymbolScore(
  symbolInfo: DirectionalSymbolInfo,
  presentSymbols: string[],
  conflicts: Array<{ severity: string }>
): number {
  let score = 70; // Base score

  // Check for primary symbols
  const primaryPresent = symbolInfo.primarySymbols.filter(ps => 
    presentSymbols.some(p => p.toLowerCase().includes(ps.name.toLowerCase()))
  ).length;
  score += primaryPresent * 10;

  // Deduct for conflicts
  const criticalConflicts = conflicts.filter(c => c.severity === 'critical').length;
  const highConflicts = conflicts.filter(c => c.severity === 'high').length;
  score -= criticalConflicts * 30;
  score -= highConflicts * 15;

  // Check for missing critical symbols
  if (['NE', 'N'].includes(symbolInfo.directionCode) && primaryPresent === 0) {
    score -= 20;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Determine energy balance
 */
function determineEnergyBalance(symbolScore: number, conflicts: number): 'positive' | 'balanced' | 'neutral' | 'imbalanced' | 'negative' {
  if (conflicts > 2) return 'negative';
  if (conflicts > 0) return 'imbalanced';
  if (symbolScore >= 80) return 'positive';
  if (symbolScore >= 60) return 'balanced';
  return 'neutral';
}

/**
 * Identify missing important symbols
 */
function identifyMissingSymbols(
  symbolInfo: DirectionalSymbolInfo,
  presentSymbols: string[]
): string[] {
  const missing: string[] = [];
  
  for (const primary of symbolInfo.primarySymbols) {
    const isPresent = presentSymbols.some(p => 
      p.toLowerCase().includes(primary.name.toLowerCase())
    );
    if (!isPresent && ['NE', 'N', 'SE'].includes(symbolInfo.directionCode)) {
      missing.push(primary.name);
    }
  }

  return missing;
}

/**
 * Generate sector recommendations
 */
function generateSymbolRecommendations(sector: SymbolZoneSector): string[] {
  const recs: string[] = [];
  const { symbolInfo, hasConflict, conflictDetails, symbolScore, energyBalance, missingSymbols } = sector;

  if (hasConflict) {
    recs.push(`⚠️ ${conflictDetails.length} symbol conflict(s) detected in ${symbolInfo.direction}!`);
    for (const conflict of conflictDetails.slice(0, 2)) {
      recs.push(`- ${conflict.conflictType}: ${conflict.remedy}`);
    }
  }

  if (energyBalance === 'negative' || energyBalance === 'imbalanced') {
    recs.push(`Energy in ${symbolInfo.direction} is ${energyBalance}. Corrective symbols needed.`);
  }

  if (missingSymbols.length > 0) {
    recs.push(`Missing important symbols in ${symbolInfo.direction}: ${missingSymbols.slice(0, 2).join(', ')}`);
  }

  if (symbolScore < 50) {
    recs.push(`Low symbolic harmony (${symbolScore}/100) in ${symbolInfo.direction}. Add ${symbolInfo.primarySymbols[0].name}.`);
  }

  recs.push(`Recommended symbol: ${symbolInfo.remedialSymbols[0]?.name || symbolInfo.primarySymbols[0].name} (${symbolInfo.remedialSymbols[0]?.placement || symbolInfo.primarySymbols[0].placement})`);

  return recs;
}

/**
 * Generate Devta Chinha analysis
 */
export function generateDevtaChinha(
  boundaryPoints: Point[],
  options: DevtaChinhaAnalysisOptions = {}
): DevtaChinhaAnalysisResult {
  const {
    northRotation = 0,
    presentSymbols = {},
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
  const sectors: SymbolZoneSector[] = [];
  let totalSymbolScore = 0;
  let totalConflicts = 0;
  let totalEnergyBalance = 0;

  const criticalConflicts: Array<{
    direction: string;
    conflictType: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    remedy: string;
  }> = [];

  const symbolicRemedies: Array<{
    direction: string;
    symbolName: string;
    purpose: string;
    placement: string;
    urgency: 'immediate' | 'soon' | 'moderate' | 'optional';
  }> = [];

  for (const symbolInfo of DIRECTIONAL_SYMBOL_MAP) {
    const zones = directionZones[symbolInfo.directionCode] || [];
    const coverage = calculateZoneCoverage(zones, boundaryPoints, center, radius);
    
    const dirPresentSymbols = presentSymbols[symbolInfo.directionCode] || [];
    const conflictDetails = detectSymbolConflicts(symbolInfo, dirPresentSymbols);
    const hasConflict = conflictDetails.length > 0;
    const symbolScore = calculateSymbolScore(symbolInfo, dirPresentSymbols, conflictDetails);
    const energyBalance = determineEnergyBalance(symbolScore, conflictDetails.length);
    const missingSymbols = identifyMissingSymbols(symbolInfo, dirPresentSymbols);

    const sector: SymbolZoneSector = {
      symbolInfo,
      zones,
      coverage,
      hasConflict,
      conflictDetails,
      symbolScore,
      energyBalance,
      presentSymbols: dirPresentSymbols,
      missingSymbols,
      recommendations: []
    };

    sector.recommendations = generateSymbolRecommendations(sector);
    sectors.push(sector);

    totalSymbolScore += symbolScore;
    totalConflicts += conflictDetails.length;
    totalEnergyBalance += energyBalance === 'positive' ? 100 : energyBalance === 'balanced' ? 75 : energyBalance === 'neutral' ? 50 : energyBalance === 'imbalanced' ? 25 : 0;

    // Collect critical conflicts
    for (const conflict of conflictDetails.filter(c => c.severity === 'critical' || c.severity === 'high')) {
      criticalConflicts.push({
        direction: symbolInfo.direction,
        conflictType: conflict.conflictType,
        severity: conflict.severity,
        remedy: conflict.remedy
      });
    }

    // Generate symbolic remedies
    if (symbolScore < 70 || hasConflict) {
      const remedialSymbol = symbolInfo.remedialSymbols[0] || symbolInfo.primarySymbols[0];
      symbolicRemedies.push({
        direction: symbolInfo.direction,
        symbolName: remedialSymbol.name,
        purpose: remedialSymbol.significance,
        placement: remedialSymbol.placement,
        urgency: hasConflict ? 'immediate' : symbolScore < 50 ? 'soon' : 'moderate'
      });
    }
  }

  const overallSymbolicHarmony = Math.round(totalSymbolScore / sectors.length);
  const conflictIndex = Math.min(100, totalConflicts * 10);
  const energyBalanceIndex = Math.round(totalEnergyBalance / sectors.length);

  // Directional symbol map
  const directionalSymbolMap = {
    strongSymbols: sectors.filter(s => s.symbolScore >= 75).map(s => s.symbolInfo.direction),
    weakSymbols: sectors.filter(s => s.symbolScore < 50).map(s => s.symbolInfo.direction),
    conflictedSymbols: sectors.filter(s => s.hasConflict).map(s => s.symbolInfo.direction)
  };

  // Overall recommendations
  const recommendations: string[] = [];

  recommendations.push(
    `Symbolic Harmony: ${overallSymbolicHarmony}/100 | Conflict Index: ${conflictIndex}/100 | Energy Balance: ${energyBalanceIndex}/100`
  );

  if (criticalConflicts.length > 0) {
    recommendations.push(
      `🔴 ${criticalConflicts.length} critical symbol conflict(s) detected! Immediate remediation required.`
    );
  }

  if (directionalSymbolMap.conflictedSymbols.length > 0) {
    recommendations.push(
      `Symbol conflicts in: ${directionalSymbolMap.conflictedSymbols.join(', ')}. Remove prohibited symbols.`
    );
  }

  if (directionalSymbolMap.weakSymbols.length > 0) {
    recommendations.push(
      `Weak symbolic energy in: ${directionalSymbolMap.weakSymbols.join(', ')}. Add recommended symbols.`
    );
  }

  recommendations.push(
    `Priority remedies: ${symbolicRemedies.filter(r => r.urgency === 'immediate').length} immediate, ${symbolicRemedies.filter(r => r.urgency === 'soon').length} soon.`
  );

  if (overallSymbolicHarmony >= 75) {
    recommendations.push('Good overall symbolic harmony. Minor improvements recommended.');
  } else if (overallSymbolicHarmony < 50) {
    recommendations.push('Low symbolic harmony. Comprehensive symbol placement program needed.');
  }

  return {
    type: 'devta-chinha',
    timestamp: new Date(),
    boundaryPoints,
    recommendations,
    data: {
      sectors,
      overallSymbolicHarmony,
      conflictIndex,
      energyBalanceIndex,
      criticalConflicts,
      symbolicRemedies,
      directionalSymbolMap
    }
  };
}

export { DIRECTIONAL_SYMBOL_MAP };
