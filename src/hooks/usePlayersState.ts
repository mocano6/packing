import { useState, useEffect } from "react";
import { Player } from "../types";

export function usePlayersState() {
  const [players, setPlayers] = useState<Player[]>(() => {
    const savedPlayers = localStorage.getItem("players");
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);

  // Zapisz dane graczy do localStorage
  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
  }, [players]);

  const handleDeletePlayer = (playerId: string) => {
    if (window.confirm("Czy na pewno chcesz usunąć tego zawodnika?")) {
      setPlayers((prev) => prev.filter((p) => p.id !== playerId));
      return true; // Zwracamy true, jeśli gracz został usunięty
    }
    return false;
  };

  const handleSavePlayer = (playerData: Omit<Player, "id">) => {
    if (editingPlayerId) {
      setPlayers(
        players.map((player) =>
          player.id === editingPlayerId ? { ...player, ...playerData } : player
        )
      );
    } else {
      const newPlayer: Player = {
        id: crypto.randomUUID(),
        ...playerData,
      };
      setPlayers((prev) => [...prev, newPlayer]);
    }
    setIsModalOpen(false);
    setEditingPlayerId(null);
  };

  const handleEditPlayer = (playerId: string) => {
    setEditingPlayerId(playerId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlayerId(null);
  };

  return {
    players,
    isModalOpen,
    editingPlayerId,
    setIsModalOpen,
    handleDeletePlayer,
    handleSavePlayer,
    handleEditPlayer,
    closeModal,
  };
}
