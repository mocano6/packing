// src/components/FootballPitch/FootballPitch.types.ts

export interface FootballPitchProps {
  selectedZone: number | null;
  onZoneSelect: (zone: number) => void;
}

export interface ZoneCellProps {
  zoneIndex: number;
  xTValue: number;
  isSelected: boolean;
  onSelect: (zone: number) => void;
}
