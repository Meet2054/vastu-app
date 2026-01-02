/**
 * Khanij + Dhatu Analysis
 * 
 * Mineral-Metal harmony for construction.
 * Analyzes directional metal/mineral compatibility and structural strength.
 * 
 * Features:
 * - Direction-wise metal and mineral recommendations
 * - Construction material compatibility analysis
 * - Structural strength indicators
 * - Metal-direction harmony scoring
 * - Material combination compatibility
 * - Remedial material suggestions
 */

import { Point, BoundingBox, AnalysisResult } from './types';
import { generate32CircleZones, CircleZone } from './circle-zones';

/**
 * Metal/Mineral information
 */
export interface MetalMineralInfo {
  name: string;
  sanskritName: string;
  category: 'metal' | 'mineral' | 'stone' | 'earth' | 'alloy';
  elementAssociation: 'earth' | 'water' | 'fire' | 'air' | 'ether';
  properties: string[];
  structuralStrength: number;      // 0-100
  energyQuality: 'heating' | 'cooling' | 'neutral' | 'balancing';
  compatibleWith: string[];
  incompatibleWith: string[];
  idealUsage: string[];
  prohibitedUsage: string[];
}

/**
 * Directional metal/mineral information
 */
export interface DirectionalMetalInfo {
  direction: string;
  directionCode: string;
  devta: string;
  primaryMetals: MetalMineralInfo[];
  primaryMinerals: MetalMineralInfo[];
  supportingMaterials: MetalMineralInfo[];
  prohibitedMaterials: string[];
  structuralRequirement: 'heavy' | 'moderate' | 'light' | 'very-light';
  strengthPriority: number;          // 0-100, higher = more strength needed
  idealConstructionMaterials: string[];
  constructionGuidelines: string[];
  elementalBalance: string;
  materialHarmonyRules: string[];
}

/**
 * Material zone analysis
 */
export interface MaterialZoneSector {
  metalInfo: DirectionalMetalInfo;
  zones: CircleZone[];
  coverage: number;
  presentMaterials: string[];
  materialScore: number;             // 0-100, material harmony
  structuralScore: number;           // 0-100, structural adequacy
  compatibilityScore: number;        // 0-100, material compatibility
  strengthLevel: 'excellent' | 'good' | 'adequate' | 'weak' | 'critical';
  materialConflicts: Array<{
    material1: string;
    material2: string;
    conflictType: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    impact: string;
  }>;
  structuralIndicators: {
    foundationStrength: number;
    wallStrength: number;
    roofStrength: number;
    overallIntegrity: number;
  };
  recommendations: string[];
}

/**
 * Khanij + Dhatu analysis result
 */
export interface KhanijDhatuAnalysisResult extends AnalysisResult {
  recommendations: string[];
  data: {
    sectors: MaterialZoneSector[];
    overallMaterialHarmony: number;  // 0-100
    structuralIntegrity: number;     // 0-100
    compatibilityIndex: number;      // 0-100
    strengthDistribution: {
      strongZones: string[];         // Zones with good strength
      adequateZones: string[];       // Zones with adequate strength
      weakZones: string[];           // Zones needing strengthening
      criticalZones: string[];       // Zones with critical weakness
    };
    materialRecommendations: Array<{
      direction: string;
      materialType: string;
      usage: string;
      priority: 'critical' | 'high' | 'medium' | 'low';
      expectedStrength: string;
    }>;
    constructionGuidance: {
      foundationMaterials: string[];
      wallMaterials: string[];
      roofMaterials: string[];
      metalwork: string[];
      flooringMaterials: string[];
    };
  };
}

/**
 * Complete directional metal-mineral mappings for 8 directions
 */
const DIRECTIONAL_METAL_MINERAL_MAP: DirectionalMetalInfo[] = [
  {
    direction: 'North',
    directionCode: 'N',
    devta: 'Kubera',
    primaryMetals: [
      {
        name: 'Mercury',
        sanskritName: 'पारद',
        category: 'metal',
        elementAssociation: 'water',
        properties: ['Liquid wealth attractor', 'High density', 'Prosperity enhancer', 'Cooling'],
        structuralStrength: 30,
        energyQuality: 'cooling',
        compatibleWith: ['Silver', 'Copper', 'Gold'],
        incompatibleWith: ['Iron', 'Lead', 'Heavy materials'],
        idealUsage: ['Wealth vessels', 'Small installations', 'Ritual items'],
        prohibitedUsage: ['Structural support', 'Heavy construction', 'Load-bearing']
      },
      {
        name: 'Silver',
        sanskritName: 'रजत/चांदी',
        category: 'metal',
        elementAssociation: 'water',
        properties: ['Prosperity', 'Cooling', 'Antibacterial', 'Moon energy'],
        structuralStrength: 45,
        energyQuality: 'cooling',
        compatibleWith: ['Copper', 'Gold', 'White stones'],
        incompatibleWith: ['Iron', 'Dark stones'],
        idealUsage: ['Decorative', 'Water vessels', 'Ritual items', 'Door fittings'],
        prohibitedUsage: ['Heavy structural', 'Foundations']
      }
    ],
    primaryMinerals: [
      {
        name: 'White Marble',
        sanskritName: 'श्वेत संगमरमर',
        category: 'stone',
        elementAssociation: 'earth',
        properties: ['Purity', 'Coolness', 'Prosperity', 'Reflective'],
        structuralStrength: 70,
        energyQuality: 'cooling',
        compatibleWith: ['Light materials', 'Silver', 'White cement'],
        incompatibleWith: ['Dark stones', 'Heavy metals'],
        idealUsage: ['Flooring', 'Walls', 'Decorative', 'Light structures'],
        prohibitedUsage: ['Heavy load areas', 'Foundations']
      },
      {
        name: 'Crystal/Quartz',
        sanskritName: 'स्फटिक',
        category: 'mineral',
        elementAssociation: 'ether',
        properties: ['Clarity', 'Energy amplification', 'Purity', 'Light'],
        structuralStrength: 60,
        energyQuality: 'balancing',
        compatibleWith: ['Silver', 'Glass', 'Light materials'],
        incompatibleWith: ['Dark materials', 'Iron'],
        idealUsage: ['Decorative', 'Small features', 'Energy points'],
        prohibitedUsage: ['Structural', 'Foundations']
      }
    ],
    supportingMaterials: [
      {
        name: 'Light Concrete',
        sanskritName: 'लघु कंक्रीट',
        category: 'earth',
        elementAssociation: 'earth',
        properties: ['Moderate strength', 'Lightness', 'Versatile'],
        structuralStrength: 65,
        energyQuality: 'neutral',
        compatibleWith: ['Steel reinforcement', 'Light materials'],
        incompatibleWith: ['Heavy loads alone'],
        idealUsage: ['Walls', 'Partitions', 'Light structures'],
        prohibitedUsage: ['Main foundations alone']
      }
    ],
    prohibitedMaterials: ['Heavy iron', 'Dark stones', 'Lead', 'Coal', 'Black materials'],
    structuralRequirement: 'light',
    strengthPriority: 40,
    idealConstructionMaterials: ['White marble', 'Light concrete', 'Aluminum', 'Glass', 'White tiles', 'Light bricks'],
    constructionGuidelines: [
      'Keep structures light and minimal',
      'Use white or light-colored materials',
      'Avoid heavy metals and dark stones',
      'Maximum openness with minimal walls',
      'Light roofing materials',
      'Aluminum or light steel for frames'
    ],
    elementalBalance: 'Water element dominant - cooling and flowing materials',
    materialHarmonyRules: [
      'Light materials attract wealth flow',
      'White/light colors enhance prosperity',
      'Heavy materials block wealth entry',
      'Avoid construction that feels oppressive'
    ]
  },
  {
    direction: 'Northeast',
    directionCode: 'NE',
    devta: 'Ishana (Shiva)',
    primaryMetals: [
      {
        name: 'Gold',
        sanskritName: 'सुवर्ण/सोना',
        category: 'metal',
        elementAssociation: 'ether',
        properties: ['Divine', 'Pure', 'Non-reactive', 'Spiritually elevating'],
        structuralStrength: 35,
        energyQuality: 'balancing',
        compatibleWith: ['Silver', 'Copper', 'Crystal'],
        incompatibleWith: ['Iron', 'Lead', 'Base metals'],
        idealUsage: ['Ritual items', 'Decorative', 'Small features', 'Kalasha top'],
        prohibitedUsage: ['Structural', 'Heavy construction']
      },
      {
        name: 'Copper',
        sanskritName: 'ताम्र',
        category: 'metal',
        elementAssociation: 'fire',
        properties: ['Conductive', 'Antibacterial', 'Spiritual', 'Warm energy'],
        structuralStrength: 55,
        energyQuality: 'heating',
        compatibleWith: ['Gold', 'Silver', 'Brass', 'Natural stones'],
        incompatibleWith: ['Aluminum in direct contact', 'Iron'],
        idealUsage: ['Water vessels', 'Ritual items', 'Piping', 'Small features'],
        prohibitedUsage: ['Heavy structural', 'Large frameworks']
      }
    ],
    primaryMinerals: [
      {
        name: 'Crystal/Clear Quartz',
        sanskritName: 'स्फटिक',
        category: 'mineral',
        elementAssociation: 'ether',
        properties: ['Highest purity', 'Divine energy', 'Clarity', 'Spiritual'],
        structuralStrength: 60,
        energyQuality: 'balancing',
        compatibleWith: ['Gold', 'Silver', 'White materials'],
        incompatibleWith: ['Dark stones', 'Heavy metals'],
        idealUsage: ['Shiva linga', 'Decorative', 'Energy features'],
        prohibitedUsage: ['Any construction', 'Structural use']
      },
      {
        name: 'White Granite',
        sanskritName: 'श्वेत ग्रेनाइट',
        category: 'stone',
        elementAssociation: 'earth',
        properties: ['Pure', 'Strong', 'Divine', 'Durable'],
        structuralStrength: 85,
        energyQuality: 'cooling',
        compatibleWith: ['Light materials', 'Crystal', 'White cement'],
        incompatibleWith: ['Dark stones', 'Heavy construction'],
        idealUsage: ['Platform', 'Minimal flooring if needed'],
        prohibitedUsage: ['Heavy walls', 'Large structures', 'Blockages']
      }
    ],
    supportingMaterials: [],
    prohibitedMaterials: ['ANY heavy construction', 'Iron', 'Steel beams', 'Dark stones', 'Concrete blocks', 'Brick walls'],
    structuralRequirement: 'very-light',
    strengthPriority: 10,
    idealConstructionMaterials: ['NOTHING - keep completely open', 'Only if unavoidable: crystal, white marble, light glass'],
    constructionGuidelines: [
      'CRITICAL: Absolutely minimal or NO construction',
      'Must be lightest and most open area',
      'If any structure: only crystal, white marble, or pure materials',
      'Elevated and open space mandatory',
      'No walls, no heavy materials whatsoever',
      'Natural light must enter freely'
    ],
    elementalBalance: 'Ether element - maximum openness and purity',
    materialHarmonyRules: [
      'ANY construction here is potentially harmful',
      'If unavoidable, use purest materials only',
      'Absolutely no iron, steel, or heavy metals',
      'No dark or impure materials',
      'Keep elevated and light'
    ]
  },
  {
    direction: 'East',
    directionCode: 'E',
    devta: 'Indra (Surya)',
    primaryMetals: [
      {
        name: 'Copper',
        sanskritName: 'ताम्र',
        category: 'metal',
        elementAssociation: 'fire',
        properties: ['Solar energy conductor', 'Warm', 'Activating', 'Antibacterial'],
        structuralStrength: 55,
        energyQuality: 'heating',
        compatibleWith: ['Brass', 'Bronze', 'Red stones'],
        incompatibleWith: ['Silver in direct contact', 'Aluminum'],
        idealUsage: ['Doors', 'Windows', 'Decorative', 'Sun discs', 'Electrical'],
        prohibitedUsage: ['Water storage', 'Cool areas']
      },
      {
        name: 'Bronze',
        sanskritName: 'कांस्य',
        category: 'alloy',
        elementAssociation: 'fire',
        properties: ['Strong', 'Durable', 'Solar resonance', 'Warm energy'],
        structuralStrength: 70,
        energyQuality: 'heating',
        compatibleWith: ['Copper', 'Brass', 'Red materials'],
        incompatibleWith: ['Cool metals', 'Dark stones'],
        idealUsage: ['Doors', 'Frames', 'Decorative features', 'Bells'],
        prohibitedUsage: ['Water contact areas']
      }
    ],
    primaryMinerals: [
      {
        name: 'Red Granite',
        sanskritName: 'लाल ग्रेनाइट',
        category: 'stone',
        elementAssociation: 'fire',
        properties: ['Vibrant', 'Strong', 'Solar energy', 'Durable'],
        structuralStrength: 90,
        energyQuality: 'heating',
        compatibleWith: ['Copper', 'Red cement', 'Warm materials'],
        incompatibleWith: ['Cool materials', 'Dark stones'],
        idealUsage: ['Flooring', 'Walls', 'Features', 'Columns'],
        prohibitedUsage: ['Water storage areas']
      },
      {
        name: 'Terracotta',
        sanskritName: 'पकाई मिट्टी',
        category: 'earth',
        elementAssociation: 'earth',
        properties: ['Natural', 'Warm', 'Breathable', 'Traditional'],
        structuralStrength: 60,
        energyQuality: 'heating',
        compatibleWith: ['Natural materials', 'Wood', 'Earth materials'],
        incompatibleWith: ['Synthetic materials'],
        idealUsage: ['Tiles', 'Decorative', 'Jalis', 'Features'],
        prohibitedUsage: ['Load-bearing structural']
      }
    ],
    supportingMaterials: [
      {
        name: 'Light Steel',
        sanskritName: 'लघु इस्पात',
        category: 'metal',
        elementAssociation: 'fire',
        properties: ['Strong', 'Modern', 'Versatile'],
        structuralStrength: 85,
        energyQuality: 'neutral',
        compatibleWith: ['Concrete', 'Most materials'],
        incompatibleWith: [],
        idealUsage: ['Frames', 'Support beams', 'Reinforcement'],
        prohibitedUsage: []
      }
    ],
    prohibitedMaterials: ['Heavy blockages', 'Dark stones', 'Cold metals', 'Stagnant materials'],
    structuralRequirement: 'light',
    strengthPriority: 50,
    idealConstructionMaterials: ['Red granite', 'Copper doors', 'Light steel frames', 'Terracotta', 'Red bricks', 'Glass'],
    constructionGuidelines: [
      'Keep relatively light and open',
      'Use warm colors and materials',
      'Copper and brass for fittings',
      'Ensure morning sunlight entry',
      'Red or orange tones preferred',
      'Light structural elements'
    ],
    elementalBalance: 'Fire element - warm and activating materials',
    materialHarmonyRules: [
      'Warm metals enhance solar energy',
      'Red/orange materials support growth',
      'Avoid heavy blockages',
      'Maintain openness and light'
    ]
  },
  {
    direction: 'Southeast',
    directionCode: 'SE',
    devta: 'Agni',
    primaryMetals: [
      {
        name: 'Iron',
        sanskritName: 'लोहा',
        category: 'metal',
        elementAssociation: 'fire',
        properties: ['Strong', 'Heat-resistant', 'Magnetic', 'Mars energy'],
        structuralStrength: 90,
        energyQuality: 'heating',
        compatibleWith: ['Steel', 'Red stones', 'Fire-resistant materials'],
        incompatibleWith: ['Copper in direct contact', 'Water-holding vessels'],
        idealUsage: ['Kitchen equipment', 'Stoves', 'Structural', 'Heat applications'],
        prohibitedUsage: ['Water storage', 'Northeast', 'Wealth areas']
      },
      {
        name: 'Steel/Stainless Steel',
        sanskritName: 'इस्पात',
        category: 'alloy',
        elementAssociation: 'fire',
        properties: ['Very strong', 'Durable', 'Heat-resistant', 'Modern'],
        structuralStrength: 95,
        energyQuality: 'neutral',
        compatibleWith: ['Iron', 'Most materials', 'Fire applications'],
        incompatibleWith: [],
        idealUsage: ['Kitchen', 'Structural', 'Appliances', 'All fire-related'],
        prohibitedUsage: ['Northeast area']
      }
    ],
    primaryMinerals: [
      {
        name: 'Red Brick',
        sanskritName: 'लाल ईंट',
        category: 'earth',
        elementAssociation: 'fire',
        properties: ['Fire-resistant', 'Traditional', 'Strong', 'Insulating'],
        structuralStrength: 75,
        energyQuality: 'heating',
        compatibleWith: ['Red cement', 'Natural materials', 'Iron'],
        incompatibleWith: ['Cool materials'],
        idealUsage: ['Kitchen walls', 'Chimney', 'Fire areas', 'Ovens'],
        prohibitedUsage: ['Water areas', 'Northeast']
      },
      {
        name: 'Red Oxide',
        sanskritName: 'लाल आक्साइड',
        category: 'mineral',
        elementAssociation: 'fire',
        properties: ['Iron-based', 'Heat-friendly', 'Protective', 'Traditional'],
        structuralStrength: 65,
        energyQuality: 'heating',
        compatibleWith: ['Iron', 'Red materials', 'Concrete'],
        incompatibleWith: ['Water-prone areas'],
        idealUsage: ['Flooring', 'Kitchen floors', 'Fire areas'],
        prohibitedUsage: ['Bathroom', 'Northeast']
      }
    ],
    supportingMaterials: [
      {
        name: 'Reinforced Concrete',
        sanskritName: 'प्रबलित कंक्रीट',
        category: 'earth',
        elementAssociation: 'earth',
        properties: ['Very strong', 'Fire-resistant', 'Durable'],
        structuralStrength: 90,
        energyQuality: 'neutral',
        compatibleWith: ['Steel', 'Iron', 'Most materials'],
        incompatibleWith: [],
        idealUsage: ['Foundations', 'Walls', 'Slabs', 'Structural'],
        prohibitedUsage: []
      }
    ],
    prohibitedMaterials: ['Aluminum (melts)', 'Plastic', 'Wood (fire risk)', 'Cool metals'],
    structuralRequirement: 'moderate',
    strengthPriority: 70,
    idealConstructionMaterials: ['Stainless steel', 'Red brick', 'Fire-resistant tiles', 'Concrete', 'Iron', 'Red oxide flooring'],
    constructionGuidelines: [
      'Use fire-resistant materials',
      'Iron and steel acceptable and beneficial',
      'Red and warm materials preferred',
      'Kitchen placement ideal',
      'Strong and heat-resistant construction',
      'Proper ventilation for heat'
    ],
    elementalBalance: 'Fire element dominant - heat-resistant and strong materials',
    materialHarmonyRules: [
      'Iron and steel enhance Agni energy',
      'Red materials support transformation',
      'Fire-resistant materials mandatory',
      'Strong construction prevents fire risks'
    ]
  },
  {
    direction: 'South',
    directionCode: 'S',
    devta: 'Yama',
    primaryMetals: [
      {
        name: 'Lead',
        sanskritName: 'सीसा',
        category: 'metal',
        elementAssociation: 'earth',
        properties: ['Very heavy', 'Dense', 'Grounding', 'Stable'],
        structuralStrength: 70,
        energyQuality: 'cooling',
        compatibleWith: ['Heavy materials', 'Dark stones', 'Iron'],
        incompatibleWith: ['Light materials', 'Northeast', 'Food contact'],
        idealUsage: ['Stability anchors', 'Roofing weights', 'Grounding'],
        prohibitedUsage: ['Food contact', 'Water storage', 'Northeast', 'Living areas']
      },
      {
        name: 'Iron',
        sanskritName: 'लोहा',
        category: 'metal',
        elementAssociation: 'fire',
        properties: ['Strong', 'Heavy', 'Durable', 'Protective'],
        structuralStrength: 90,
        energyQuality: 'heating',
        compatibleWith: ['Steel', 'Concrete', 'Heavy stones'],
        incompatibleWith: ['Copper', 'Northeast'],
        idealUsage: ['Main beams', 'Heavy structures', 'Protection', 'Gates'],
        prohibitedUsage: ['Northeast', 'North']
      }
    ],
    primaryMinerals: [
      {
        name: 'Black Granite',
        sanskritName: 'काला ग्रेनाइट',
        category: 'stone',
        elementAssociation: 'earth',
        properties: ['Very heavy', 'Dense', 'Strong', 'Grounding'],
        structuralStrength: 95,
        energyQuality: 'cooling',
        compatibleWith: ['Heavy materials', 'Dark cement', 'Iron'],
        incompatibleWith: ['Light materials', 'Northeast'],
        idealUsage: ['Flooring', 'Heavy walls', 'Foundations', 'Load-bearing'],
        prohibitedUsage: ['Northeast', 'North']
      },
      {
        name: 'Basalt',
        sanskritName: 'बसाल्ट पाषाण',
        category: 'stone',
        elementAssociation: 'earth',
        properties: ['Very heavy', 'Dense', 'Volcanic', 'Stable'],
        structuralStrength: 92,
        energyQuality: 'neutral',
        compatibleWith: ['Heavy construction', 'Iron', 'Concrete'],
        incompatibleWith: ['Light areas'],
        idealUsage: ['Foundations', 'Heavy walls', 'Load-bearing'],
        prohibitedUsage: ['Northeast', 'Upper floors']
      }
    ],
    supportingMaterials: [
      {
        name: 'Heavy Concrete',
        sanskritName: 'भारी कंक्रीट',
        category: 'earth',
        elementAssociation: 'earth',
        properties: ['Very strong', 'Dense', 'Load-bearing'],
        structuralStrength: 95,
        energyQuality: 'neutral',
        compatibleWith: ['Heavy steel', 'Stone', 'All heavy materials'],
        incompatibleWith: [],
        idealUsage: ['Foundations', 'Main walls', 'Load-bearing', 'Slabs'],
        prohibitedUsage: ['Northeast']
      }
    ],
    prohibitedMaterials: ['Light materials', 'Aluminum', 'Light wood', 'Glass', 'Bright materials'],
    structuralRequirement: 'heavy',
    strengthPriority: 95,
    idealConstructionMaterials: ['Black granite', 'Heavy concrete', 'Iron beams', 'Basalt', 'Dark stone', 'Thick walls'],
    constructionGuidelines: [
      'CRITICAL: Must be heaviest area of property',
      'Use densest and strongest materials',
      'Maximum height and weight here',
      'Dark and grounding materials',
      'Heavy foundations mandatory',
      'Multiple stories ideal'
    ],
    elementalBalance: 'Earth element - maximum grounding and heaviness',
    materialHarmonyRules: [
      'Heaviest materials create stability',
      'Dark colors ground energy',
      'Strong materials ensure longevity',
      'Maximum structural strength required'
    ]
  },
  {
    direction: 'Southwest',
    directionCode: 'SW',
    devta: 'Nirriti (Pitru)',
    primaryMetals: [
      {
        name: 'Iron',
        sanskritName: 'लोहा',
        category: 'metal',
        elementAssociation: 'fire',
        properties: ['Very strong', 'Heavy', 'Durable', 'Protective'],
        structuralStrength: 90,
        energyQuality: 'heating',
        compatibleWith: ['Steel', 'Heavy stones', 'Concrete'],
        incompatibleWith: ['Light metals', 'Northeast'],
        idealUsage: ['Main structure', 'Beams', 'Foundation anchors', 'Heavy gates'],
        prohibitedUsage: ['Northeast', 'North']
      },
      {
        name: 'Heavy Steel',
        sanskritName: 'भारी इस्पात',
        category: 'alloy',
        elementAssociation: 'fire',
        properties: ['Strongest metal', 'Load-bearing', 'Durable'],
        structuralStrength: 98,
        energyQuality: 'neutral',
        compatibleWith: ['Concrete', 'Iron', 'Heavy stones'],
        incompatibleWith: [],
        idealUsage: ['Main beams', 'Columns', 'Foundation', 'Load-bearing'],
        prohibitedUsage: ['Northeast']
      }
    ],
    primaryMinerals: [
      {
        name: 'Granite (Dark)',
        sanskritName: 'गहरा ग्रेनाइट',
        category: 'stone',
        elementAssociation: 'earth',
        properties: ['Extremely hard', 'Dense', 'Ancestral energy', 'Stable'],
        structuralStrength: 96,
        energyQuality: 'cooling',
        compatibleWith: ['All heavy materials', 'Iron', 'Dark cement'],
        incompatibleWith: ['Light materials'],
        idealUsage: ['All structural uses', 'Foundations', 'Walls', 'Flooring'],
        prohibitedUsage: ['Northeast', 'Light areas']
      },
      {
        name: 'Sandstone (Brown/Grey)',
        sanskritName: 'भूरा बलुआ पत्थर',
        category: 'stone',
        elementAssociation: 'earth',
        properties: ['Strong', 'Traditional', 'Heavy', 'Stable'],
        structuralStrength: 85,
        energyQuality: 'neutral',
        compatibleWith: ['Heavy materials', 'Traditional construction'],
        incompatibleWith: ['Modern light materials'],
        idealUsage: ['Walls', 'Features', 'Cladding', 'Foundation'],
        prohibitedUsage: ['Northeast']
      }
    ],
    supportingMaterials: [
      {
        name: 'Reinforced Concrete (Extra Heavy)',
        sanskritName: 'अति भारी प्रबलित कंक्रीट',
        category: 'earth',
        elementAssociation: 'earth',
        properties: ['Maximum strength', 'Very dense', 'Ultimate load-bearing'],
        structuralStrength: 98,
        energyQuality: 'neutral',
        compatibleWith: ['Heavy steel', 'All heavy materials'],
        incompatibleWith: [],
        idealUsage: ['Main foundations', 'Load-bearing walls', 'Columns', 'Heavy slabs'],
        prohibitedUsage: []
      }
    ],
    prohibitedMaterials: ['ANY light materials', 'Aluminum', 'Light wood', 'Glass walls', 'Thin materials'],
    structuralRequirement: 'heavy',
    strengthPriority: 100,
    idealConstructionMaterials: ['Dark granite', 'Heavy steel beams', 'Extra heavy concrete', 'Iron', 'Thick stone walls'],
    constructionGuidelines: [
      'CRITICAL: Must be HEAVIEST and HIGHEST area',
      'Use strongest possible materials',
      'Maximum density and weight',
      'Heavy foundations going deepest',
      'Multiple stories strongly recommended',
      'Master bedroom here for grounding',
      'Storage of valuable and heavy items'
    ],
    elementalBalance: 'Earth element - absolute maximum stability and grounding',
    materialHarmonyRules: [
      'Heaviest materials create strongest foundation',
      'Dark stones enhance ancestral energy',
      'Maximum strength ensures security',
      'Weight here stabilizes entire property'
    ]
  },
  {
    direction: 'West',
    directionCode: 'W',
    devta: 'Varuna',
    primaryMetals: [
      {
        name: 'Tin',
        sanskritName: 'रांगा',
        category: 'metal',
        elementAssociation: 'water',
        properties: ['Malleable', 'Corrosion-resistant', 'Moderate weight', 'Profit energy'],
        structuralStrength: 50,
        energyQuality: 'cooling',
        compatibleWith: ['Copper', 'Lead', 'Water applications'],
        incompatibleWith: ['Fire applications', 'High heat'],
        idealUsage: ['Alloys', 'Piping', 'Decorative', 'Water features'],
        prohibitedUsage: ['Main structural', 'Heat areas']
      },
      {
        name: 'Brass',
        sanskritName: 'पीतल',
        category: 'alloy',
        elementAssociation: 'fire',
        properties: ['Decorative', 'Durable', 'Prosperity', 'Golden appearance'],
        structuralStrength: 65,
        energyQuality: 'heating',
        compatibleWith: ['Copper', 'Gold', 'Wood'],
        incompatibleWith: ['Direct water contact long-term'],
        idealUsage: ['Doors', 'Windows', 'Decorative', 'Fittings', 'Prosperity items'],
        prohibitedUsage: ['Heavy structural', 'Foundations']
      }
    ],
    primaryMinerals: [
      {
        name: 'White/Grey Marble',
        sanskritName: 'सफेद संगमरमर',
        category: 'stone',
        elementAssociation: 'water',
        properties: ['Beautiful', 'Moderate strength', 'Cooling', 'Prosperity'],
        structuralStrength: 75,
        energyQuality: 'cooling',
        compatibleWith: ['Light materials', 'Brass', 'Wood'],
        incompatibleWith: ['Very heavy loads', 'Dark materials'],
        idealUsage: ['Flooring', 'Walls', 'Decorative', 'Features'],
        prohibitedUsage: ['Heavy industrial loads']
      },
      {
        name: 'Pearl/Mother of Pearl',
        sanskritName: 'मोती/सीप',
        category: 'mineral',
        elementAssociation: 'water',
        properties: ['Lustrous', 'Cooling', 'Moon energy', 'Prosperity'],
        structuralStrength: 30,
        energyQuality: 'cooling',
        compatibleWith: ['Silver', 'White materials', 'Water'],
        incompatibleWith: ['Heat', 'Acids', 'Heavy use'],
        idealUsage: ['Decorative inlay', 'Small features', 'Jewelry', 'Ritual items'],
        prohibitedUsage: ['Structural', 'Flooring', 'Heavy traffic']
      }
    ],
    supportingMaterials: [
      {
        name: 'Moderate Concrete',
        sanskritName: 'मध्यम कंक्रीट',
        category: 'earth',
        elementAssociation: 'earth',
        properties: ['Good strength', 'Versatile', 'Balanced'],
        structuralStrength: 80,
        energyQuality: 'neutral',
        compatibleWith: ['Steel', 'Most materials'],
        incompatibleWith: [],
        idealUsage: ['Walls', 'Moderate structures', 'General construction'],
        prohibitedUsage: []
      }
    ],
    prohibitedMaterials: ['Very heavy materials', 'Excessive iron', 'Dark stones'],
    structuralRequirement: 'moderate',
    strengthPriority: 70,
    idealConstructionMaterials: ['White marble', 'Moderate concrete', 'Brass fittings', 'Light to moderate stones'],
    constructionGuidelines: [
      'Moderate strength sufficient',
      'Use materials that allow some weight',
      'White and light colors enhance gains',
      'Brass and decorative metals beneficial',
      'Not too heavy, not too light',
      'Focus on beauty and prosperity'
    ],
    elementalBalance: 'Water element - moderate materials with cooling properties',
    materialHarmonyRules: [
      'Moderate materials allow profit realization',
      'Decorative metals enhance gains',
      'Not too heavy (blocks gains)',
      'Not too light (lacks stability)'
    ]
  },
  {
    direction: 'Northwest',
    directionCode: 'NW',
    devta: 'Vayu',
    primaryMetals: [
      {
        name: 'Aluminum',
        sanskritName: 'एल्युमिनियम',
        category: 'metal',
        elementAssociation: 'air',
        properties: ['Very light', 'Corrosion-resistant', 'Flexible', 'Modern'],
        structuralStrength: 60,
        energyQuality: 'cooling',
        compatibleWith: ['Glass', 'Light materials', 'Modern construction'],
        incompatibleWith: ['Copper (galvanic)', 'Heavy materials'],
        idealUsage: ['Windows', 'Light frames', 'Partitions', 'Facades'],
        prohibitedUsage: ['Main structural', 'Heavy load-bearing', 'Southeast']
      },
      {
        name: 'Zinc',
        sanskritName: 'जस्ता',
        category: 'metal',
        elementAssociation: 'air',
        properties: ['Light', 'Protective coating', 'Corrosion-resistant'],
        structuralStrength: 55,
        energyQuality: 'neutral',
        compatibleWith: ['Steel (galvanizing)', 'Light materials'],
        incompatibleWith: ['Heavy permanent structures'],
        idealUsage: ['Coatings', 'Roofing sheets', 'Light structures'],
        prohibitedUsage: ['Main foundations', 'Heavy construction']
      }
    ],
    primaryMinerals: [
      {
        name: 'Light Sandstone',
        sanskritName: 'हल्का बलुआ पत्थर',
        category: 'stone',
        elementAssociation: 'earth',
        properties: ['Light', 'Porous', 'Natural', 'Breathable'],
        structuralStrength: 65,
        energyQuality: 'neutral',
        compatibleWith: ['Light materials', 'Natural construction'],
        incompatibleWith: ['Heavy construction'],
        idealUsage: ['Light walls', 'Cladding', 'Decorative'],
        prohibitedUsage: ['Heavy load-bearing', 'Main foundations']
      },
      {
        name: 'Limestone',
        sanskritName: 'चूना पत्थर',
        category: 'stone',
        elementAssociation: 'earth',
        properties: ['Moderate', 'Traditional', 'Breathable', 'Natural'],
        structuralStrength: 70,
        energyQuality: 'cooling',
        compatibleWith: ['Natural materials', 'Traditional construction'],
        incompatibleWith: ['Very heavy loads'],
        idealUsage: ['Walls', 'Features', 'Traditional construction'],
        prohibitedUsage: ['Main load-bearing alone']
      }
    ],
    supportingMaterials: [
      {
        name: 'Light Concrete Blocks',
        sanskritName: 'हल्के कंक्रीट ब्लॉक',
        category: 'earth',
        elementAssociation: 'earth',
        properties: ['Light', 'Insulating', 'Quick construction'],
        structuralStrength: 65,
        energyQuality: 'neutral',
        compatibleWith: ['Light steel', 'Modern materials'],
        incompatibleWith: ['Very heavy loads'],
        idealUsage: ['Partition walls', 'Guest rooms', 'Light structures'],
        prohibitedUsage: ['Main load-bearing without reinforcement']
      }
    ],
    prohibitedMaterials: ['Heavy iron', 'Dark granite', 'Lead', 'Very heavy materials'],
    structuralRequirement: 'light',
    strengthPriority: 40,
    idealConstructionMaterials: ['Aluminum frames', 'Light concrete', 'Glass', 'Light stone', 'Zinc sheets'],
    constructionGuidelines: [
      'Keep light and airy',
      'Use modern light materials',
      'Aluminum windows and doors',
      'Good for guest areas',
      'Temporary structures acceptable',
      'Ventilation important'
    ],
    elementalBalance: 'Air element - light and moveable materials',
    materialHarmonyRules: [
      'Light materials enhance movement and change',
      'Avoid permanent heavy construction',
      'Flexibility and airiness beneficial',
      'Guest and support areas ideal'
    ]
  }
];

/**
 * Options for Khanij + Dhatu analysis
 */
export interface KhanijDhatuAnalysisOptions {
  northRotation?: number;
  presentMaterials?: { [direction: string]: string[] };
  constructionType?: 'residential' | 'commercial' | 'industrial' | 'spiritual';
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
 * Detect material conflicts
 */
function detectMaterialConflicts(
  metalInfo: DirectionalMetalInfo,
  presentMaterials: string[]
): Array<{ material1: string; material2: string; conflictType: string; severity: 'critical' | 'high' | 'medium' | 'low'; impact: string }> {
  const conflicts: Array<{ material1: string; material2: string; conflictType: string; severity: 'critical' | 'high' | 'medium' | 'low'; impact: string }> = [];

  // Check prohibited materials
  for (const prohibited of metalInfo.prohibitedMaterials) {
    for (const present of presentMaterials) {
      if (present.toLowerCase().includes(prohibited.toLowerCase())) {
        conflicts.push({
          material1: present,
          material2: '',
          conflictType: 'Prohibited Material',
          severity: ['NE', 'N'].includes(metalInfo.directionCode) ? 'critical' : 'high',
          impact: `${prohibited} should not be used in ${metalInfo.direction}`
        });
      }
    }
  }

  // Check metal/mineral incompatibilities
  const allMaterials = [...metalInfo.primaryMetals, ...metalInfo.primaryMinerals];
  for (const material of allMaterials) {
    for (const incompatible of material.incompatibleWith) {
      for (const present of presentMaterials) {
        if (present.toLowerCase().includes(incompatible.toLowerCase())) {
          conflicts.push({
            material1: present,
            material2: material.name,
            conflictType: 'Material Incompatibility',
            severity: 'medium',
            impact: `${present} conflicts with ${material.name} in ${metalInfo.direction}`
          });
        }
      }
    }
  }

  return conflicts;
}

/**
 * Calculate material scores
 */
function calculateMaterialScores(
  metalInfo: DirectionalMetalInfo,
  presentMaterials: string[],
  conflicts: Array<{ severity: string }>
): { material: number; structural: number; compatibility: number } {
  let materialScore = 60; // Base score
  let structuralScore = 50;
  let compatibilityScore = 70;

  // Check for ideal materials
  const idealPresent = metalInfo.idealConstructionMaterials.filter(ideal =>
    presentMaterials.some(p => p.toLowerCase().includes(ideal.toLowerCase()))
  ).length;
  materialScore += idealPresent * 8;

  // Check structural adequacy
  const heavyMetalsPresent = presentMaterials.filter(m => 
    m.toLowerCase().includes('iron') || m.toLowerCase().includes('steel') || 
    m.toLowerCase().includes('granite') || m.toLowerCase().includes('concrete')
  ).length;

  if (metalInfo.structuralRequirement === 'heavy') {
    structuralScore = heavyMetalsPresent >= 2 ? 90 : heavyMetalsPresent >= 1 ? 60 : 30;
  } else if (metalInfo.structuralRequirement === 'very-light') {
    structuralScore = heavyMetalsPresent === 0 ? 95 : heavyMetalsPresent === 1 ? 50 : 20;
  } else if (metalInfo.structuralRequirement === 'light') {
    structuralScore = heavyMetalsPresent <= 1 ? 80 : 50;
  } else {
    structuralScore = 70;
  }

  // Deduct for conflicts
  const criticalConflicts = conflicts.filter(c => c.severity === 'critical').length;
  const highConflicts = conflicts.filter(c => c.severity === 'high').length;
  materialScore -= criticalConflicts * 25 + highConflicts * 15;
  compatibilityScore -= criticalConflicts * 30 + highConflicts * 15;

  return {
    material: Math.max(0, Math.min(100, materialScore)),
    structural: Math.max(0, Math.min(100, structuralScore)),
    compatibility: Math.max(0, Math.min(100, compatibilityScore))
  };
}

/**
 * Calculate structural indicators
 */
function calculateStructuralIndicators(
  metalInfo: DirectionalMetalInfo,
  structuralScore: number
): { foundationStrength: number; wallStrength: number; roofStrength: number; overallIntegrity: number } {
  const baseStrength = structuralScore;
  const priorityFactor = metalInfo.strengthPriority / 100;

  return {
    foundationStrength: Math.round(baseStrength * (0.8 + 0.2 * priorityFactor)),
    wallStrength: Math.round(baseStrength * (0.7 + 0.3 * priorityFactor)),
    roofStrength: Math.round(baseStrength * 0.9),
    overallIntegrity: Math.round(baseStrength * (0.5 + 0.5 * priorityFactor))
  };
}

/**
 * Determine strength level
 */
function determineStrengthLevel(structuralScore: number): 'excellent' | 'good' | 'adequate' | 'weak' | 'critical' {
  if (structuralScore >= 85) return 'excellent';
  if (structuralScore >= 70) return 'good';
  if (structuralScore >= 50) return 'adequate';
  if (structuralScore >= 30) return 'weak';
  return 'critical';
}

/**
 * Generate sector recommendations
 */
function generateMaterialRecommendations(sector: MaterialZoneSector): string[] {
  const recs: string[] = [];
  const { metalInfo, structuralScore, strengthLevel, materialConflicts } = sector;

  if (strengthLevel === 'critical' || strengthLevel === 'weak') {
    recs.push(`⚠️ ${metalInfo.direction} has ${strengthLevel} structural strength. Reinforcement needed!`);
  }

  if (materialConflicts.length > 0) {
    recs.push(`🔴 ${materialConflicts.length} material conflict(s) in ${metalInfo.direction}!`);
    for (const conflict of materialConflicts.slice(0, 2)) {
      recs.push(`- ${conflict.conflictType}: ${conflict.impact}`);
    }
  }

  if (['S', 'SW'].includes(metalInfo.directionCode) && structuralScore < 80) {
    recs.push(`CRITICAL: ${metalInfo.direction} MUST be heavy! Current strength insufficient.`);
  }

  if (['NE', 'N'].includes(metalInfo.directionCode) && structuralScore > 50) {
    recs.push(`WARNING: ${metalInfo.direction} should be lighter. Remove heavy materials.`);
  }

  recs.push(`Recommended: ${metalInfo.idealConstructionMaterials.slice(0, 2).join(', ')}`);
  recs.push(`Priority: ${metalInfo.primaryMetals[0]?.name || metalInfo.primaryMinerals[0]?.name} for ${metalInfo.direction}`);

  return recs;
}

/**
 * Generate Khanij + Dhatu analysis
 */
export function generateKhanijDhatu(
  boundaryPoints: Point[],
  options: KhanijDhatuAnalysisOptions = {}
): KhanijDhatuAnalysisResult {
  const {
    northRotation = 0,
    presentMaterials = {},
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
  const sectors: MaterialZoneSector[] = [];
  let totalMaterial = 0;
  let totalStructural = 0;
  let totalCompatibility = 0;

  const materialRecommendations: Array<{
    direction: string;
    materialType: string;
    usage: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    expectedStrength: string;
  }> = [];

  for (const metalInfo of DIRECTIONAL_METAL_MINERAL_MAP) {
    const zones = directionZones[metalInfo.directionCode] || [];
    const coverage = calculateZoneCoverage(zones, boundaryPoints, center, radius);
    
    const dirPresentMaterials = presentMaterials[metalInfo.directionCode] || [];
    const materialConflicts = detectMaterialConflicts(metalInfo, dirPresentMaterials);
    const scores = calculateMaterialScores(metalInfo, dirPresentMaterials, materialConflicts);
    const structuralIndicators = calculateStructuralIndicators(metalInfo, scores.structural);
    const strengthLevel = determineStrengthLevel(scores.structural);

    const sector: MaterialZoneSector = {
      metalInfo,
      zones,
      coverage,
      presentMaterials: dirPresentMaterials,
      materialScore: scores.material,
      structuralScore: scores.structural,
      compatibilityScore: scores.compatibility,
      strengthLevel,
      materialConflicts,
      structuralIndicators,
      recommendations: []
    };

    sector.recommendations = generateMaterialRecommendations(sector);
    sectors.push(sector);

    totalMaterial += scores.material;
    totalStructural += scores.structural;
    totalCompatibility += scores.compatibility;

    // Generate material recommendations
    if (scores.structural < 70 || materialConflicts.length > 0) {
      const primaryMaterial = metalInfo.primaryMetals[0] || metalInfo.primaryMinerals[0];
      materialRecommendations.push({
        direction: metalInfo.direction,
        materialType: primaryMaterial.name,
        usage: primaryMaterial.idealUsage[0],
        priority: materialConflicts.length > 0 ? 'critical' : scores.structural < 50 ? 'high' : 'medium',
        expectedStrength: `${primaryMaterial.structuralStrength}/100`
      });
    }
  }

  const overallMaterialHarmony = Math.round(totalMaterial / sectors.length);
  const structuralIntegrity = Math.round(totalStructural / sectors.length);
  const compatibilityIndex = Math.round(totalCompatibility / sectors.length);

  // Strength distribution
  const strengthDistribution = {
    strongZones: sectors.filter(s => s.strengthLevel === 'excellent' || s.strengthLevel === 'good').map(s => s.metalInfo.direction),
    adequateZones: sectors.filter(s => s.strengthLevel === 'adequate').map(s => s.metalInfo.direction),
    weakZones: sectors.filter(s => s.strengthLevel === 'weak').map(s => s.metalInfo.direction),
    criticalZones: sectors.filter(s => s.strengthLevel === 'critical').map(s => s.metalInfo.direction)
  };

  // Construction guidance
  const constructionGuidance = {
    foundationMaterials: ['Heavy concrete (S/SW)', 'Moderate concrete (W/SE)', 'Light/minimal (N/NE)'],
    wallMaterials: ['Granite/heavy (S/SW)', 'Brick/moderate (E/W/SE)', 'Light/none (N/NE)'],
    roofMaterials: ['Heavy concrete slabs (S/SW)', 'Moderate slabs (center)', 'Light/sloped (N/NE)'],
    metalwork: ['Iron/steel (S/SW/SE)', 'Copper/brass (E/W)', 'Aluminum (NW)', 'Minimal (N/NE)'],
    flooringMaterials: ['Black/dark granite (S/SW)', 'Red granite (E/SE)', 'White marble (N/NE/W)']
  };

  // Overall recommendations
  const recommendations: string[] = [];

  recommendations.push(
    `Material Harmony: ${overallMaterialHarmony}/100 | Structural Integrity: ${structuralIntegrity}/100 | Compatibility: ${compatibilityIndex}/100`
  );

  if (strengthDistribution.criticalZones.length > 0) {
    recommendations.push(
      `🔴 Critical structural weakness in: ${strengthDistribution.criticalZones.join(', ')}. Immediate remediation!`
    );
  }

  if (strengthDistribution.weakZones.length > 0) {
    recommendations.push(
      `⚠️ Weak structural zones: ${strengthDistribution.weakZones.join(', ')}. Strengthening recommended.`
    );
  }

  const swSector = sectors.find(s => s.metalInfo.directionCode === 'SW');
  const sSector = sectors.find(s => s.metalInfo.directionCode === 'S');
  if (swSector && swSector.structuralScore < 85) {
    recommendations.push(
      `CRITICAL: Southwest must be heaviest! Current strength ${swSector.structuralScore}/100 insufficient.`
    );
  }
  if (sSector && sSector.structuralScore < 85) {
    recommendations.push(
      `CRITICAL: South must be very heavy! Current strength ${sSector.structuralScore}/100 insufficient.`
    );
  }

  const neSector = sectors.find(s => s.metalInfo.directionCode === 'NE');
  if (neSector && neSector.structuralScore > 50) {
    recommendations.push(
      `WARNING: Northeast has too much construction! Remove heavy materials immediately.`
    );
  }

  recommendations.push(
    `Priority: Strengthen ${materialRecommendations.filter(r => r.priority === 'critical' || r.priority === 'high').length} zones with appropriate materials.`
  );

  return {
    type: 'khanij-dhatu',
    timestamp: new Date(),
    boundaryPoints,
    recommendations,
    data: {
      sectors,
      overallMaterialHarmony,
      structuralIntegrity,
      compatibilityIndex,
      strengthDistribution,
      materialRecommendations,
      constructionGuidance
    }
  };
}

export { DIRECTIONAL_METAL_MINERAL_MAP };
