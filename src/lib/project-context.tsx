import { createContext, useContext, useState, type ReactNode } from 'react';

interface ProjectState {
  projectName: string;
  clientName: string;
  floorplanImage: string | null; // Data URL
  floorplanDimensions: { width: number; height: number };
  northOrientation: number; // Degrees (0-360)
  activeGrids: {
    grid16: boolean;
    grid32: boolean;
    grid64: boolean;
    grid81: boolean;
    devta: boolean;
  };
  boundaryPoints: { x: number; y: number }[];
  isEditingBoundary: boolean;
}

interface ProjectContextType extends ProjectState {
  setProjectName: (name: string) => void;
  setClientName: (name: string) => void;
  setFloorplanImage: (image: string, width: number, height: number) => void;
  setNorthOrientation: (angle: number) => void;
  toggleGrid: (grid: keyof ProjectState['activeGrids']) => void;
  setBoundaryPoints: (points: { x: number; y: number }[]) => void;
  setIsEditingBoundary: (isEditing: boolean) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProjectState>({
    projectName: 'Untitled Project',
    clientName: '',
    floorplanImage: null,
    floorplanDimensions: { width: 0, height: 0 },
    northOrientation: 0,
    activeGrids: {
      grid16: false,
      grid32: false,
      grid64: false,
      grid81: false,
      devta: false,
    },
    boundaryPoints: [],
    isEditingBoundary: false,
  });

  const setProjectName = (name: string) => setState(prev => ({ ...prev, projectName: name }));
  const setClientName = (name: string) => setState(prev => ({ ...prev, clientName: name }));
  
  const setFloorplanImage = (image: string, width: number, height: number) => {
    setState(prev => ({ 
      ...prev, 
      floorplanImage: image,
      floorplanDimensions: { width, height },
      // Reset boundary when new image is uploaded
      boundaryPoints: [
        { x: width * 0.1, y: height * 0.1 },
        { x: width * 0.9, y: height * 0.1 },
        { x: width * 0.9, y: height * 0.9 },
        { x: width * 0.1, y: height * 0.9 },
      ],
      isEditingBoundary: true // Auto-start editing
    }));
  };

  const setNorthOrientation = (angle: number) => setState(prev => ({ ...prev, northOrientation: angle }));

  const toggleGrid = (grid: keyof ProjectState['activeGrids']) => {
    setState(prev => ({
      ...prev,
      activeGrids: { ...prev.activeGrids, [grid]: !prev.activeGrids[grid] }
    }));
  };

  const setBoundaryPoints = (points: { x: number; y: number }[]) => {
    setState(prev => ({ ...prev, boundaryPoints: points }));
  };

  const setIsEditingBoundary = (isEditing: boolean) => {
    setState(prev => ({ ...prev, isEditingBoundary: isEditing }));
  };

  return (
    <ProjectContext.Provider value={{ 
      ...state, 
      setProjectName, 
      setClientName, 
      setFloorplanImage, 
      setNorthOrientation, 
      toggleGrid,
      setBoundaryPoints,
      setIsEditingBoundary
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
