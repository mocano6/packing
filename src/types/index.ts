// types/index.ts
export type Tab = "packing" | "summary";

export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
}
export interface PlayerStats {
  totalActions: number;
  totalPoints: number;
  totalXT: number;
  packingAsSender: number;
  packingAsReceiver: number;
  xtAsSender: number;
  xtAsReceiver: number;
  averagePoints: number;
  averageXT: number;
  connections: {
    [key: string]: {
      playerName: string;
      count: number;
      totalPoints: number;
      totalXT: number;
    };
  };
}

export interface PlayerConnection {
  playerName: string;
  count: number;
  totalPoints: number;
  totalXT: number;
}

export interface Action {
  id: string;
  timestamp: string;
  minute: number;
  senderId: string;
  senderName: string;
  senderNumber: number;
  senderClickValue: number;
  receiverId: string;
  receiverName: string;
  receiverNumber: number;
  receiverClickValue: number;
  zone: number;
  basePoints: number;
  multiplier: number;
  totalPoints: number;
  actionType: "pass" | "dribble";
  packingPoints: number;
  xTValue?: number; // dodane
}
export interface ActionSectionProps {
  selectedZone: number | null;
  handleZoneSelect: (
    zone: number | null,
    xT?: number,
    value1?: number,
    value2?: number
  ) => void;
  players: Player[];
  selectedPlayerId: string | null;
  selectedReceiverId: string | null;
  setSelectedReceiverId: (id: string | null) => void;
  actionMinute: number;
  setActionMinute: (minute: number) => void;
  actionType: "pass" | "dribble";
  setActionType: (type: "pass" | "dribble") => void;
  currentPoints: number;
  setCurrentPoints: (fn: (prev: number) => number) => void;
  isP3Active: boolean;
  setIsP3Active: (fn: (prev: boolean) => boolean) => void;
  handleSaveAction: () => void;
  resetActionState: () => void;
}

export interface SummarySectionProps {
  selectedPlayerId: string | null;
  players: Player[];
  actions: Action[];
}

export interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (player: Omit<Player, "id">) => void;
  editingPlayer?: Player;
}

export interface PlayerStatsProps {
  player: Player;
  actions: Action[];
}
