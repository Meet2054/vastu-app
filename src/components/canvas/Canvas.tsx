import { useRef, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import { useProject } from '../../lib/project-context';
import { GridLayer } from './GridLayer';
import { BoundaryLayer } from './BoundaryLayer';
import Konva from 'konva';

interface CanvasProps {
  width: number;
  height: number;
  onCellClick?: (data: any) => void;
}

const URLImage = ({ src, x, y, rotation }: { src: string, x: number, y: number, rotation: number }) => {
  const [image] = useImage(src);
  return (
    <KonvaImage
      image={image}
      x={x}
      y={y}
      offsetX={image ? image.width / 2 : 0}
      offsetY={image ? image.height / 2 : 0}
      rotation={rotation}
    />
  );
};

export const Canvas = forwardRef<Konva.Stage, CanvasProps>(({ width, height, onCellClick }, ref) => {
  const { floorplanImage, northOrientation } = useProject();
  const stageRef = useRef<Konva.Stage>(null);

  useImperativeHandle(ref, () => stageRef.current!, []);

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const scaleBy = 1.1;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    stage.position(newPos);
  };

  return (
    <div className="bg-muted/20 w-full h-full overflow-hidden">
      <Stage
        width={width}
        height={height}
        onWheel={handleWheel}
        draggable
        ref={stageRef}
        className="bg-gray-100"
      >
        <Layer>
          {floorplanImage && (
            <URLImage 
              src={floorplanImage} 
              x={width / 2} 
              y={height / 2} 
              rotation={northOrientation}
            />
          )}
        </Layer>
        <Layer>
          <GridLayer width={width} height={height} onCellClick={onCellClick} />
        </Layer>
        <Layer>
          <BoundaryLayer />
        </Layer>
      </Stage>
    </div>
  );
});

Canvas.displayName = 'Canvas';
