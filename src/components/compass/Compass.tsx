import { useState, useRef, useEffect } from 'react';
import { useProject } from '../../lib/project-context';


export function Compass() {
  const { northOrientation, setNorthOrientation } = useProject();
  const [isDragging, setIsDragging] = useState(false);
  const compassRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !compassRef.current) return;

      const rect = compassRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      // Calculate angle in degrees
      // Math.atan2(y, x) returns angle in radians
      // We want 0 degrees to be North (up), which is -90 degrees in standard cartesian
      // So we adjust the calculation
      let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      
      // Convert to 0-360 range where 0 is North (Up)
      // Standard atan2: 0 is Right (East), 90 is Down (South), -90 is Up (North), 180/-180 is Left (West)
      // We want: 0=N, 90=E, 180=S, 270=W
      
      angle = angle + 90; // Rotate so -90 (North) becomes 0
      if (angle < 0) angle += 360;
      
      setNorthOrientation(Math.round(angle));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, setNorthOrientation]);

  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-card rounded-lg border shadow-sm">
      <h3 className="text-sm font-medium">Orientation</h3>
      <div 
        ref={compassRef}
        className="relative w-32 h-32 rounded-full border-2 border-muted flex items-center justify-center cursor-pointer bg-muted/10"
        onMouseDown={handleMouseDown}
      >
        {/* Compass Rose */}
        <div className="absolute inset-0 rounded-full border border-dashed border-muted-foreground/30" />
        
        {/* Cardinal Points */}
        <span className="absolute top-1 text-xs font-bold text-muted-foreground">N</span>
        <span className="absolute right-2 text-xs font-bold text-muted-foreground">E</span>
        <span className="absolute bottom-1 text-xs font-bold text-muted-foreground">S</span>
        <span className="absolute left-2 text-xs font-bold text-muted-foreground">W</span>

        {/* Needle */}
        <div 
          className="absolute w-1 h-16 bg-gradient-to-b from-red-500 to-transparent origin-bottom"
          style={{ 
            transform: `rotate(${northOrientation}deg) translateY(-50%)`,
            height: '50%',
            top: '50%',
            left: 'calc(50% - 2px)',
            transformOrigin: 'bottom center'
          }}
        />
        <div className="w-3 h-3 bg-primary rounded-full z-10" />
      </div>
      <div className="flex items-center gap-2">
        <input 
          type="number" 
          value={northOrientation} 
          onChange={(e) => setNorthOrientation(Number(e.target.value))}
          className="w-16 h-8 text-center text-sm border rounded bg-background"
        />
        <span className="text-xs text-muted-foreground">degrees</span>
      </div>
    </div>
  );
}
