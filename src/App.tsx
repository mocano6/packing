import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import { Player, Action } from "./types";
import SelectionContainer from "./components/SelectionContainer/SelectionContainer";
import FootballPitch from "./components/FootballPitch/FootballPitch";
import PointsButtons from "./components/PointsButtons/PointsButtons";
import ActionsTable from "./components/ActionsTable/ActionsTable";
import PlayerModal from "./components/PlayerModal/PlayerModal";
import PlayersGrid from "./components/PlayersGrid/PlayersGrid";
import Instructions from "./components/Instructions/Instructions";
import ExportButton from "./components/ExportButton/ExportButton";

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>(() => {
    const savedPlayers = localStorage.getItem("players");
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });

  const [actions, setActions] = useState<Action[]>(() => {
    const savedActions = localStorage.getItem("actions");
    return savedActions ? JSON.parse(savedActions) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedReceiverId, setSelectedReceiverId] = useState<string | null>(
    null
  );
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [actionMinute, setActionMinute] = useState<number>(0);
  const [xTValue, setXTValue] = useState<number | null>(null);
  const [clickValue1, setClickValue1] = useState<number | null>(null);
  const [clickValue2, setClickValue2] = useState<number | null>(null);

  const handleZoneSelect = (
    zone: number | null,
    xT?: number,
    value1?: number,
    value2?: number
  ) => {
    setSelectedZone(zone);
    if (xT !== undefined) setXTValue(xT);
    if (value1 !== undefined) setClickValue1(value1);
    if (value2 !== undefined) setClickValue2(value2);
  };

  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem("actions", JSON.stringify(actions));
  }, [actions]);

  const resetActionState = () => {
    setSelectedReceiverId(null);
    setSelectedZone(null);
    setCurrentPoints(0);
    setActionMinute(0);
    setClickValue1(null);
    setClickValue2(null);
  };

  const handleSavePlayer = (playerData: Omit<Player, "id">) => {
    if (editingPlayerId) {
      const updatedPlayers = players.map((player) =>
        player.id === editingPlayerId ? { ...player, ...playerData } : player
      );
      setPlayers(updatedPlayers);
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

  const handleDeletePlayer = (playerId: string) => {
    if (window.confirm("Czy na pewno chcesz usunąć tego zawodnika?")) {
      setPlayers((prev) => prev.filter((p) => p.id !== playerId));
      if (selectedPlayerId === playerId) {
        setSelectedPlayerId(null);
        resetActionState();
      }
    }
  };

  const handleSaveAction = () => {
    if (!selectedPlayerId || !selectedReceiverId || selectedZone === null) {
      alert("Wybierz nadawcę, odbiorcę i strefę boiska!");
      return;
    }

    const sender = players.find((p) => p.id === selectedPlayerId)!;
    const receiver = players.find((p) => p.id === selectedReceiverId)!;
    const multiplier = (clickValue2 ?? 0) - (clickValue1 ?? 0);

    const newAction: Action = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      minute: actionMinute,
      senderId: selectedPlayerId,
      senderName: sender.name,
      senderNumber: sender.number,
      senderClickValue: clickValue1 ?? 0,
      receiverId: selectedReceiverId,
      receiverName: receiver.name,
      receiverNumber: receiver.number,
      receiverClickValue: clickValue2 ?? 0,
      zone: selectedZone,
      basePoints: currentPoints,
      multiplier: multiplier,
      totalPoints: currentPoints * multiplier,
    };

    setActions((prev) => [...prev, newAction]);
    resetActionState();
  };

  const handleDeleteAction = (actionId: string) => {
    if (window.confirm("Czy na pewno chcesz usunąć tę akcję?")) {
      setActions((prev) => prev.filter((action) => action.id !== actionId));
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Packing Rate Calculator</h1>
      </header>

      <main className={styles.content}>
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

        <div className={styles.actionContainer}>
          <div className={styles.pitchContainer}>
            <FootballPitch
              selectedZone={selectedZone}
              onZoneSelect={handleZoneSelect}
            />
          </div>
          <div className={styles.rightContainer}>
            <SelectionContainer
              players={players}
              selectedPlayerId={selectedPlayerId}
              selectedReceiverId={selectedReceiverId}
              onReceiverSelect={setSelectedReceiverId}
              actionMinute={actionMinute}
              onMinuteChange={setActionMinute}
            />
            <PointsButtons
              currentPoints={currentPoints}
              onAddPoints={(points) =>
                setCurrentPoints((prev) => prev + points)
              }
              onSaveAction={handleSaveAction}
              onReset={resetActionState}
            />
          </div>
        </div>

        <ActionsTable actions={actions} onDeleteAction={handleDeleteAction} />

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

        <ExportButton players={players} actions={actions} />
      </main>
    </div>
  );
};

export default App;
