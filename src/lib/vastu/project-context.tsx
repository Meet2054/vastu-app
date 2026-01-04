import { createContext, useContext, useState, type ReactNode } from "react";

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
  vastuLayers: {
    mvastuSquareGrid: boolean;
    advanceMarma: boolean;
    shunyabhanti: boolean;
    shubhDwar: boolean;
    vpm: boolean;
    shaktiChakra: boolean;
    mvastuChakra: boolean;
    triDoshaDevision: boolean;
    triGunaDevision: boolean;
    panchtattvaDevision: boolean;
    menna: boolean;
    devtaChinhaAadi: boolean;
    circleGrid: boolean;
    seharumukh: boolean;
    devtaBhojanAadi: boolean;
    devtaKhanj: boolean;
    mahuratVichar: boolean;
    dishaGandh: boolean;
    nineXNineZones: boolean;
    devtaBhojan: boolean;
    nighathuArth: boolean;
    khanjDhatu: boolean;
    devtaNighath: boolean;
    devtaChintha: boolean;
  };
  boundaryPoints: { x: number; y: number }[];
  isEditingBoundary: boolean;
}

interface ProjectContextType extends ProjectState {
  setProjectName: (name: string) => void;
  setClientName: (name: string) => void;
  setFloorplanImage: (image: string, width: number, height: number) => void;
  setNorthOrientation: (angle: number) => void;
  toggleGrid: (grid: keyof ProjectState["activeGrids"]) => void;
  toggleVastuLayer: (layer: keyof ProjectState["vastuLayers"]) => void;
  setBoundaryPoints: (points: { x: number; y: number }[]) => void;
  setIsEditingBoundary: (isEditing: boolean) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProjectState>({
    projectName: "Untitled Project",
    clientName: "",
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
    vastuLayers: {
      mvastuSquareGrid: false,
      advanceMarma: false,
      shunyabhanti: false,
      shubhDwar: false,
      vpm: false,
      shaktiChakra: false,
      mvastuChakra: false,
      triDoshaDevision: false,
      triGunaDevision: false,
      panchtattvaDevision: false,
      menna: false,
      devtaChinhaAadi: false,
      circleGrid: false,
      seharumukh: false,
      devtaBhojanAadi: false,
      devtaKhanj: false,
      mahuratVichar: false,
      dishaGandh: false,
      nineXNineZones: false,
      devtaBhojan: false,
      nighathuArth: false,
      khanjDhatu: false,
      devtaNighath: false,
      devtaChintha: false,
    },
    boundaryPoints: [],
    isEditingBoundary: false,
  });

  const setProjectName = (name: string) =>
    setState((prev) => ({ ...prev, projectName: name }));
  const setClientName = (name: string) =>
    setState((prev) => ({ ...prev, clientName: name }));

  const setFloorplanImage = (image: string, width: number, height: number) => {
    setState((prev) => ({
      ...prev,
      floorplanImage: image,
      floorplanDimensions: { width, height },
      // Reset boundary when new image is uploaded - empty array for pen tool
      boundaryPoints: [],
      isEditingBoundary: false, // Don't auto-start editing, wait for pen tool click
    }));
  };

  const setNorthOrientation = (angle: number) =>
    setState((prev) => ({ ...prev, northOrientation: angle }));

  const toggleGrid = (grid: keyof ProjectState["activeGrids"]) => {
    setState((prev) => {
      const isCurrentlyActive = prev.activeGrids[grid];
      return {
        ...prev,
        activeGrids: {
          grid16: false,
          grid32: false,
          grid64: false,
          grid81: false,
          devta: false,
          [grid]: !isCurrentlyActive,
        },
      };
    });
  };
  const toggleVastuLayer = (layer: keyof ProjectState["vastuLayers"]) => {
    setState((prev) => {
      const isCurrentlyActive = prev.vastuLayers[layer];
      return {
        ...prev,
        vastuLayers: {
          mvastuSquareGrid: false,
          advanceMarma: false,
          shunyabhanti: false,
          shubhDwar: false,
          vpm: false,
          shaktiChakra: false,
          mvastuChakra: false,
          triDoshaDevision: false,
          triGunaDevision: false,
          panchtattvaDevision: false,
          menna: false,
          devtaChinhaAadi: false,
          circleGrid: false,
          seharumukh: false,
          devtaBhojanAadi: false,
          devtaKhanj: false,
          mahuratVichar: false,
          dishaGandh: false,
          nineXNineZones: false,
          devtaBhojan: false,
          nighathuArth: false,
          khanjDhatu: false,
          devtaNighath: false,
          devtaChintha: false,
          [layer]: !isCurrentlyActive,
        },
      };
    });
  };
  const setBoundaryPoints = (points: { x: number; y: number }[]) => {
    setState((prev) => ({ ...prev, boundaryPoints: points }));
  };

  const setIsEditingBoundary = (isEditing: boolean) => {
    setState((prev) => ({ ...prev, isEditingBoundary: isEditing }));
  };

  return (
    <ProjectContext.Provider
      value={{
        ...state,
        setProjectName,
        setClientName,
        setFloorplanImage,
        setNorthOrientation,
        toggleGrid,
        toggleVastuLayer,
        setBoundaryPoints,
        setIsEditingBoundary,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
