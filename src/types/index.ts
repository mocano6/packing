export interface Player {
  id: string;
  number: number;
  name: string;
}

export interface Action {
  id: string;
  timestamp: string;
  minute: number;
  senderId: string;
  senderName: string;
  senderNumber: number;
  receiverId: string;
  receiverName: string;
  receiverNumber: number;
  zone: number;
  basePoints: number;
  multiplier: number;
  totalPoints: number;
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
