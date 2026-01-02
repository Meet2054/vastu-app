/**
 * Advance Marma Analysis
 * 
 * Marma points are sensitive energy junctions. Construction or heavy load 
 * on these points creates disturbances.
 */

import { Point, BoundingBox, MarmaPoint, AnalysisResult } from './types';

// Predefined Marma points based on traditional Vastu texts
// These are defined in polar coordinates (angle from North, distance from center)
const MARMA_POINTS_DEFINITION = [
  // Critical Marma Points (A1-A6 visible in the image)
  { id: 'A1', name: 'Brahma Marma', angle: 45, distance: 0.7, severity: 'critical' as const },
  { id: 'A2', name: 'Isha Marma', angle: 22.5, distance: 0.75, severity: 'critical' as const },
  { id: 'A3', name: 'Parjanya Marma', angle: 0, distance: 0.8, severity: 'critical' as const },
  { id: 'A4', name: 'Jayanta Marma', angle: 337.5, distance: 0.75, severity: 'critical' as const },
  { id: 'A5', name: 'Mahendra Marma', angle: 315, distance: 0.7, severity: 'critical' as const },
  { id: 'A6', name: 'Satya Marma', angle: 225, distance: 0.7, severity: 'critical' as const },
  
  // High Severity Marma Points
  { id: 'M1', name: 'Aditya Marma', angle: 90, distance: 0.85, severity: 'high' as const },
  { id: 'M2', name: 'Vivasvan Marma', angle: 67.5, distance: 0.78, severity: 'high' as const },
  { id: 'M3', name: 'Mitra Marma', angle: 112.5, distance: 0.78, severity: 'high' as const },
  { id: 'M4', name: 'Rudra Marma', angle: 135, distance: 0.72, severity: 'high' as const },
  { id: 'M5', name: 'Pitru Marma', angle: 180, distance: 0.75, severity: 'high' as const },
  { id: 'M6', name: 'Dauvarika Marma', angle: 202.5, distance: 0.73, severity: 'high' as const },
  { id: 'M7', name: 'Sugriva Marma', angle: 247.5, distance: 0.73, severity: 'high' as const },
  { id: 'M8', name: 'Pushpadanta Marma', angle: 270, distance: 0.85, severity: 'high' as const },
  { id: 'M9', name: 'Varuna Marma', angle: 292.5, distance: 0.78, severity: 'high' as const },
  
  // Medium Severity Marma Points (inner ring)
  { id: 'I1', name: 'Antriksha Marma', angle: 0, distance: 0.5, severity: 'medium' as const },
  { id: 'I2', name: 'Agni Marma', angle: 45, distance: 0.45, severity: 'medium' as const },
  { id: 'I3', name: 'Vayu Marma', angle: 90, distance: 0.5, severity: 'medium' as const },
  { id: 'I4', name: 'Naga Marma', angle: 135, distance: 0.45, severity: 'medium' as const },
  { id: 'I5', name: 'Yama Marma', angle: 180, distance: 0.5, severity: 'medium' as const },
  { id: 'I6', name: 'Asura Marma', angle: 225, distance: 0.45, severity: 'medium' as const },
  { id: 'I7', name: 'Shosha Marma', angle: 270, distance: 0.5, severity: 'medium' as const },
  { id: 'I8', name: 'Soma Marma', angle: 315, distance: 0.45, severity: 'medium' as const },
  
  // Low Severity Marma Points (close to center)
  { id: 'C1', name: 'Brahma Central', angle: 0, distance: 0.2, severity: 'low' as const },
  { id: 'C2', name: 'Vishnu Marma', angle: 90, distance: 0.2, severity: 'low' as const },
  { id: 'C3', name: 'Shiva Marma', angle: 180, distance: 0.2, severity: 'low' as const },
  { id: 'C4', name: 'Shakti Marma', angle: 270, distance: 0.2, severity: 'low' as const }
];

export interface AdvanceMarmaOptions {
  northRotation?: number; // Rotation offset to align to true North (degrees)
  affectedDistance?: number; // Distance in pixels to consider a marma "affected" by construction
  checkWalls?: boolean;
  checkToilets?: boolean;
  checkPillars?: boolean;
  checkStairs?: boolean;
}

export interface AdvanceMarmaResult extends AnalysisResult {
  type: 'advance-marma';
  data: {
    marmaPoints: MarmaPoint[];
    affectedPoints: MarmaPoint[];
    safePoints: MarmaPoint[];
    totalSeverityScore: number;
    criticalAffected: number;
    highAffected: number;
    mediumAffected: number;
    lowAffected: number;
    recommendations: string[];
  };
}

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
 * Convert polar coordinates to cartesian
 */
function polarToCartesian(
  centerX: number,
  centerY: number,
  angle: number,
  distance: number,
  radius: number,
  northRotation: number
): Point {
  // Adjust angle for North rotation
  const adjustedAngle = (angle + northRotation) * (Math.PI / 180);
  
  // Convert to cartesian (angle 0° = North = -Y direction)
  const x = centerX + radius * distance * Math.sin(adjustedAngle);
  const y = centerY - radius * distance * Math.cos(adjustedAngle);
  
  return { x, y };
}

/**
 * Check if a point is near the boundary (indicating wall/construction)
 */
function isNearBoundary(
  point: Point,
  boundaryPoints: Point[],
  threshold: number
): boolean {
  // Check distance to each boundary segment
  for (let i = 0; i < boundaryPoints.length; i++) {
    const p1 = boundaryPoints[i];
    const p2 = boundaryPoints[(i + 1) % boundaryPoints.length];
    
    const distance = distanceToSegment(point, p1, p2);
    if (distance < threshold) {
      return true;
    }
  }
  
  return false;
}

/**
 * Calculate distance from point to line segment
 */
function distanceToSegment(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  const l2 = dx * dx + dy * dy;
  
  if (l2 === 0) {
    return Math.sqrt((point.x - lineStart.x) ** 2 + (point.y - lineStart.y) ** 2);
  }
  
  let t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  
  const projX = lineStart.x + t * dx;
  const projY = lineStart.y + t * dy;
  
  return Math.sqrt((point.x - projX) ** 2 + (point.y - projY) ** 2);
}

/**
 * Check if a point is inside the plot boundary
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
 * Calculate severity score for a marma point
 */
function calculateSeverityScore(
  marmaPoint: MarmaPoint,
  affectedBy: string[]
): number {
  const severityWeights = {
    critical: 100,
    high: 75,
    medium: 50,
    low: 25
  };
  
  const affectTypeWeights = {
    toilet: 1.5,
    stairs: 1.3,
    pillar: 1.2,
    wall: 1.0
  };
  
  let baseScore = severityWeights[marmaPoint.severity];
  
  // Apply multipliers based on what's affecting it
  for (const type of affectedBy) {
    const weight = affectTypeWeights[type as keyof typeof affectTypeWeights] || 1.0;
    baseScore *= weight;
  }
  
  return Math.min(100, baseScore);
}

/**
 * Generate Advance Marma analysis
 */
export function generateAdvanceMarma(
  boundaryPoints: Point[],
  options: AdvanceMarmaOptions = {}
): AdvanceMarmaResult {
  const {
    northRotation = 0,
    affectedDistance = 20, // pixels
    checkWalls = true,

  } = options;
  
  if (boundaryPoints.length < 3) {
    throw new Error('At least 3 boundary points required');
  }
  
  const bbox = calculateBoundingBox(boundaryPoints);
  const radius = Math.min(bbox.width, bbox.height) / 2;
  
  const marmaPoints: MarmaPoint[] = [];
  const affectedPoints: MarmaPoint[] = [];
  const safePoints: MarmaPoint[] = [];
  
  // Calculate cartesian coordinates for each marma point
  for (const def of MARMA_POINTS_DEFINITION) {
    const { x, y } = polarToCartesian(
      bbox.centerX,
      bbox.centerY,
      def.angle,
      def.distance,
      radius,
      northRotation
    );
    
    // Check if point is affected by construction
    const affectedBy: string[] = [];
    
    if (checkWalls && isNearBoundary({ x, y }, boundaryPoints, affectedDistance)) {
      affectedBy.push('wall');
    }
    
    // Note: For toilet, pillar, stairs detection, we would need additional data
    // For now, we'll just check if the point is inside or near the boundary
    const isInside = isPointInPolygon({ x, y }, boundaryPoints);
    const isNearWall = isNearBoundary({ x, y }, boundaryPoints, affectedDistance);
    
    const isAffected = affectedBy.length > 0 || (isInside && isNearWall);
    const severityScore = isAffected 
      ? calculateSeverityScore({ ...def, x, y, isAffected, severityScore: 0 }, affectedBy)
      : 0;
    
    const marmaPoint: MarmaPoint = {
      id: def.id,
      name: def.name,
      angle: def.angle,
      distance: def.distance,
      x,
      y,
      severity: def.severity,
      isAffected,
      affectedBy: affectedBy.length > 0 ? affectedBy : undefined,
      severityScore
    };
    
    marmaPoints.push(marmaPoint);
    
    if (isAffected) {
      affectedPoints.push(marmaPoint);
    } else {
      safePoints.push(marmaPoint);
    }
  }
  
  // Calculate statistics
  const criticalAffected = affectedPoints.filter(p => p.severity === 'critical').length;
  const highAffected = affectedPoints.filter(p => p.severity === 'high').length;
  const mediumAffected = affectedPoints.filter(p => p.severity === 'medium').length;
  const lowAffected = affectedPoints.filter(p => p.severity === 'low').length;
  
  const totalSeverityScore = affectedPoints.reduce((sum, p) => sum + p.severityScore, 0);
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (criticalAffected > 0) {
    recommendations.push(
      `⚠️ CRITICAL: ${criticalAffected} critical marma point(s) are affected. ` +
      `Immediate remedial action required. Consider relocating heavy structures, ` +
      `toilets, or stairs from these points.`
    );
  }
  
  if (highAffected > 0) {
    recommendations.push(
      `⚠️ HIGH: ${highAffected} high severity marma point(s) are affected. ` +
      `These should be addressed during renovation or construction planning.`
    );
  }
  
  if (mediumAffected > 0) {
    recommendations.push(
      `⚠️ MEDIUM: ${mediumAffected} medium severity marma point(s) are affected. ` +
      `Consider using Vastu remedies such as pyramids, crystals, or specific colors.`
    );
  }
  
  if (affectedPoints.length === 0) {
    recommendations.push(
      `✅ All marma points are safe. The plot has good energy flow without major obstructions.`
    );
  }
  
  // Add specific recommendations for affected critical points
  for (const point of affectedPoints.filter(p => p.severity === 'critical')) {
    recommendations.push(
      `• ${point.name} (${point.id}): Avoid placing toilets, heavy pillars, or stairs. ` +
      `This is a major energy junction that should remain clear.`
    );
  }
  
  return {
    type: 'advance-marma',
    timestamp: new Date(),
    boundaryPoints,
    data: {
      marmaPoints,
      affectedPoints,
      safePoints,
      totalSeverityScore,
      criticalAffected,
      highAffected,
      mediumAffected,
      lowAffected,
      recommendations
    }
  };
}
