// types.ts
export interface Player {
  id: string;
  name: string;
  number: number; // upewnij się, że number jest typu number
  // inne pola gracza...
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
  packingPoints: number;
  actionType: "pass" | "dribble";
}

export interface PlayerStats {
  name: string;
  number: string;
  totalPointsAsSender: number;
  totalPointsAsReceiver: number;
  actionsAsSender: number;
  actionsAsReceiver: number;
  avgPointsAsSender: number;
  avgPointsAsReceiver: number;
  connections: {
    [key: string]: {
      count: number;
      totalPoints: number;
      playerName: string;
    };
  };
}
