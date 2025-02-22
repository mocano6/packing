// src/components/SelectionContainer/SelectionContainer.types.ts

import { Player } from "../../types";

export interface SelectionContainerProps {
  players: Player[];
  selectedPlayerId: string | null;
  selectedReceiverId: string | null;
  onReceiverSelect: (playerId: string) => void;
}
