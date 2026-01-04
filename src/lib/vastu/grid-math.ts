export interface Point {
  x: number;
  y: number;
}

export interface Zone16 {
  name: string;
  startAngle: number;
  endAngle: number;
  color: string;
  element: string;
  description: string;
  attributes: string[];
}

export const ZONES_16: Zone16[] = [
  { name: 'N', startAngle: 348.75, endAngle: 11.25, color: 'rgba(0, 0, 255, 0.1)', element: 'Water', description: 'Money & Opportunities', attributes: ['Kuber', 'Wealth'] },
  { name: 'NNE', startAngle: 11.25, endAngle: 33.75, color: 'rgba(0, 100, 255, 0.1)', element: 'Water', description: 'Health & Immunity', attributes: ['Dhanvantari', 'Health'] },
  { name: 'NE', startAngle: 33.75, endAngle: 56.25, color: 'rgba(0, 200, 255, 0.1)', element: 'Water', description: 'Clarity & Mind', attributes: ['Shiva', 'Vision'] },
  { name: 'ENE', startAngle: 56.25, endAngle: 78.75, color: 'rgba(0, 255, 200, 0.1)', element: 'Air', description: 'Fun & Recreation', attributes: ['Parjanya', 'Joy'] },
  { name: 'E', startAngle: 78.75, endAngle: 101.25, color: 'rgba(0, 255, 0, 0.1)', element: 'Air', description: 'Social Connections', attributes: ['Surya', 'Network'] },
  { name: 'ESE', startAngle: 101.25, endAngle: 123.75, color: 'rgba(100, 255, 0, 0.1)', element: 'Air', description: 'Anxiety & Churning', attributes: ['Aryama', 'Analysis'] },
  { name: 'SE', startAngle: 123.75, endAngle: 146.25, color: 'rgba(200, 255, 0, 0.1)', element: 'Fire', description: 'Cash & Liquidity', attributes: ['Agni', 'Cash'] },
  { name: 'SSE', startAngle: 146.25, endAngle: 168.75, color: 'rgba(255, 200, 0, 0.1)', element: 'Fire', description: 'Power & Confidence', attributes: ['Pushan', 'Strength'] },
  { name: 'S', startAngle: 168.75, endAngle: 191.25, color: 'rgba(255, 0, 0, 0.1)', element: 'Fire', description: 'Fame & Recognition', attributes: ['Yama', 'Fame'] },
  { name: 'SSW', startAngle: 191.25, endAngle: 213.75, color: 'rgba(255, 100, 100, 0.1)', element: 'Earth', description: 'Disposal & Expenditure', attributes: ['Gandharva', 'Waste'] },
  { name: 'SW', startAngle: 213.75, endAngle: 236.25, color: 'rgba(200, 100, 0, 0.1)', element: 'Earth', description: 'Relationships & Skills', attributes: ['Pitra', 'Skills'] },
  { name: 'WSW', startAngle: 236.25, endAngle: 258.75, color: 'rgba(200, 200, 200, 0.1)', element: 'Space', description: 'Education & Savings', attributes: ['Vidya', 'Knowledge'] },
  { name: 'W', startAngle: 258.75, endAngle: 281.25, color: 'rgba(150, 150, 150, 0.1)', element: 'Space', description: 'Gains & Profits', attributes: ['Varun', 'Gains'] },
  { name: 'WNW', startAngle: 281.25, endAngle: 303.75, color: 'rgba(100, 100, 100, 0.1)', element: 'Space', description: 'Depression & Detox', attributes: ['Asura', 'Detox'] },
  { name: 'NW', startAngle: 303.75, endAngle: 326.25, color: 'rgba(200, 200, 255, 0.1)', element: 'Space', description: 'Support & Banking', attributes: ['Vayu', 'Support'] },
  { name: 'NNW', startAngle: 326.25, endAngle: 348.75, color: 'rgba(100, 100, 255, 0.1)', element: 'Water', description: 'Attraction & Sex', attributes: ['Naga', 'Attraction'] },
];

export interface GridWedge {
  rotation: number;
  angle: number;
  color: string;
  name: string;
  labelRadius: number;
  element?: string;
  description?: string;
  attributes?: string[];
}

export function get16ZoneWedges(radius: number): GridWedge[] {
  // Each zone is 22.5 degrees
  
  return ZONES_16.map(zone => {
    // Zone N is centered at 0 degrees (North).
    // In Konva, 0 is East. North is -90.
    // So we shift our "North-relative" angles by -90.
    
    // However, we will rotate the entire Group by the northOrientation.
    // So here we just define the wedges relative to "Up is North".
    
    // N zone (0 deg) starts at -11.25 and ends at 11.25.
    // In Konva (0=East), Up is -90.
    // So N zone center is -90.
    // Start is -90 - 11.25 = -101.25.
    
    // Let's map the ZONES_16 startAngle (which assumes 0=N, clockwise) to Konva.
    // 0 (N) -> -90
    // 90 (E) -> 0
    // 180 (S) -> 90
    // 270 (W) -> 180
    
    // Konva Angle = Vastu Angle - 90
    
    const rotation = zone.startAngle - 90;
    
    return {
      rotation: rotation,
      angle: 22.5,
      color: zone.color,
      name: zone.name,
      labelRadius: radius * 0.8,
      element: zone.element,
      description: zone.description,
      attributes: zone.attributes
    };
  });
}
export interface Zone32 {
  name: string;
  startAngle: number;
  endAngle: number;
  color: string;
  description: string;
}

export const ZONES_32: Zone32[] = [
  // North (N4, N5 are main)
  { name: 'N1', startAngle: 326.25, endAngle: 337.5, color: '#e0e0e0', description: 'Unfavorable' },
  { name: 'N2', startAngle: 337.5, endAngle: 348.75, color: '#e0e0e0', description: 'Unfavorable' },
  { name: 'N3', startAngle: 348.75, endAngle: 360, color: '#4caf50', description: 'Mukhya - Main Entrance' },
  { name: 'N4', startAngle: 0, endAngle: 11.25, color: '#4caf50', description: 'Bhallat - Abundance' },
  { name: 'N5', startAngle: 11.25, endAngle: 22.5, color: '#e0e0e0', description: 'Unfavorable' },
  { name: 'N6', startAngle: 22.5, endAngle: 33.75, color: '#e0e0e0', description: 'Unfavorable' },
  { name: 'N7', startAngle: 33.75, endAngle: 45, color: '#e0e0e0', description: 'Unfavorable' },
  { name: 'N8', startAngle: 45, endAngle: 56.25, color: '#e0e0e0', description: 'Unfavorable' },

  // East (E3, E4 are main)
  { name: 'E1', startAngle: 56.25, endAngle: 67.5, color: '#e0e0e0', description: 'Unfavorable' },
  { name: 'E2', startAngle: 67.5, endAngle: 78.75, color: '#e0e0e0', description: 'Unfavorable' },
  { name: 'E3', startAngle: 78.75, endAngle: 90, color: '#4caf50', description: 'Jayant - Victory' },
  { name: 'E4', startAngle: 90, endAngle: 101.25, color: '#4caf50', description: 'Indra - Power' },
  { name: 'E5', startAngle: 101.25, endAngle: 112.5, color: '#e0e0e0', description: 'Unfavorable' },
  { name: 'E6', startAngle: 112.5, endAngle: 123.75, color: '#e0e0e0', description: 'Unfavorable' },
  { name: 'E7', startAngle: 123.75, endAngle: 135, color: '#e0e0e0', description: 'Unfavorable' },
  { name: 'E8', startAngle: 135, endAngle: 146.25, color: '#e0e0e0', description: 'Unfavorable' },

  // South (S3, S4 are main)
  { name: 'S1', startAngle: 146.25, endAngle: 157.5, color: '#e0e0e0', description: 'Unfavorable' },
  { name: 'S2', startAngle: 157.5, endAngle: 168.75, color: '#e0e0e0', description: 'Unfavorable' },
  { name: 'S3', startAngle: 168.75, endAngle: 180, color: '#4caf50', description: 'Vitatha - Falsehood' },
  { name: 'S4', startAngle: 180, endAngle: 191.25, color: '#4caf50', description: 'Gruhakshat - Bonding' },
  { name: 'S5', startAngle: 191.25, endAngle: 202.5, color: '#e0e0e0', description: 'Unfavorable' },
  { name: 'S6', startAngle: 202.5, endAngle: 213.75, color: '#e0e0e0', description: 'Unfavorable' },
  { name: 'S7', startAngle: 213.75, endAngle: 225, color: '#e0e0e0', description: 'Unfavorable' },
  { name: 'S8', startAngle: 225, endAngle: 236.25, color: '#e0e0e0', description: 'Unfavorable' },

  // West (W3, W4 are main)
  { name: 'W1', startAngle: 236.25, endAngle: 247.5, color: '#e0e0e0', description: 'Unfavorable' },
  { name: 'W2', startAngle: 247.5, endAngle: 258.75, color: '#e0e0e0', description: 'Unfavorable' },
  { name: 'W3', startAngle: 258.75, endAngle: 270, color: '#4caf50', description: 'Sugriva - Knowledge' },
  { name: 'W4', startAngle: 270, endAngle: 281.25, color: '#4caf50', description: 'Pushpadanta - Assistant' },
  { name: 'W5', startAngle: 281.25, endAngle: 292.5, color: '#e0e0e0', description: 'Unfavorable' },
  { name: 'W6', startAngle: 292.5, endAngle: 303.75, color: '#e0e0e0', description: 'Unfavorable' },
  { name: 'W7', startAngle: 303.75, endAngle: 315, color: '#e0e0e0', description: 'Unfavorable' },
  { name: 'W8', startAngle: 315, endAngle: 326.25, color: '#e0e0e0', description: 'Unfavorable' },
];

export function get32DoorWedges(radius: number): GridWedge[] {
  return ZONES_32.map(zone => {
    const rotation = zone.startAngle - 90;
    return {
      rotation: rotation,
      angle: 11.25,
      color: zone.color,
      name: zone.name,
      labelRadius: radius * 0.95, // Slightly further out
      description: zone.description
    };
  });
}

export function getPolygonCentroid(points: Point[]): Point {
  let signedArea = 0;
  let cx = 0;
  let cy = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const x0 = points[i].x;
    const y0 = points[i].y;
    const x1 = points[(i + 1) % n].x;
    const y1 = points[(i + 1) % n].y;
    
    const a = x0 * y1 - x1 * y0;
    signedArea += a;
    cx += (x0 + x1) * a;
    cy += (y0 + y1) * a;
  }

  signedArea *= 0.5;
  cx /= (6 * signedArea);
  cy /= (6 * signedArea);

  return { x: cx, y: cy };
}

export function getPolygonBounds(points: Point[]): { minX: number, maxX: number, minY: number, maxY: number, width: number, height: number } {
  if (points.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0 };
  
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  points.forEach(p => {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  });

  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  };
}

export interface GridLine {
  points: number[];
  stroke: string;
  strokeWidth: number;
}

export function getSquareGrid(bounds: { minX: number, maxX: number, minY: number, maxY: number, width: number, height: number }, divisions: number): GridLine[] {
  const lines: GridLine[] = [];
  const stepX = bounds.width / divisions;
  const stepY = bounds.height / divisions;

  // Vertical lines
  for (let i = 0; i <= divisions; i++) {
    const x = bounds.minX + i * stepX;
    lines.push({
      points: [x, bounds.minY, x, bounds.maxY],
      stroke: 'rgba(0, 0, 0, 0.2)',
      strokeWidth: 1
    });
  }

  // Horizontal lines
  for (let i = 0; i <= divisions; i++) {
    const y = bounds.minY + i * stepY;
    lines.push({
      points: [bounds.minX, y, bounds.maxX, y],
      stroke: 'rgba(0, 0, 0, 0.2)',
      strokeWidth: 1
    });
  }

  return lines;
}
