/**
 * VPM - Vastu Purush Mandal (9×9 Grid) Analysis
 * 
 * The core Vastu framework representing the cosmic being (Vastu Purush).
 * Every square represents a Devta (deity) and energy type with body part associations.
 */

import { Point, BoundingBox, AnalysisResult } from './types';

export interface VPMCell {
  row: number;
  col: number;
  cellNumber: number; // 1-81
  x: number;
  y: number;
  width: number;
  height: number;
  devta: string; // Deity name
  bodyPart: string; // Body part of Vastu Purush
  element: string; // Associated element
  energy: string; // Energy quality
  idealUsage: string[]; // Recommended room types
  prohibitedUsage: string[]; // Forbidden room types
  direction: string; // Cardinal direction
  color: string; // Associated color
  isViolated: boolean;
  currentUsage?: string;
  violationSeverity?: 'critical' | 'high' | 'medium' | 'low';
}

export interface VPMOptions {
  northRotation?: number;
  roomUsage?: Map<number, string>; // Cell number -> room type (toilet, kitchen, bedroom, etc.)
}

export interface VPMResult extends AnalysisResult {
  type: 'vpm';
  data: {
    gridSize: 9;
    cells: VPMCell[];
    violations: {
      cellNumber: number;
      devta: string;
      bodyPart: string;
      currentUsage: string;
      severity: string;
      impact: string;
      remedy: string;
    }[];
    coreVastuScore: number; // 0-100
    devtaScores: Map<string, number>;
    recommendations: string[];
  };
}

// Standard 9×9 VPM Layout (81 cells)
// Layout follows traditional Vastu Purush positioning
const VPM_LAYOUT: Omit<VPMCell, 'row' | 'col' | 'x' | 'y' | 'width' | 'height' | 'isViolated'>[] = [
  // Row 1 (Top - North)
  { cellNumber: 1, devta: 'Shikhi', bodyPart: 'Head Top', element: 'Air', energy: 'Neutral', direction: 'N', color: '#E8F4F8', idealUsage: ['Balcony', 'Open Space'], prohibitedUsage: ['Toilet', 'Kitchen', 'Storage'] },
  { cellNumber: 2, devta: 'Parjanya', bodyPart: 'Head', element: 'Air', energy: 'Divine', direction: 'N', color: '#E8F4F8', idealUsage: ['Prayer Room', 'Study'], prohibitedUsage: ['Toilet', 'Kitchen', 'Bedroom'] },
  { cellNumber: 3, devta: 'Jayanta', bodyPart: 'Forehead', element: 'Air', energy: 'Victory', direction: 'N-NE', color: '#FFF9E6', idealUsage: ['Study', 'Office'], prohibitedUsage: ['Toilet', 'Storage'] },
  { cellNumber: 4, devta: 'Indra', bodyPart: 'Right Eye', element: 'Ether', energy: 'Power', direction: 'NE', color: '#FFFACD', idealUsage: ['Puja Room', 'Meditation'], prohibitedUsage: ['Toilet', 'Kitchen', 'Bedroom'] },
  { cellNumber: 5, devta: 'Aditi', bodyPart: 'Nose', element: 'Ether', energy: 'Divine Mother', direction: 'NE', color: '#FFFACD', idealUsage: ['Puja Room', 'Open Space'], prohibitedUsage: ['Toilet', 'Kitchen', 'Storage', 'Stairs'] },
  { cellNumber: 6, devta: 'Aditya', bodyPart: 'Left Eye', element: 'Ether', energy: 'Sun', direction: 'NE', color: '#FFFACD', idealUsage: ['Study', 'Living Room'], prohibitedUsage: ['Toilet', 'Kitchen'] },
  { cellNumber: 7, devta: 'Satya', bodyPart: 'Right Ear', element: 'Air', energy: 'Truth', direction: 'NE-E', color: '#E6F9E6', idealUsage: ['Study', 'Office'], prohibitedUsage: ['Toilet', 'Store'] },
  { cellNumber: 8, devta: 'Bhrishay', bodyPart: 'Left Ear', element: 'Air', energy: 'Support', direction: 'E', color: '#E6F9E6', idealUsage: ['Living Room'], prohibitedUsage: ['Toilet', 'Heavy Storage'] },
  { cellNumber: 9, devta: 'Akash', bodyPart: 'Neck Right', element: 'Ether', energy: 'Sky', direction: 'E', color: '#E6F9E6', idealUsage: ['Balcony', 'Windows'], prohibitedUsage: ['Toilet', 'Kitchen'] },

  // Row 2
  { cellNumber: 10, devta: 'Vayu', bodyPart: 'Shoulder Right', element: 'Air', energy: 'Wind', direction: 'N', color: '#E8F4F8', idealUsage: ['Windows', 'Ventilation'], prohibitedUsage: ['Toilet', 'Heavy Construction'] },
  { cellNumber: 11, devta: 'Pusha', bodyPart: 'Right Arm Upper', element: 'Air', energy: 'Nourishment', direction: 'N-NE', color: '#F0F8FF', idealUsage: ['Dining', 'Living'], prohibitedUsage: ['Toilet', 'Storage'] },
  { cellNumber: 12, devta: 'Vitatha', bodyPart: 'Right Arm', element: 'Air', energy: 'False Speech', direction: 'NE', color: '#FFF5E6', idealUsage: ['Study'], prohibitedUsage: ['Toilet', 'Kitchen', 'Bedroom'] },
  { cellNumber: 13, devta: 'Brihatshraya', bodyPart: 'Heart Right', element: 'Ether', energy: 'Great Support', direction: 'NE', color: '#FFFACD', idealUsage: ['Living Room', 'Hall'], prohibitedUsage: ['Toilet', 'Kitchen', 'Master Bedroom'] },
  { cellNumber: 14, devta: 'Akash (Center)', bodyPart: 'Navel', element: 'Ether', energy: 'Void', direction: 'Center', color: '#FFFFE0', idealUsage: ['Courtyard', 'Open Space'], prohibitedUsage: ['Toilet', 'Kitchen', 'Bedroom', 'Heavy Furniture'] },
  { cellNumber: 15, devta: 'Anil', bodyPart: 'Heart Left', element: 'Air', energy: 'Wind God', direction: 'E', color: '#F0FFF0', idealUsage: ['Living Room'], prohibitedUsage: ['Toilet', 'Storage'] },
  { cellNumber: 16, devta: 'Pusha (East)', bodyPart: 'Left Arm', element: 'Air', energy: 'Nourishment', direction: 'E', color: '#E6F9E6', idealUsage: ['Dining'], prohibitedUsage: ['Toilet', 'Store'] },
  { cellNumber: 17, devta: 'Grihakshata', bodyPart: 'Left Arm Upper', element: 'Air', energy: 'Home Protector', direction: 'E', color: '#E6F9E6', idealUsage: ['Living', 'Children Room'], prohibitedUsage: ['Toilet', 'Kitchen'] },
  { cellNumber: 18, devta: 'Yama', bodyPart: 'Shoulder Left', element: 'Air', energy: 'Death', direction: 'E', color: '#E6F9E6', idealUsage: ['Guest Room'], prohibitedUsage: ['Master Bedroom', 'Puja'] },

  // Row 3
  { cellNumber: 19, devta: 'Bhallat', bodyPart: 'Right Side Upper', element: 'Air', energy: 'Strength', direction: 'N-NW', color: '#F0F0F0', idealUsage: ['Guest Room'], prohibitedUsage: ['Toilet', 'Master Bedroom'] },
  { cellNumber: 20, devta: 'Soma', bodyPart: 'Chest Right', element: 'Water', energy: 'Moon', direction: 'N', color: '#E8F4F8', idealUsage: ['Water Storage', 'Bath'], prohibitedUsage: ['Kitchen', 'Fire'] },
  { cellNumber: 21, devta: 'Sosa', bodyPart: 'Right Chest', element: 'Water', energy: 'Drying', direction: 'NE', color: '#F5F5F5', idealUsage: ['Storage'], prohibitedUsage: ['Toilet', 'Kitchen'] },
  { cellNumber: 22, devta: 'Rudra', bodyPart: 'Right Stomach', element: 'Ether', energy: 'Destruction', direction: 'NE', color: '#FFFACD', idealUsage: ['Meditation', 'Yoga'], prohibitedUsage: ['Toilet', 'Kitchen', 'Storage'] },
  { cellNumber: 23, devta: 'Brahma', bodyPart: 'Brahmarandhra', element: 'Ether', energy: 'Creator', direction: 'Center', color: '#FFFFE0', idealUsage: ['Puja', 'Courtyard'], prohibitedUsage: ['Toilet', 'Kitchen', 'Bedroom', 'Storage'] },
  { cellNumber: 24, devta: 'Naga', bodyPart: 'Left Stomach', element: 'Water', energy: 'Serpent', direction: 'E', color: '#F0FFF0', idealUsage: ['Living'], prohibitedUsage: ['Toilet', 'Kitchen'] },
  { cellNumber: 25, devta: 'Mukhya', bodyPart: 'Left Chest', element: 'Air', energy: 'Chief', direction: 'E', color: '#E6F9E6', idealUsage: ['Living', 'Hall'], prohibitedUsage: ['Toilet', 'Storage'] },
  { cellNumber: 26, devta: 'Bhalwan', bodyPart: 'Chest Left', element: 'Air', energy: 'Strong', direction: 'E-SE', color: '#FFE6E6', idealUsage: ['Gym', 'Store'], prohibitedUsage: ['Puja', 'Master Bedroom'] },
  { cellNumber: 27, devta: 'Gandharva', bodyPart: 'Left Side Upper', element: 'Air', energy: 'Celestial Musician', direction: 'SE', color: '#FFE6E6', idealUsage: ['Music Room', 'Entertainment'], prohibitedUsage: ['Puja', 'Study'] },

  // Row 4
  { cellNumber: 28, devta: 'Bhujang', bodyPart: 'Right Hip', element: 'Water', energy: 'Snake', direction: 'NW', color: '#F5F5F5', idealUsage: ['Guest Room', 'Store'], prohibitedUsage: ['Master Bedroom', 'Puja'] },
  { cellNumber: 29, devta: 'Mruga', bodyPart: 'Right Waist', element: 'Water', energy: 'Deer', direction: 'N-NW', color: '#E8F4F8', idealUsage: ['Dining'], prohibitedUsage: ['Toilet', 'Master Bedroom'] },
  { cellNumber: 30, devta: 'Pitru', bodyPart: 'Right Thigh Upper', element: 'Water', energy: 'Ancestors', direction: 'N-Center', color: '#FFF5E6', idealUsage: ['Puja', 'Ancestral Worship'], prohibitedUsage: ['Toilet', 'Kitchen'] },
  { cellNumber: 31, devta: 'Daurvarika', bodyPart: 'Genitals', element: 'Water', energy: 'Doorkeeper', direction: 'Center', color: '#FFFACD', idealUsage: ['Entrance', 'Passage'], prohibitedUsage: ['Toilet', 'Kitchen', 'Puja'] },
  { cellNumber: 32, devta: 'Sugreeva', bodyPart: 'Left Thigh Upper', element: 'Water', energy: 'Monkey King', direction: 'E-Center', color: '#F0FFF0', idealUsage: ['Activity Area'], prohibitedUsage: ['Puja', 'Master Bedroom'] },
  { cellNumber: 33, devta: 'Pushpadanta', bodyPart: 'Left Waist', element: 'Air', energy: 'Flowered Tooth', direction: 'E', color: '#E6F9E6', idealUsage: ['Garden View'], prohibitedUsage: ['Toilet', 'Storage'] },
  { cellNumber: 34, devta: 'Varun', bodyPart: 'Left Hip', element: 'Water', energy: 'Water God', direction: 'SE', color: '#FFE6E6', idealUsage: ['Water Storage', 'Well'], prohibitedUsage: ['Kitchen Fire', 'Heavy Storage'] },
  { cellNumber: 35, devta: 'Asura', bodyPart: 'Left Side Lower', element: 'Fire', energy: 'Demon', direction: 'SE', color: '#FFB6C1', idealUsage: ['Kitchen', 'Fire'], prohibitedUsage: ['Puja', 'Master Bedroom', 'Water'] },
  { cellNumber: 36, devta: 'Shosha', bodyPart: 'Right Side Lower', element: 'Air', energy: 'Drying', direction: 'SE', color: '#FFE6E6', idealUsage: ['Storage'], prohibitedUsage: ['Water', 'Puja'] },

  // Row 5 (Middle)
  { cellNumber: 37, devta: 'Papyakshma', bodyPart: 'Right Thigh', element: 'Water', energy: 'Sin Destroyer', direction: 'W', color: '#F0F0F0', idealUsage: ['Bath', 'Cleansing'], prohibitedUsage: ['Kitchen', 'Puja'] },
  { cellNumber: 38, devta: 'Roga', bodyPart: 'Right Knee', element: 'Earth', energy: 'Disease', direction: 'W-NW', color: '#E8E8E8', idealUsage: ['Medical Room'], prohibitedUsage: ['Puja', 'Master Bedroom'] },
  { cellNumber: 39, devta: 'Naga (West)', bodyPart: 'Right Knee Lower', element: 'Earth', energy: 'Serpent', direction: 'W-Center', color: '#F5F5DC', idealUsage: ['Store'], prohibitedUsage: ['Puja', 'Kitchen'] },
  { cellNumber: 40, devta: 'Mukhya (Center)', bodyPart: 'Knees', element: 'Earth', energy: 'Principal', direction: 'Center', color: '#FFFFE0', idealUsage: ['Hall', 'Common Area'], prohibitedUsage: ['Toilet', 'Kitchen', 'Master Bedroom'] },
  { cellNumber: 41, devta: 'Bhallat (East)', bodyPart: 'Left Knee Lower', element: 'Earth', energy: 'Strong', direction: 'E-Center', color: '#F0FFF0', idealUsage: ['Activity Area'], prohibitedUsage: ['Puja'] },
  { cellNumber: 42, devta: 'Soma (East)', bodyPart: 'Left Knee', element: 'Water', energy: 'Moon', direction: 'E-SE', color: '#E6F9E6', idealUsage: ['Water Feature'], prohibitedUsage: ['Kitchen Fire'] },
  { cellNumber: 43, devta: 'Sosa (SE)', bodyPart: 'Left Thigh', element: 'Fire', energy: 'Drying', direction: 'SE', color: '#FFE6E6', idealUsage: ['Kitchen', 'Fire'], prohibitedUsage: ['Water', 'Puja'] },
  { cellNumber: 44, devta: 'Agni', bodyPart: 'Left Thigh Lower', element: 'Fire', energy: 'Fire God', direction: 'SE', color: '#FF6347', idealUsage: ['Kitchen', 'Electrical'], prohibitedUsage: ['Toilet', 'Water Storage', 'Puja'] },
  { cellNumber: 45, devta: 'Vitatha (SE)', bodyPart: 'Stomach Lower', element: 'Fire', energy: 'False', direction: 'SE', color: '#FFE6E6', idealUsage: ['Storage'], prohibitedUsage: ['Puja', 'Water'] },

  // Row 6
  { cellNumber: 46, devta: 'Papyakshma (W)', bodyPart: 'Right Calf Upper', element: 'Earth', energy: 'Sin Destroyer', direction: 'W', color: '#E8E8E8', idealUsage: ['Bath'], prohibitedUsage: ['Kitchen', 'Puja'] },
  { cellNumber: 47, devta: 'Roga (W)', bodyPart: 'Right Calf', element: 'Earth', energy: 'Disease', direction: 'W', color: '#E8E8E8', idealUsage: ['Medical'], prohibitedUsage: ['Puja', 'Master Bedroom'] },
  { cellNumber: 48, devta: 'Naga (SW)', bodyPart: 'Right Ankle', element: 'Earth', energy: 'Serpent', direction: 'SW', color: '#DEB887', idealUsage: ['Heavy Storage'], prohibitedUsage: ['Kitchen', 'Open Space'] },
  { cellNumber: 49, devta: 'Mukhya (S)', bodyPart: 'Right Foot', element: 'Earth', energy: 'Chief', direction: 'S', color: '#D2B48C', idealUsage: ['Master Bedroom', 'Heavy Furniture'], prohibitedUsage: ['Kitchen', 'Puja', 'Open Space'] },
  { cellNumber: 50, devta: 'Bhallat (S)', bodyPart: 'Left Ankle', element: 'Earth', energy: 'Strong', direction: 'S', color: '#D2B48C', idealUsage: ['Bedroom', 'Store'], prohibitedUsage: ['Kitchen', 'Open Space'] },
  { cellNumber: 51, devta: 'Soma (S)', bodyPart: 'Left Calf', element: 'Earth', energy: 'Moon', direction: 'S-SE', color: '#D2B48C', idealUsage: ['Bedroom'], prohibitedUsage: ['Open Space'] },
  { cellNumber: 52, devta: 'Roga (S)', bodyPart: 'Left Calf Upper', element: 'Earth', energy: 'Disease', direction: 'S-SE', color: '#FFE6E6', idealUsage: ['Store'], prohibitedUsage: ['Puja', 'Open Space'] },
  { cellNumber: 53, devta: 'Vitatha (S)', bodyPart: 'Left Shin', element: 'Fire', energy: 'False', direction: 'SE', color: '#FFE6E6', idealUsage: ['Kitchen'], prohibitedUsage: ['Puja', 'Water'] },
  { cellNumber: 54, devta: 'Aditi (SE)', bodyPart: 'Hip Lower', element: 'Fire', energy: 'Mother', direction: 'SE', color: '#FFB6C1', idealUsage: ['Kitchen'], prohibitedUsage: ['Toilet', 'Puja'] },

  // Row 7
  { cellNumber: 55, devta: 'Dauvarika (W)', bodyPart: 'Right Foot Upper', element: 'Earth', energy: 'Doorkeeper', direction: 'W', color: '#E8E8E8', idealUsage: ['Entrance'], prohibitedUsage: ['Puja', 'Master Bedroom'] },
  { cellNumber: 56, devta: 'Sugreeva (W)', bodyPart: 'Right Foot Arch', element: 'Earth', energy: 'Monkey King', direction: 'W-SW', color: '#D3D3D3', idealUsage: ['Guest Room'], prohibitedUsage: ['Master Bedroom'] },
  { cellNumber: 57, devta: 'Pushpadanta (SW)', bodyPart: 'Right Heel', element: 'Earth', energy: 'Flowered Tooth', direction: 'SW', color: '#C19A6B', idealUsage: ['Master Bedroom', 'Heavy Storage'], prohibitedUsage: ['Kitchen', 'Open Space', 'Water'] },
  { cellNumber: 58, devta: 'Varuna', bodyPart: 'Feet Center', element: 'Earth', energy: 'Water God', direction: 'SW', color: '#A0826D', idealUsage: ['Bedroom', 'Store'], prohibitedUsage: ['Kitchen', 'Open Space'] },
  { cellNumber: 59, devta: 'Asura (SW)', bodyPart: 'Left Heel', element: 'Earth', energy: 'Demon', direction: 'SW', color: '#A0826D', idealUsage: ['Heavy Store'], prohibitedUsage: ['Puja', 'Open Space'] },
  { cellNumber: 60, devta: 'Shosha (S)', bodyPart: 'Left Foot Arch', element: 'Earth', energy: 'Drying', direction: 'S', color: '#D2B48C', idealUsage: ['Store'], prohibitedUsage: ['Open Space'] },
  { cellNumber: 61, devta: 'Papyakshma (S)', bodyPart: 'Left Foot Upper', element: 'Earth', energy: 'Sin Destroyer', direction: 'S', color: '#D2B48C', idealUsage: ['Bath'], prohibitedUsage: ['Kitchen'] },
  { cellNumber: 62, devta: 'Roga (SE)', bodyPart: 'Left Foot', element: 'Fire', energy: 'Disease', direction: 'S-SE', color: '#FFE6E6', idealUsage: ['Store'], prohibitedUsage: ['Puja'] },
  { cellNumber: 63, devta: 'Ahi', bodyPart: 'Foot Lower', element: 'Fire', energy: 'Serpent', direction: 'SE', color: '#FFB6C1', idealUsage: ['Kitchen'], prohibitedUsage: ['Toilet', 'Puja', 'Water'] },

  // Row 8
  { cellNumber: 64, devta: 'Niruti', bodyPart: 'Right Toe 1', element: 'Earth', energy: 'Demon King', direction: 'W-SW', color: '#808080', idealUsage: ['Heavy Storage'], prohibitedUsage: ['Puja', 'Kitchen', 'Open Space'] },
  { cellNumber: 65, devta: 'Pitru (SW)', bodyPart: 'Right Toe 2', element: 'Earth', energy: 'Ancestors', direction: 'SW', color: '#8B7355', idealUsage: ['Master Bedroom', 'Ancestral'], prohibitedUsage: ['Kitchen', 'Open Space'] },
  { cellNumber: 66, devta: 'Nairritya', bodyPart: 'Right Toe 3', element: 'Earth', energy: 'Southwest Demon', direction: 'SW', color: '#8B4513', idealUsage: ['Master Bedroom', 'Heavy Storage'], prohibitedUsage: ['Puja', 'Kitchen', 'Open Space', 'Stairs'] },
  { cellNumber: 67, devta: 'Rudra (SW)', bodyPart: 'Toe Center', element: 'Earth', energy: 'Destruction', direction: 'SW', color: '#8B4513', idealUsage: ['Master Bedroom'], prohibitedUsage: ['Kitchen', 'Puja', 'Open Space'] },
  { cellNumber: 68, devta: 'Mitra', bodyPart: 'Left Toe 3', element: 'Earth', energy: 'Friend', direction: 'SW-S', color: '#A0826D', idealUsage: ['Bedroom'], prohibitedUsage: ['Open Space'] },
  { cellNumber: 69, devta: 'Pitru (S)', bodyPart: 'Left Toe 2', element: 'Earth', energy: 'Ancestors', direction: 'S', color: '#BC8F8F', idealUsage: ['Bedroom'], prohibitedUsage: ['Kitchen'] },
  { cellNumber: 70, devta: 'Indrajit', bodyPart: 'Left Toe 1', element: 'Earth', energy: 'Indra Conqueror', direction: 'S', color: '#D2B48C', idealUsage: ['Store'], prohibitedUsage: ['Open Space'] },
  { cellNumber: 71, devta: 'Jaya', bodyPart: 'Toe Lower', element: 'Fire', energy: 'Victory', direction: 'S-SE', color: '#FFE6E6', idealUsage: ['Kitchen'], prohibitedUsage: ['Puja', 'Water'] },
  { cellNumber: 72, devta: 'Rudra (SE)', bodyPart: 'Below Foot', element: 'Fire', energy: 'Destruction', direction: 'SE', color: '#FF6347', idealUsage: ['Kitchen', 'Boiler'], prohibitedUsage: ['Toilet', 'Water', 'Puja'] },

  // Row 9 (Bottom - South)
  { cellNumber: 73, devta: 'Pitra', bodyPart: 'Below Foot Right', element: 'Earth', energy: 'Father', direction: 'SW', color: '#696969', idealUsage: ['Master Bedroom'], prohibitedUsage: ['Kitchen', 'Toilet', 'Open Space'] },
  { cellNumber: 74, devta: 'Grihakshat', bodyPart: 'Under Heel Right', element: 'Earth', energy: 'Home Destroyer', direction: 'SW', color: '#8B4513', idealUsage: ['Heavy Storage only'], prohibitedUsage: ['Kitchen', 'Puja', 'Bedroom', 'Open Space'] },
  { cellNumber: 75, devta: 'Yama', bodyPart: 'Under Right', element: 'Earth', energy: 'Death', direction: 'SW-S', color: '#A0522D', idealUsage: ['Heavy Storage'], prohibitedUsage: ['Puja', 'Kitchen', 'Living', 'Open Space'] },
  { cellNumber: 76, devta: 'Gandharva (S)', bodyPart: 'Ground Center', element: 'Earth', energy: 'Celestial', direction: 'S', color: '#BC8F8F', idealUsage: ['Heavy Furniture'], prohibitedUsage: ['Open Space', 'Kitchen'] },
  { cellNumber: 77, devta: 'Mriga (S)', bodyPart: 'Under Left', element: 'Earth', energy: 'Deer', direction: 'S', color: '#BC8F8F', idealUsage: ['Store'], prohibitedUsage: ['Open Space'] },
  { cellNumber: 78, devta: 'Bhringraj', bodyPart: 'Under Heel Left', element: 'Earth', energy: 'Bee King', direction: 'S', color: '#D2B48C', idealUsage: ['Store'], prohibitedUsage: ['Kitchen', 'Open Space'] },
  { cellNumber: 79, devta: 'Dauvarika (S)', bodyPart: 'Below Foot Left', element: 'Earth', energy: 'Doorkeeper', direction: 'S', color: '#D2B48C', idealUsage: ['Secondary Entrance'], prohibitedUsage: ['Main Entrance', 'Open Space'] },
  { cellNumber: 80, devta: 'Sugreeva (S)', bodyPart: 'Ground SE', element: 'Fire', energy: 'Monkey King', direction: 'S-SE', color: '#FFE6E6', idealUsage: ['Kitchen'], prohibitedUsage: ['Puja', 'Water'] },
  { cellNumber: 81, devta: 'Agni (Corner)', bodyPart: 'Ground Fire', element: 'Fire', energy: 'Fire', direction: 'SE', color: '#FF4500', idealUsage: ['Kitchen', 'Fire', 'Electrical Panel'], prohibitedUsage: ['Toilet', 'Water Storage', 'Puja', 'Master Bedroom'] }
];

/**
 * Calculate bounding box from boundary points
 */
function calculateBoundingBox(points: Point[]): BoundingBox {
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  
  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2
  };
}

/**
 * Check if room usage violates cell's Devta rules
 */
function checkViolation(
  cell: VPMCell,
  usage: string
): { isViolated: boolean; severity: 'critical' | 'high' | 'medium' | 'low'; impact: string; remedy: string } {
  const usageLower = usage.toLowerCase();
  
  // Check prohibited usage
  const isProhibited = cell.prohibitedUsage.some(p => usageLower.includes(p.toLowerCase()));
  
  if (isProhibited) {
    let severity: 'critical' | 'high' | 'medium' | 'low' = 'medium';
    let impact = '';
    let remedy = '';
    
    // Critical violations (Brahma, Indra, Aditi cells)
    if (['Brahma', 'Indra', 'Aditi'].includes(cell.devta)) {
      severity = 'critical';
      impact = `Severe Vastu dosha affecting ${cell.bodyPart} of Vastu Purush. May cause ${
        usageLower.includes('toilet') ? 'health issues, mental stress' :
        usageLower.includes('kitchen') ? 'financial problems, family conflicts' :
        'general life obstacles'
      }`;
      remedy = `Immediately relocate ${usage}. Perform Vastu Shanti Puja. Consider major renovation.`;
    }
    // High severity (Core body parts)
    else if (cell.cellNumber >= 11 && cell.cellNumber <= 71 && (cell.cellNumber - 11) % 9 >= 1 && (cell.cellNumber - 11) % 9 <= 7) {
      severity = 'high';
      impact = `Violation of ${cell.devta} affecting ${cell.bodyPart}. May cause ${
        usageLower.includes('toilet') ? 'health and prosperity issues' :
        usageLower.includes('kitchen') && cell.element === 'Water' ? 'fire-water conflict' :
        'imbalance in life'
      }`;
      remedy = `Relocate ${usage} if possible. Use Vastu pyramids. Place ${cell.devta} yantra.`;
    }
    // Medium severity
    else {
      severity = 'medium';
      impact = `Suboptimal placement affecting ${cell.bodyPart} energy. Minor life obstacles.`;
      remedy = `Consider relocation during next renovation. Use color therapy (${cell.color}). Place remedial items.`;
    }
    
    return { isViolated: true, severity, impact, remedy };
  }
  
  // Check if usage is ideal
  const isIdeal = cell.idealUsage.some(i => usageLower.includes(i.toLowerCase()));
  if (isIdeal) {
    return {
      isViolated: false,
      severity: 'low',
      impact: 'Excellent placement as per Vastu',
      remedy: 'No remedy needed'
    };
  }
  
  // Neutral usage
  return {
    isViolated: false,
    severity: 'low',
    impact: 'Acceptable placement',
    remedy: 'Enhance with appropriate colors and elements'
  };
}

/**
 * Generate VPM (Vastu Purush Mandal) analysis
 */
export function generateVPM(
  boundaryPoints: Point[],
  options: VPMOptions = {}
): VPMResult {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    northRotation = 0,
    roomUsage = new Map()
  } = options;
  
  if (boundaryPoints.length < 3) {
    throw new Error('At least 3 boundary points required');
  }
  
  const bbox = calculateBoundingBox(boundaryPoints);
  const cellWidth = bbox.width / 9;
  const cellHeight = bbox.height / 9;
  
  const cells: VPMCell[] = [];
  const violations: any[] = [];
  const devtaScores = new Map<string, number>();
  
  // Generate grid cells
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cellIndex = row * 9 + col;
      const template = VPM_LAYOUT[cellIndex];
      
      const x = bbox.minX + col * cellWidth;
      const y = bbox.minY + row * cellHeight;
      
      const usage = roomUsage.get(template.cellNumber);
      let isViolated = false;
      let violationSeverity: 'critical' | 'high' | 'medium' | 'low' | undefined;
      
      if (usage) {
        const check = checkViolation({ ...template, row, col, x, y, width: cellWidth, height: cellHeight, isViolated: false }, usage);
        isViolated = check.isViolated;
        violationSeverity = check.severity;
        
        if (isViolated) {
          violations.push({
            cellNumber: template.cellNumber,
            devta: template.devta,
            bodyPart: template.bodyPart,
            currentUsage: usage,
            severity: check.severity,
            impact: check.impact,
            remedy: check.remedy
          });
        }
        
        // Update devta score
        const currentScore = devtaScores.get(template.devta) || 100;
        if (isViolated) {
          const penalty = violationSeverity === 'critical' ? 50 : 
                         violationSeverity === 'high' ? 30 :
                         violationSeverity === 'medium' ? 15 : 5;
          devtaScores.set(template.devta, currentScore - penalty);
        }
      }
      
      cells.push({
        ...template,
        row,
        col,
        x,
        y,
        width: cellWidth,
        height: cellHeight,
        isViolated,
        currentUsage: usage,
        violationSeverity
      });
    }
  }
  
  // Calculate core Vastu score
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const totalCells = 81;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const violatedCells = violations.length;
  const criticalViolations = violations.filter(v => v.severity === 'critical').length;
  const highViolations = violations.filter(v => v.severity === 'high').length;
  
  const coreVastuScore = Math.max(0, 
    100 - (criticalViolations * 20) - (highViolations * 10) - (violations.length * 5)
  );
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (criticalViolations > 0) {
    recommendations.push(`⚠️ CRITICAL: ${criticalViolations} critical Devta violation(s) found. Immediate remedial action required.`);
  }
  
  if (highViolations > 0) {
    recommendations.push(`⚠️ HIGH: ${highViolations} high severity violation(s). Address during renovation.`);
  }
  
  if (coreVastuScore < 50) {
    recommendations.push(`Overall Vastu score is low (${coreVastuScore}/100). Consider comprehensive Vastu correction.`);
  } else if (coreVastuScore < 75) {
    recommendations.push(`Vastu score is moderate (${coreVastuScore}/100). Some improvements recommended.`);
  } else if (coreVastuScore >= 90) {
    recommendations.push(`✅ Excellent Vastu compliance (${coreVastuScore}/100). Maintain current layout.`);
  }
  
  // Top 3 most violated devtas
  const mostViolatedDevtas = Array.from(devtaScores.entries())
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3);
  
  if (mostViolatedDevtas.length > 0 && mostViolatedDevtas[0][1] < 80) {
    recommendations.push(
      `Most affected deities: ${mostViolatedDevtas.map(d => `${d[0]} (${d[1].toFixed(0)}%)`).join(', ')}`
    );
  }
  
  return {
    type: 'vpm',
    timestamp: new Date(),
    boundaryPoints,
    data: {
      gridSize: 9,
      cells,
      violations,
      coreVastuScore,
      devtaScores,
      recommendations
    }
  };
}
