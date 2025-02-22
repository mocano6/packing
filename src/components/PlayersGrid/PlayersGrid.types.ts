// src/components/PlayersGrid/PlayersGrid.types.ts

import { Player } from "../../types";

export interface PlayersGridProps {
  players: Player[];
  selectedPlayerId: string | null;
  onPlayerSelect: (playerId: string) => void;
  onAddPlayer: () => void;
  onEditPlayer: (playerId: string) => void;
  onDeletePlayer: (playerId: string) => void;
}

export interface PlayerTileProps {
  player: Player;
  isSelected: boolean;
  onSelect: (playerId: string) => void;
  onEdit: (playerId: string) => void;
  onDelete: (playerId: string) => void;
}
