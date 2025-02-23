// src/App.tsx

import React, { useState, useEffect } from "react";
import "./App.css";
import { Player, Action } from "./types";
import SelectionContainer from "./components/SelectionContainer/SelectionContainer";
import FootballPitch from "./components/FootballPitch/FootballPitch";
import PointsButtons from "./components/PointsButtons/PointsButtons";
import ActionsTable from "./components/ActionsTable/ActionsTable";
import PlayerModal from "./components/PlayerModal/PlayerModal";
import { XT_VALUES } from "./components/FootballPitch/constants";
import PlayersGrid from "./components/PlayersGrid/PlayersGrid";
import Instructions from "./components/Instructions/Instructions";

const App: React.FC = () => {
  // Stan dla zawodników
  const [players, setPlayers] = useState<Player[]>(() => {
    const savedPlayers = localStorage.getItem("players");
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });

  // Stan dla akcji
  const [actions, setActions] = useState<Action[]>(() => {
    const savedActions = localStorage.getItem("actions");
    return savedActions ? JSON.parse(savedActions) : [];
  });

  // Stan dla modalowego okna dodawania/edycji zawodnika
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);

  // Stan dla aktualnie wybranej akcji
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedReceiverId, setSelectedReceiverId] = useState<string | null>(
    null
  );
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [actionMinute, setActionMinute] = useState<number>(0);

  // Zapisywanie danych przy zmianach
  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem("actions", JSON.stringify(actions));
  }, [actions]);

  // Funkcja resetująca stan aktualnej akcji
  const resetActionState = () => {
    setSelectedReceiverId(null);
    setSelectedZone(null);
    setCurrentPoints(0);
    setActionMinute(0);
  };

  // Funkcja obsługująca zapisywanie/edycję zawodnika
  const handleSavePlayer = (playerData: Omit<Player, "id">) => {
    if (editingPlayerId) {
      // Edycja istniejącego zawodnika
      const updatedPlayers = players.map((player) =>
        player.id === editingPlayerId ? { ...player, ...playerData } : player
      );
      setPlayers(updatedPlayers);
    } else {
      // Dodawanie nowego zawodnika
      const newPlayer: Player = {
        id: crypto.randomUUID(),
        ...playerData,
      };
      setPlayers((prev) => [...prev, newPlayer]);
    }
    setIsModalOpen(false);
    setEditingPlayerId(null);
  };

  // Funkcja obsługująca usuwanie zawodnika
  const handleDeletePlayer = (playerId: string) => {
    if (window.confirm("Czy na pewno chcesz usunąć tego zawodnika?")) {
      setPlayers((prev) => prev.filter((p) => p.id !== playerId));
      if (selectedPlayerId === playerId) {
        setSelectedPlayerId(null);
        resetActionState();
      }
    }
  };

  // Funkcja obsługująca zapisywanie akcji
  const handleSaveAction = () => {
    if (!selectedPlayerId || !selectedReceiverId || selectedZone === null) {
      alert("Wybierz nadawcę, odbiorcę i strefę boiska!");
      return;
    }

    const sender = players.find((p) => p.id === selectedPlayerId)!;
    const receiver = players.find((p) => p.id === selectedReceiverId)!;
    const multiplier =
      XT_VALUES[Math.floor(selectedZone / 12)][selectedZone % 12];

    const newAction: Action = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      minute: actionMinute,
      senderId: selectedPlayerId,
      senderName: sender.name,
      senderNumber: sender.number,
      receiverId: selectedReceiverId,
      receiverName: receiver.name,
      receiverNumber: receiver.number,
      zone: selectedZone,
      basePoints: currentPoints,
      multiplier: multiplier,
      totalPoints: currentPoints * multiplier,
    };

    setActions((prev) => [...prev, newAction]);
    resetActionState();
  };

  // Funkcja obsługująca usuwanie akcji
  const handleDeleteAction = (actionId: string) => {
    if (window.confirm("Czy na pewno chcesz usunąć tę akcję?")) {
      setActions((prev) => prev.filter((action) => action.id !== actionId));
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Packing Rate Calculator</h1>
      </header>

      <main className="content">
        <Instructions />
        <PlayersGrid
          players={players}
          selectedPlayerId={selectedPlayerId}
          onPlayerSelect={setSelectedPlayerId}
          onAddPlayer={() => setIsModalOpen(true)}
          onEditPlayer={(id) => {
            setEditingPlayerId(id);
            setIsModalOpen(true);
          }}
          onDeletePlayer={handleDeletePlayer}
        />

        <SelectionContainer
          players={players}
          selectedPlayerId={selectedPlayerId}
          selectedReceiverId={selectedReceiverId}
          onReceiverSelect={setSelectedReceiverId}
          actionMinute={actionMinute}
          onMinuteChange={setActionMinute}
        />

        <FootballPitch
          selectedZone={selectedZone}
          onZoneSelect={setSelectedZone}
        />

        <PointsButtons
          currentPoints={currentPoints}
          onAddPoints={(points) => setCurrentPoints((prev) => prev + points)}
          onSaveAction={handleSaveAction}
          onReset={resetActionState}
        />

        <ActionsTable actions={actions} onDeleteAction={handleDeleteAction} />
      </main>

      <PlayerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPlayerId(null);
        }}
        onSave={handleSavePlayer}
        editingPlayer={
          editingPlayerId
            ? players.find((p) => p.id === editingPlayerId)
            : undefined
        }
      />
    </div>
  );
};

export default App;
