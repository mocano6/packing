// App.tsx
import React, { useState, useEffect } from "react";
import { Player, Action, Tab } from "./types";
import Instructions from "./components/Instructions/Instructions";
import PlayersGrid from "./components/PlayersGrid/PlayersGrid";
import Tabs from "./components/Tabs/Tabs";
import ActionSection from "./components/ActionSection/ActionSection";
import SummarySection from "./components/SummarySection/SummarySection";
import ActionsTable from "./components/ActionsTable/ActionsTable";
import PlayerModal from "./components/PlayerModal/PlayerModal";
import ExportButton from "./components/ExportButton/ExportButton";
import styles from "./App.module.css";

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>(() => {
    const savedPlayers = localStorage.getItem("players");
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });

  const [actions, setActions] = useState<Action[]>(() => {
    const savedActions = localStorage.getItem("actions");
    return savedActions ? JSON.parse(savedActions) : [];
  });

  const [activeTab, setActiveTab] = useState<Tab>("packing");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedReceiverId, setSelectedReceiverId] = useState<string | null>(
    null
  );
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [actionMinute, setActionMinute] = useState<number>(0);
  const [actionType, setActionType] = useState<"pass" | "dribble">("pass");
  const [isP3Active, setIsP3Active] = useState(false);
  const [clickValue1, setClickValue1] = useState<number | null>(null);
  const [clickValue2, setClickValue2] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem("actions", JSON.stringify(actions));
  }, [actions]);

  const handleZoneSelect = (
    zone: number | null,
    xT?: number,
    value1?: number,
    value2?: number
  ) => {
    setSelectedZone(zone);
    if (value1 !== undefined) setClickValue1(value1);
    if (value2 !== undefined) setClickValue2(value2);
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

  const handleDeleteAction = (actionId: string) => {
    if (window.confirm("Czy na pewno chcesz usunąć tę akcję?")) {
      setActions((prev) => prev.filter((action) => action.id !== actionId));
    }
  };

  const resetActionState = () => {
    setSelectedReceiverId(null);
    setSelectedZone(null);
    setCurrentPoints(0);
    setActionMinute(0);
    setClickValue1(null);
    setClickValue2(null);
    setActionType("pass");
    setIsP3Active(false);
  };

  const handleSaveAction = () => {
    if (
      !selectedPlayerId ||
      selectedZone === null ||
      (actionType === "pass" && !selectedReceiverId)
    ) {
      alert(
        actionType === "pass"
          ? "Wybierz nadawcę, odbiorcę i strefę boiska!"
          : "Wybierz zawodnika i strefę boiska!"
      );
      return;
    }

    const sender = players.find((p) => p.id === selectedPlayerId)!;
    const receiver =
      actionType === "pass"
        ? players.find((p) => p.id === selectedReceiverId)!
        : sender;

    const multiplier = (clickValue2 ?? 0) - (clickValue1 ?? 0);

    const newAction: Action = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      minute: actionMinute,
      senderId: selectedPlayerId,
      senderName: sender.name,
      senderNumber: sender.number,
      senderClickValue: clickValue1 ?? 0,
      receiverId:
        actionType === "pass" ? selectedReceiverId! : selectedPlayerId,
      receiverName: receiver.name,
      receiverNumber: receiver.number,
      receiverClickValue: clickValue2 ?? 0,
      zone: selectedZone,
      basePoints: currentPoints,
      multiplier: multiplier,
      totalPoints: currentPoints * multiplier, // to może być używane do innych celów
      actionType: actionType,
      packingPoints: currentPoints, // punkty za packing
      xTValue: currentPoints * multiplier, // zapisujemy wartość xT w odpowiednim polu
    };

    setActions((prev) => [...prev, newAction]);
    resetActionState();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Packing</h1>
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

        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "packing" ? (
          <>
            <ActionSection
              selectedZone={selectedZone}
              handleZoneSelect={handleZoneSelect}
              players={players}
              selectedPlayerId={selectedPlayerId}
              selectedReceiverId={selectedReceiverId}
              setSelectedReceiverId={setSelectedReceiverId}
              actionMinute={actionMinute}
              setActionMinute={setActionMinute}
              actionType={actionType}
              setActionType={setActionType}
              currentPoints={currentPoints}
              setCurrentPoints={setCurrentPoints}
              isP3Active={isP3Active}
              setIsP3Active={setIsP3Active}
              handleSaveAction={handleSaveAction}
              resetActionState={resetActionState}
            />
            <ActionsTable
              actions={actions}
              onDeleteAction={handleDeleteAction}
            />
          </>
        ) : (
          <SummarySection
            selectedPlayerId={selectedPlayerId}
            players={players}
            actions={actions}
          />
        )}

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
