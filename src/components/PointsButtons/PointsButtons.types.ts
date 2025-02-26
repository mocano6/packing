// src/components/PointsButtons/PointsButtons.types.ts
export interface PointsButtonsProps {
  currentPoints: number;
  onAddPoints: (points: number) => void;
  isP3Active: boolean;
  onP3Toggle: () => void;
  onSaveAction: () => void;
  onReset: () => void;
}

export interface ActionButton {
  points: number;
  label: string;
  description: string;
  type?: "points" | "toggle";
}
