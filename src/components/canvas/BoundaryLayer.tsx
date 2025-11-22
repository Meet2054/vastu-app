import { Line, Circle, Group } from 'react-konva';
import { useProject } from '../../lib/project-context';
import { useState, useEffect } from 'react';

export function BoundaryLayer() {
  const { boundaryPoints, setBoundaryPoints, isEditingBoundary } = useProject();
  // Local state for smooth dragging
  const [localPoints, setLocalPoints] = useState(boundaryPoints);

  useEffect(() => {
    setLocalPoints(boundaryPoints);
  }, [boundaryPoints]);

  const handleDragMove = (index: number) => (e: any) => {
    e.cancelBubble = true;
    const newPoints = [...localPoints];
    newPoints[index] = {
      x: e.target.x(),
      y: e.target.y(),
    };
    setLocalPoints(newPoints);
  };

  const handleDragEnd = (index: number) => (e: any) => {
    e.cancelBubble = true;
    const newPoints = [...localPoints];
    newPoints[index] = {
      x: e.target.x(),
      y: e.target.y(),
    };
    setBoundaryPoints(newPoints);
  };

  const handleLineClick = (e: any) => {
    if (!isEditingBoundary) return;
    
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    const scale = stage.scaleX();
    const stagePos = stage.position();

    // Convert pointer to local coordinates
    const x = (pointer.x - stagePos.x) / scale;
    const y = (pointer.y - stagePos.y) / scale;

    // Find the closest segment to insert the point
    let minDist = Infinity;
    let insertIndex = -1;

    for (let i = 0; i < localPoints.length; i++) {
      const p1 = localPoints[i];
      const p2 = localPoints[(i + 1) % localPoints.length];
      
      // Distance from point to line segment
      const A = x - p1.x;
      const B = y - p1.y;
      const C = p2.x - p1.x;
      const D = p2.y - p1.y;

      const dot = A * C + B * D;
      const lenSq = C * C + D * D;
      let param = -1;
      if (lenSq !== 0) // in case of 0 length line
          param = dot / lenSq;

      let xx, yy;

      if (param < 0) {
        xx = p1.x;
        yy = p1.y;
      }
      else if (param > 1) {
        xx = p2.x;
        yy = p2.y;
      }
      else {
        xx = p1.x + param * C;
        yy = p1.y + param * D;
      }

      const dx = x - xx;
      const dy = y - yy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < minDist) {
        minDist = dist;
        insertIndex = i + 1;
      }
    }

    // Insert point
    const newPoints = [...localPoints];
    newPoints.splice(insertIndex, 0, { x, y });
    setBoundaryPoints(newPoints); // Update global state immediately for clicks
  };

  const handlePointDblClick = (index: number) => (e: any) => {
    if (!isEditingBoundary || localPoints.length <= 3) return; // Keep at least 3 points
    e.cancelBubble = true;
    const newPoints = localPoints.filter((_, i) => i !== index);
    setBoundaryPoints(newPoints); // Update global state immediately
  };

  if (!localPoints || localPoints.length === 0) return null;

  // Close the loop for rendering the line
  const flattenedPoints = localPoints.flatMap(p => [p.x, p.y]);
  
  return (
    <Group>
      {/* The Polygon Line */}
      <Line
        points={[...flattenedPoints, localPoints[0].x, localPoints[0].y]}
        stroke="#ef4444" // Red-500
        strokeWidth={2}
        closed
        dash={[10, 5]}
        fill="rgba(239, 68, 68, 0.1)"
        onClick={handleLineClick}
        onMouseEnter={(e) => {
          if (isEditingBoundary) {
            const container = e.target.getStage()?.container();
            if (container) container.style.cursor = 'crosshair';
          }
        }}
        onMouseLeave={(e) => {
          const container = e.target.getStage()?.container();
          if (container) container.style.cursor = 'default';
        }}
      />

      {/* Editable Handles */}
      {isEditingBoundary && localPoints.map((point, i) => (
        <Circle
          key={i}
          x={point.x}
          y={point.y}
          radius={6}
          fill="white"
          stroke="#ef4444"
          strokeWidth={2}
          draggable
          onDragMove={handleDragMove(i)}
          onDragEnd={handleDragEnd(i)}
          onDblClick={handlePointDblClick(i)}
          onMouseEnter={(e) => {
            const container = e.target.getStage()?.container();
            if (container) container.style.cursor = 'move';
          }}
          onMouseLeave={(e) => {
            const container = e.target.getStage()?.container();
            if (container) container.style.cursor = 'default';
          }}
        />
      ))}
    </Group>
  );
}
