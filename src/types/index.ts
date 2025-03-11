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
  totalP3: number;
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
  packingPoints?: number;
  xTValue?: number;
  isP3?: boolean;
  isShot: boolean;
  isGoal: boolean;
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
  setCurrentPoints: React.Dispatch<React.SetStateAction<number>>; // Zamiast (points: number) => void
  isP3Active: boolean;
  setIsP3Active: React.Dispatch<React.SetStateAction<boolean>>; // Zamiast (active: boolean) => void
  isShot: boolean;
  setIsShot: React.Dispatch<React.SetStateAction<boolean>>;
  isGoal: boolean;
  setIsGoal: React.Dispatch<React.SetStateAction<boolean>>;
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
