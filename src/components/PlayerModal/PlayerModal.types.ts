import { Player } from "../../types";

export interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (player: Omit<Player, "id">) => void;
  editingPlayer?: Player;
}

export interface FormData {
  number: string;
  name: string;
}
