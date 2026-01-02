/**
 * Merma Analysis
 * 
 * Detailed numbered energy node system for Vastu analysis.
 * Identifies critical energy junctions and their interactions with building boundaries.
 * 
 * Features:
 * - 40 numbered energy nodes at specific locations
 * - Node collision detection with boundary points
 * - Severity weighting based on node rank (lower numbers = higher criticality)
 * - Critical node warnings and recommendations
 */

import { Point, BoundingBox, AnalysisResult } from './types';

/**
 * Merma node definition with position and properties
 */
export interface MermaNode {
  number: number;           // Node number (1-40)
  name: string;            // Traditional name of the node
  angle: number;           // Angle in degrees (0° = North)
  distance: number;        // Distance from center as percentage of radius (0-100)
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;        // Node category (Core/Inner/Middle/Outer)
  energyType: string;      // Type of energy at this node
}

/**
 * Node collision information
 */
export interface NodeCollision {
  node: MermaNode;
  distanceToNearestBoundary: number;
  isViolated: boolean;
  severity: 'critical' | 'high' | 'medium' | 'low';
  affectedArea: string;
  recommendation: string;
}

/**
 * Merma analysis result
 */
export interface MermaAnalysisResult extends AnalysisResult {
  recommendations: string[];
  data: {
    nodes: MermaNode[];
    nodePositions: Array<{
      node: MermaNode;
      cartesian: Point;
    }>;
    collisions: NodeCollision[];
    criticalWarnings: NodeCollision[];
    nodeRankScore: number;       // Score based on which nodes are violated (0-100)
    overallSeverity: 'critical' | 'high' | 'medium' | 'low' | 'good';
    affectedEnergyTypes: string[];
    summary: {
      totalNodes: number;
      violatedNodes: number;
      criticalNodes: number;
      highNodes: number;
      mediumNodes: number;
      lowNodes: number;
    };
  };
}

/**
 * Complete Merma node definitions (1-40)
 * Based on traditional Vastu energy junction system
 */
const MERMA_NODES: MermaNode[] = [
  // Core Nodes (1-5) - Most Critical
  { number: 1, name: 'Brahma Bindu', angle: 0, distance: 0, severity: 'critical', category: 'Core', energyType: 'Divine Source' },
  { number: 2, name: 'Pranic Core', angle: 45, distance: 15, severity: 'critical', category: 'Core', energyType: 'Life Force' },
  { number: 3, name: 'Agni Kendra', angle: 135, distance: 15, severity: 'critical', category: 'Core', energyType: 'Fire Energy' },
  { number: 4, name: 'Vayu Kendra', angle: 90, distance: 15, severity: 'critical', category: 'Core', energyType: 'Air Energy' },
  { number: 5, name: 'Jala Kendra', angle: 0, distance: 15, severity: 'critical', category: 'Core', energyType: 'Water Energy' },

  // Inner Ring Nodes (6-15) - High Priority
  { number: 6, name: 'Soma', angle: 180, distance: 30, severity: 'high', category: 'Inner', energyType: 'Cooling Energy' },
  { number: 7, name: 'Bhujanga', angle: 225, distance: 30, severity: 'high', category: 'Inner', energyType: 'Serpent Energy' },
  { number: 8, name: 'Mukhya', angle: 270, distance: 30, severity: 'high', category: 'Inner', energyType: 'Principal Energy' },
  { number: 9, name: 'Pushpa', angle: 90, distance: 30, severity: 'high', category: 'Inner', energyType: 'Flowering Energy' },
  { number: 10, name: 'Graha', angle: 135, distance: 30, severity: 'high', category: 'Inner', energyType: 'Planetary Energy' },
  { number: 11, name: 'Yama', angle: 180, distance: 25, severity: 'high', category: 'Inner', energyType: 'Time Energy' },
  { number: 12, name: 'Gandharva', angle: 135, distance: 25, severity: 'high', category: 'Inner', energyType: 'Celestial Energy' },
  { number: 13, name: 'Mridu', angle: 45, distance: 25, severity: 'high', category: 'Inner', energyType: 'Soft Energy' },
  { number: 14, name: 'Rudra', angle: 270, distance: 25, severity: 'high', category: 'Inner', energyType: 'Fierce Energy' },
  { number: 15, name: 'Pitru', angle: 225, distance: 25, severity: 'high', category: 'Inner', energyType: 'Ancestral Energy' },

  // Middle Ring Nodes (16-27) - Medium Priority
  { number: 16, name: 'Aryama', angle: 0, distance: 50, severity: 'medium', category: 'Middle', energyType: 'Honor Energy' },
  { number: 17, name: 'Savitra', angle: 22.5, distance: 50, severity: 'medium', category: 'Middle', energyType: 'Solar Energy' },
  { number: 18, name: 'Indra', angle: 67.5, distance: 50, severity: 'medium', category: 'Middle', energyType: 'Royal Energy' },
  { number: 19, name: 'Agni', angle: 112.5, distance: 50, severity: 'medium', category: 'Middle', energyType: 'Fire Lord' },
  { number: 20, name: 'Yaksma', angle: 157.5, distance: 50, severity: 'medium', category: 'Middle', energyType: 'Disease Ward' },
  { number: 21, name: 'Asura', angle: 202.5, distance: 50, severity: 'medium', category: 'Middle', energyType: 'Negative Force' },
  { number: 22, name: 'Nairritya', angle: 225, distance: 50, severity: 'medium', category: 'Middle', energyType: 'Chaos Energy' },
  { number: 23, name: 'Varuna', angle: 270, distance: 50, severity: 'medium', category: 'Middle', energyType: 'Water Lord' },
  { number: 24, name: 'Vasu', angle: 315, distance: 50, severity: 'medium', category: 'Middle', energyType: 'Wealth Energy' },
  { number: 25, name: 'Aditi', angle: 45, distance: 45, severity: 'medium', category: 'Middle', energyType: 'Mother Energy' },
  { number: 26, name: 'Diti', angle: 135, distance: 45, severity: 'medium', category: 'Middle', energyType: 'Bound Energy' },
  { number: 27, name: 'Bhumi', angle: 180, distance: 45, severity: 'medium', category: 'Middle', energyType: 'Earth Energy' },

  // Outer Ring Nodes (28-40) - Low Priority
  { number: 28, name: 'Akasha', angle: 0, distance: 75, severity: 'low', category: 'Outer', energyType: 'Space Energy' },
  { number: 29, name: 'Marut', angle: 30, distance: 75, severity: 'low', category: 'Outer', energyType: 'Wind Energy' },
  { number: 30, name: 'Surya', angle: 60, distance: 75, severity: 'low', category: 'Outer', energyType: 'Sun Energy' },
  { number: 31, name: 'Satya', angle: 90, distance: 75, severity: 'low', category: 'Outer', energyType: 'Truth Energy' },
  { number: 32, name: 'Bhasa', angle: 120, distance: 75, severity: 'low', category: 'Outer', energyType: 'Light Energy' },
  { number: 33, name: 'Jaya', angle: 150, distance: 75, severity: 'low', category: 'Outer', energyType: 'Victory Energy' },
  { number: 34, name: 'Mritu', angle: 180, distance: 75, severity: 'low', category: 'Outer', energyType: 'Death Energy' },
  { number: 35, name: 'Roga', angle: 210, distance: 75, severity: 'low', category: 'Outer', energyType: 'Illness Ward' },
  { number: 36, name: 'Rajah', angle: 240, distance: 75, severity: 'low', category: 'Outer', energyType: 'Passion Energy' },
  { number: 37, name: 'Soma Dhara', angle: 270, distance: 75, severity: 'low', category: 'Outer', energyType: 'Nectar Flow' },
  { number: 38, name: 'Chandra', angle: 300, distance: 75, severity: 'low', category: 'Outer', energyType: 'Moon Energy' },
  { number: 39, name: 'Punya', angle: 330, distance: 75, severity: 'low', category: 'Outer', energyType: 'Merit Energy' },
  { number: 40, name: 'Artha', angle: 15, distance: 80, severity: 'low', category: 'Outer', energyType: 'Wealth Flow' },
];

/**
 * Severity weights for node rank calculation
 */
const SEVERITY_WEIGHTS = {
  critical: 10,
  high: 5,
  medium: 2,
  low: 1,
};

/**
 * Collision threshold in percentage of space
 */
const COLLISION_THRESHOLD = 5; // 5% of space dimension

/**
 * Options for Merma analysis
 */
export interface MermaAnalysisOptions {
  northRotation?: number;          // Rotation offset in degrees
  collisionThreshold?: number;     // Custom collision threshold percentage
  includeAllNodes?: boolean;       // Include all 40 nodes or only major ones
}

/**
 * Calculate bounding box from boundary points
 */
function calculateBoundingBox(points: Point[]): BoundingBox {
  if (points.length === 0) {
    return {
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0,
      width: 0,
      height: 0,
      centerX: 0,
      centerY: 0,
    };
  }

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
    centerY: (minY + maxY) / 2,
  };
}

/**
 * Convert polar coordinates to cartesian
 */
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
  distancePercentage: number
): Point {
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  const distance = (radius * distancePercentage) / 100;

  return {
    x: centerX + distance * Math.sin(angleInRadians),
    y: centerY - distance * Math.cos(angleInRadians),
  };
}

/**
 * Calculate minimum distance from point to polygon boundary
 */
function distanceToPolygon(point: Point, polygon: Point[]): number {
  if (polygon.length < 2) return Infinity;

  let minDistance = Infinity;

  for (let i = 0; i < polygon.length; i++) {
    const p1 = polygon[i];
    const p2 = polygon[(i + 1) % polygon.length];

    const distance = distanceToLineSegment(point, p1, p2);
    minDistance = Math.min(minDistance, distance);
  }

  return minDistance;
}

/**
 * Calculate distance from point to line segment
 */
function distanceToLineSegment(point: Point, lineStart: Point, lineEnd: Point): number {
  const { x, y } = point;
  const { x: x1, y: y1 } = lineStart;
  const { x: x2, y: y2 } = lineEnd;

  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;

  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;

  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if point is near or inside boundary
 */
function isPointNearBoundary(
  point: Point,
  boundary: Point[],
  threshold: number
): boolean {
  const distance = distanceToPolygon(point, boundary);
  return distance <= threshold;
}

/**
 * Get direction label from angle
 */
function getDirectionFromAngle(angle: number): string {
  const normalized = ((angle % 360) + 360) % 360;
  
  if (normalized < 11.25 || normalized >= 348.75) return 'N';
  if (normalized >= 11.25 && normalized < 33.75) return 'NNE';
  if (normalized >= 33.75 && normalized < 56.25) return 'NE';
  if (normalized >= 56.25 && normalized < 78.75) return 'ENE';
  if (normalized >= 78.75 && normalized < 101.25) return 'E';
  if (normalized >= 101.25 && normalized < 123.75) return 'ESE';
  if (normalized >= 123.75 && normalized < 146.25) return 'SE';
  if (normalized >= 146.25 && normalized < 168.75) return 'SSE';
  if (normalized >= 168.75 && normalized < 191.25) return 'S';
  if (normalized >= 191.25 && normalized < 213.75) return 'SSW';
  if (normalized >= 213.75 && normalized < 236.25) return 'SW';
  if (normalized >= 236.25 && normalized < 258.75) return 'WSW';
  if (normalized >= 258.75 && normalized < 281.25) return 'W';
  if (normalized >= 281.25 && normalized < 303.75) return 'WNW';
  if (normalized >= 303.75 && normalized < 326.25) return 'NW';
  return 'NNW';
}

/**
 * Generate recommendations for node collision
 */
function getNodeRecommendations(collision: NodeCollision): string[] {
  const recommendations: string[] = [];
  const { node, severity } = collision;

  switch (severity) {
    case 'critical':
      recommendations.push(
        `URGENT: Node ${node.number} (${node.name}) is critically affected. Immediate remedial action required.`
      );
      recommendations.push(
        `Consider relocating heavy structures or openings away from this energy junction.`
      );
      recommendations.push(
        `Perform Vastu remediation rituals for ${node.energyType}.`
      );
      recommendations.push(
        `Install energy balancing elements (pyramids, crystals) at this location.`
      );
      break;

    case 'high':
      recommendations.push(
        `Node ${node.number} (${node.name}) requires attention. Plan remedial measures.`
      );
      recommendations.push(
        `Avoid placing heavy furniture or fixtures at this energy point.`
      );
      recommendations.push(
        `Use appropriate colors and elements to balance ${node.energyType}.`
      );
      break;

    case 'medium':
      recommendations.push(
        `Node ${node.number} (${node.name}) shows minor disturbance. Consider preventive measures.`
      );
      recommendations.push(
        `Maintain cleanliness and positive energy flow in this area.`
      );
      break;

    case 'low':
      recommendations.push(
        `Node ${node.number} (${node.name}) has minimal impact. Regular monitoring suggested.`
      );
      break;
  }

  // Category-specific recommendations
  switch (node.category) {
    case 'Core':
      recommendations.push(
        `This is a core energy node. Keep the area clutter-free and well-ventilated.`
      );
      break;
    case 'Inner':
      recommendations.push(
        `Inner ring nodes affect daily life quality. Ensure proper lighting and air circulation.`
      );
      break;
    case 'Middle':
      recommendations.push(
        `Middle ring nodes influence social and professional aspects. Maintain balance.`
      );
      break;
    case 'Outer':
      recommendations.push(
        `Outer ring nodes affect external relationships. Keep pathways clear.`
      );
      break;
  }

  return recommendations;
}

/**
 * Generate Merma analysis from boundary points
 */
export function generateMerma(
  boundaryPoints: Point[],
  options: MermaAnalysisOptions = {}
): MermaAnalysisResult {
  const {
    northRotation = 0,
    collisionThreshold = COLLISION_THRESHOLD,
    includeAllNodes = true,
  } = options;

  // Calculate bounding box
  const bbox = calculateBoundingBox(boundaryPoints);
  const radius = Math.min(bbox.width, bbox.height) / 2;
  const threshold = (Math.max(bbox.width, bbox.height) * collisionThreshold) / 100;

  // Filter nodes if needed
  const nodesToAnalyze = includeAllNodes 
    ? MERMA_NODES 
    : MERMA_NODES.filter(n => n.severity === 'critical' || n.severity === 'high');

  // Convert nodes to cartesian coordinates
  const nodePositions = nodesToAnalyze.map(node => ({
    node,
    cartesian: polarToCartesian(
      bbox.centerX,
      bbox.centerY,
      radius,
      node.angle + northRotation,
      node.distance
    ),
  }));

  // Detect collisions
  const collisions: NodeCollision[] = [];
  const criticalWarnings: NodeCollision[] = [];

  for (const { node, cartesian } of nodePositions) {
    const distance = distanceToPolygon(cartesian, boundaryPoints);
    const isViolated = isPointNearBoundary(cartesian, boundaryPoints, threshold);

    if (isViolated) {
      const direction = getDirectionFromAngle(node.angle + northRotation);
      
      const collision: NodeCollision = {
        node,
        distanceToNearestBoundary: distance,
        isViolated: true,
        severity: node.severity,
        affectedArea: `${direction} - ${node.category} Ring`,
        recommendation: '', // Will be filled below
      };

      const recommendations = getNodeRecommendations(collision);
      collision.recommendation = recommendations.join(' ');

      collisions.push(collision);

      if (node.severity === 'critical' || node.severity === 'high') {
        criticalWarnings.push(collision);
      }
    }
  }

  // Calculate node rank score
  let totalWeight = 0;
  let violatedWeight = 0;

  for (const node of nodesToAnalyze) {
    const weight = SEVERITY_WEIGHTS[node.severity];
    totalWeight += weight;

    if (collisions.some(c => c.node.number === node.number)) {
      violatedWeight += weight;
    }
  }

  const nodeRankScore = totalWeight > 0 
    ? Math.round(((totalWeight - violatedWeight) / totalWeight) * 100)
    : 100;

  // Determine overall severity
  let overallSeverity: 'critical' | 'high' | 'medium' | 'low' | 'good';
  const criticalCount = collisions.filter(c => c.severity === 'critical').length;
  const highCount = collisions.filter(c => c.severity === 'high').length;

  if (criticalCount >= 3) {
    overallSeverity = 'critical';
  } else if (criticalCount >= 1 || highCount >= 3) {
    overallSeverity = 'high';
  } else if (collisions.length >= 5) {
    overallSeverity = 'medium';
  } else if (collisions.length > 0) {
    overallSeverity = 'low';
  } else {
    overallSeverity = 'good';
  }

  // Get affected energy types
  const affectedEnergyTypes = Array.from(
    new Set(collisions.map(c => c.node.energyType))
  );

  // Create summary
  const summary = {
    totalNodes: nodesToAnalyze.length,
    violatedNodes: collisions.length,
    criticalNodes: collisions.filter(c => c.severity === 'critical').length,
    highNodes: collisions.filter(c => c.severity === 'high').length,
    mediumNodes: collisions.filter(c => c.severity === 'medium').length,
    lowNodes: collisions.filter(c => c.severity === 'low').length,
  };

  // Generate recommendations
  const recommendations: string[] = [];

  if (overallSeverity === 'critical') {
    recommendations.push(
      'CRITICAL: Multiple high-priority energy nodes are compromised. Immediate Vastu remediation required.'
    );
    recommendations.push(
      'Consult a qualified Vastu expert for detailed analysis and corrective measures.'
    );
  } else if (overallSeverity === 'high') {
    recommendations.push(
      'Several important energy nodes are affected. Plan systematic remediation.'
    );
  } else if (overallSeverity === 'medium') {
    recommendations.push(
      'Some energy nodes show disturbance. Consider preventive measures.'
    );
  } else if (overallSeverity === 'low') {
    recommendations.push(
      'Minor node disturbances detected. Regular monitoring recommended.'
    );
  } else {
    recommendations.push(
      'All energy nodes are well-positioned. Maintain current structure.'
    );
  }

  if (criticalWarnings.length > 0) {
    recommendations.push(
      `Priority attention needed for nodes: ${criticalWarnings.map(c => c.node.number).join(', ')}`
    );
  }

  if (affectedEnergyTypes.length > 0) {
    recommendations.push(
      `Affected energy types: ${affectedEnergyTypes.join(', ')}`
    );
  }

  recommendations.push(
    'Use energy balancing techniques: crystals, pyramids, mantras, and proper lighting.'
  );

  recommendations.push(
    `Node Rank Score: ${nodeRankScore}/100 - ${
      nodeRankScore >= 80 ? 'Excellent' :
      nodeRankScore >= 60 ? 'Good' :
      nodeRankScore >= 40 ? 'Fair' : 'Needs Improvement'
    }`
  );

  return {
    type: 'merma',
    timestamp: new Date(),
    boundaryPoints,
    recommendations,
    data: {
      nodes: nodesToAnalyze,
      nodePositions,
      collisions,
      criticalWarnings,
      nodeRankScore,
      overallSeverity,
      affectedEnergyTypes,
      summary,
    },
  };
}

/**
 * Export types and functions
 */
export { MERMA_NODES };
