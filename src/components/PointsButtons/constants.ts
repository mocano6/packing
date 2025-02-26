// src/components/PointsButtons/constants.ts
import { ActionButton } from "./PointsButtons.types";

export const ACTION_BUTTONS: ActionButton[] = [
  {
    points: 1,
    label: "Minięty przeciwnik",
    description: "+1 punkt",
    type: "points",
  },
  {
    points: 0,
    label: "Podanie do P3",
    description: "Aktywuj/Dezaktywuj",
    type: "toggle",
  },
];
