import { X } from 'lucide-react';
import type { GridWedge } from '../../lib/vastu/grid-math';

interface CellInfoPanelProps {
  data: GridWedge | null;
  onClose: () => void;
}

export function CellInfoPanel({ data, onClose }: CellInfoPanelProps) {
  if (!data) return null;

  return (
    <div className="absolute right-4 top-4 w-64 bg-card border rounded-lg shadow-lg p-4 z-50 animate-in fade-in slide-in-from-right-5">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg">{data.name}</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X size={16} />
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        {data.element && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Element:</span>
            <span className="font-medium">{data.element}</span>
          </div>
        )}
        
        {data.description && (
          <div>
            <span className="text-muted-foreground block mb-1">Description:</span>
            <p className="text-foreground">{data.description}</p>
          </div>
        )}

        {data.attributes && data.attributes.length > 0 && (
          <div>
            <span className="text-muted-foreground block mb-1">Attributes:</span>
            <div className="flex flex-wrap gap-1">
              {data.attributes.map((attr, i) => (
                <span key={i} className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs">
                  {attr}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
