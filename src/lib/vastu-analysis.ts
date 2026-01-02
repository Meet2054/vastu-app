/**
 * Vastu Analysis System
 * Handles different types of Vastu grid overlays and analysis
 */

export interface VastuGrid {
  rows: number;
  cols: number;
  type: string;
  zones: VastuZone[];
}

export interface VastuZone {
  row: number;
  col: number;
  name: string;
  deity?: string;
  element?: string;
  property?: string;
  color?: string;
  description?: string;
}

/**
 * Modern Vastu - Vastu Square Grid (16 zones - 4x4)
 */
export function generateVastuSquareGrid16(): VastuGrid {
  const zones: VastuZone[] = [
    // Row 1
    { row: 0, col: 0, name: 'Northwest', element: 'Air', property: 'Movement', color: '#E8F4F8' },
    { row: 0, col: 1, name: 'North-Central', element: 'Water', property: 'Wealth', color: '#B3E5FC' },
    { row: 0, col: 2, name: 'North-Central', element: 'Water', property: 'Prosperity', color: '#B3E5FC' },
    { row: 0, col: 3, name: 'Northeast', element: 'Water', property: 'Wisdom', color: '#81D4FA' },
    // Row 2
    { row: 1, col: 0, name: 'West-Central', element: 'Space', property: 'Gains', color: '#FFE0B2' },
    { row: 1, col: 1, name: 'Central-Left', element: 'Space', property: 'Brahma', color: '#FFFDE7' },
    { row: 1, col: 2, name: 'Central-Right', element: 'Space', property: 'Divine', color: '#FFFDE7' },
    { row: 1, col: 3, name: 'East-Central', element: 'Air', property: 'Health', color: '#C8E6C9' },
    // Row 3
    { row: 2, col: 0, name: 'West-Central', element: 'Earth', property: 'Stability', color: '#FFE0B2' },
    { row: 2, col: 1, name: 'Central-Left', element: 'Earth', property: 'Balance', color: '#FFF9C4' },
    { row: 2, col: 2, name: 'Central-Right', element: 'Fire', property: 'Energy', color: '#FFCCBC' },
    { row: 2, col: 3, name: 'East-Central', element: 'Sun', property: 'Vitality', color: '#C8E6C9' },
    // Row 4
    { row: 3, col: 0, name: 'Southwest', element: 'Earth', property: 'Stability', color: '#D7CCC8' },
    { row: 3, col: 1, name: 'South-Central', element: 'Fire', property: 'Fame', color: '#FFCCBC' },
    { row: 3, col: 2, name: 'South-Central', element: 'Fire', property: 'Recognition', color: '#FFCCBC' },
    { row: 3, col: 3, name: 'Southeast', element: 'Fire', property: 'Prosperity', color: '#FFAB91' },
  ];

  return {
    rows: 4,
    cols: 4,
    type: 'Vastu Square Grid (16 Zones)',
    zones,
  };
}

/**
 * Modern Vastu - VPM (Vastu Purush Mandal) 9x9 = 81 zones
 */
export function generateVPM81Grid(): VastuGrid {
  const deityMap: { [key: string]: string } = {
    '0,0': 'Shikhi', '0,4': 'Parjanya', '0,8': 'Aditi',
    '4,0': 'Varuna', '4,4': 'Brahma', '4,8': 'Surya',
    '8,0': 'Nairritya', '8,4': 'Yama', '8,8': 'Agni',
  };

  const zones: VastuZone[] = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const key = `${row},${col}`;
      zones.push({
        row,
        col,
        name: `Zone ${row * 9 + col + 1}`,
        deity: deityMap[key],
        color: deityMap[key] ? '#FFE082' : '#F5F5F5',
      });
    }
  }

  return {
    rows: 9,
    cols: 9,
    type: 'VPM (81 Zones - 9×9)',
    zones,
  };
}

/**
 * Modern Vastu - Panchatatva Division (5 elements)
 */
export function generatePanchatatvaGrid(): VastuGrid {
  const zones: VastuZone[] = [
    { row: 0, col: 0, name: 'Northeast', element: 'Water', color: '#81D4FA', description: 'Water element - Clarity, Wisdom' },
    { row: 0, col: 1, name: 'North', element: 'Water', color: '#81D4FA', description: 'Water element - Flow, Wealth' },
    { row: 0, col: 2, name: 'Northwest', element: 'Air', color: '#B2DFDB', description: 'Air element - Movement, Communication' },
    { row: 1, col: 0, name: 'East', element: 'Air', color: '#B2DFDB', description: 'Air element - New beginnings' },
    { row: 1, col: 1, name: 'Center', element: 'Space', color: '#FFF9C4', description: 'Space element - Brahma, Divine' },
    { row: 1, col: 2, name: 'West', element: 'Earth', color: '#D7CCC8', description: 'Earth element - Stability' },
    { row: 2, col: 0, name: 'Southeast', element: 'Fire', color: '#FFAB91', description: 'Fire element - Energy, Transformation' },
    { row: 2, col: 1, name: 'South', element: 'Fire', color: '#FFAB91', description: 'Fire element - Fame, Recognition' },
    { row: 2, col: 2, name: 'Southwest', element: 'Earth', color: '#D7CCC8', description: 'Earth element - Foundation, Support' },
  ];

  return {
    rows: 3,
    cols: 3,
    type: 'Panchatatva Division (5 Elements)',
    zones,
  };
}

/**
 * Modern Vastu - Tri Dosha Division (Vata-Pitta-Kapha)
 */
export function generateTriDoshaGrid(): VastuGrid {
  const zones: VastuZone[] = [
    { row: 0, col: 0, name: 'Vata Zone', property: 'Air & Space', color: '#E1F5FE', description: 'Movement, Creativity, Change' },
    { row: 0, col: 1, name: 'Pitta Zone', property: 'Fire & Water', color: '#FFF3E0', description: 'Energy, Digestion, Transformation' },
    { row: 1, col: 0, name: 'Kapha Zone', property: 'Earth & Water', color: '#F1F8E9', description: 'Stability, Structure, Nourishment' },
    { row: 1, col: 1, name: 'Balance Zone', property: 'Tridosha', color: '#FCE4EC', description: 'Harmony & Balance' },
  ];

  return {
    rows: 2,
    cols: 2,
    type: 'Tri Dosha Division',
    zones,
  };
}

/**
 * Vedic Vastu - 8 Division (Ashtadik - 8 Directions)
 */
export function generateVedic8Division(): VastuGrid {
  const zones: VastuZone[] = [
    { row: 0, col: 0, name: 'Northwest', deity: 'Vayu', element: 'Air', color: '#E8F4F8' },
    { row: 0, col: 1, name: 'North', deity: 'Kubera', element: 'Water', color: '#B3E5FC' },
    { row: 0, col: 2, name: 'Northeast', deity: 'Ishanya', element: 'Water', color: '#81D4FA' },
    { row: 1, col: 0, name: 'West', deity: 'Varuna', element: 'Water', color: '#FFE0B2' },
    { row: 1, col: 1, name: 'Center', deity: 'Brahma', element: 'Space', color: '#FFFDE7' },
    { row: 1, col: 2, name: 'East', deity: 'Indra', element: 'Air', color: '#C8E6C9' },
    { row: 2, col: 0, name: 'Southwest', deity: 'Nairritya', element: 'Earth', color: '#D7CCC8' },
    { row: 2, col: 1, name: 'South', deity: 'Yama', element: 'Fire', color: '#FFCCBC' },
    { row: 2, col: 2, name: 'Southeast', deity: 'Agni', element: 'Fire', color: '#FFAB91' },
  ];

  return {
    rows: 3,
    cols: 3,
    type: 'Vedic 8 Division (Ashtadik)',
    zones,
  };
}

/**
 * Vedic Vastu - 16 Division
 */
export function generateVedic16Division(): VastuGrid {
  const zones: VastuZone[] = [];
  const deities = [
    'Shikhi', 'Parjanya', 'Jayanta', 'Indra',
    'Surya', 'Satya', 'Bhrisha', 'Akash',
    'Vayu', 'Pusa', 'Vitatha', 'Grihakshata',
    'Yama', 'Gandharva', 'Bringaraj', 'Mriga',
  ];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const index = row * 4 + col;
      zones.push({
        row,
        col,
        name: `Pada ${index + 1}`,
        deity: deities[index],
        color: index % 2 === 0 ? '#FFE082' : '#FFF9C4',
      });
    }
  }

  return {
    rows: 4,
    cols: 4,
    type: 'Vedic 16 Division',
    zones,
  };
}

/**
 * Vedic Vastu - 32 Division (Dwadashanta Pada)
 */
export function generateVedic32Division(): VastuGrid {
  const zones: VastuZone[] = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 4; col++) {
      const index = row * 4 + col;
      zones.push({
        row,
        col,
        name: `Pada ${index + 1}`,
        color: (row + col) % 2 === 0 ? '#E3F2FD' : '#F3E5F5',
      });
    }
  }

  return {
    rows: 8,
    cols: 4,
    type: 'Vedic 32 Division',
    zones,
  };
}

/**
 * Get analysis based on selected options
 */
export function getAnalysisForOption(optionKey: string): VastuGrid | null {
  const analysisMap: { [key: string]: () => VastuGrid } = {
    mvastuSquareGrid: generateVastuSquareGrid16,
    vpm: generateVPM81Grid,
    panchtattvaDevision: generatePanchatatvaGrid,
    triDoshaDevision: generateTriDoshaGrid,
    // Vedic
    devtaKhanj: generateVedic8Division,
    devtaBhojan: generateVedic16Division,
    devtaChinhaAadi: generateVedic32Division,
  };

  const generator = analysisMap[optionKey];
  return generator ? generator() : null;
}
