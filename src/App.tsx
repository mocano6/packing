import React, { useEffect } from "react";
import { Tab } from "./types";
import Instructions from "./components/Instructions/Instructions";
import PlayersGrid from "./components/PlayersGrid/PlayersGrid";
import Tabs from "./components/Tabs/Tabs";
import ActionSection from "./components/ActionSection/ActionSection";
import SummarySection from "./components/SummarySection/SummarySection";
import ActionsTable from "./components/ActionsTable/ActionsTable";
import PlayerModal from "./components/PlayerModal/PlayerModal";
import ExportButton from "./components/ExportButton/ExportButton";
import MatchInfoModal from "./components/MatchInfoModal/MatchInfoModal";
import MatchInfoHeader from "./components/MatchInfoHeader/MatchInfoHeader";
import { usePlayersState } from "./hooks/usePlayersState";
import { useActionsState } from "./hooks/useActionsState";
import { useMatchInfo } from "./hooks/useMatchInfo";
import styles from "./App.module.css";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<Tab>("packing");

  // Custom hooks
  const {
    players,
    isModalOpen,
    editingPlayerId,
    setIsModalOpen,
    handleDeletePlayer,
    handleSavePlayer,
    handleEditPlayer,
    closeModal,
  } = usePlayersState();

  const {
    matchInfo,
    isMatchModalOpen,
    setIsMatchModalOpen,
    handleSaveMatchInfo,
  } = useMatchInfo();

  const {
    actions,
    selectedPlayerId,
    selectedReceiverId,
    selectedZone,
    currentPoints,
    actionMinute,
    actionType,
    isP3Active,
    isShot,
    isGoal,
    setSelectedPlayerId,
    setSelectedReceiverId,
    setCurrentPoints,
    setActionMinute,
    setActionType,
    setIsP3Active,
    setIsShot,
    setIsGoal,
    handleZoneSelect,
    handleSaveAction,
    handleDeleteAction,
    handleDeleteAllActions,
    resetActionState,
  } = useActionsState(players);

  // Jeśli nie mamy informacji o meczu, pokaż modal przy wejściu na zakładkę packing
  useEffect(() => {
    if (!matchInfo && activeTab === "packing") {
      setIsMatchModalOpen(true);
    }
  }, [activeTab, matchInfo, setIsMatchModalOpen]);

  // Handler dla usuwania gracza, który resetuje wybór, jeśli usuwany gracz jest aktualnie wybrany
  const onDeletePlayer = (playerId: string) => {
    const wasDeleted = handleDeletePlayer(playerId);
    if (wasDeleted && selectedPlayerId === playerId) {
      setSelectedPlayerId(null);
      resetActionState();
    }
  };

  // Handler dla zapisu akcji, który sprawdza czy mamy informacje o meczu
  const onSaveAction = () => {
    const canSave = handleSaveAction(matchInfo);

    if (!canSave && !matchInfo) {
      setIsMatchModalOpen(true);
    }
  };

  // Handler dla usunięcia wszystkich akcji, który także resetuje informacje o meczu
  const onDeleteAllActions = () => {
    const wasDeleted = handleDeleteAllActions();
    if (wasDeleted) {
      // Resetowanie informacji o meczu
      setIsMatchModalOpen(true);
    }
  };

  return (
    <div className={styles.container}>
      {/* Nagłówek z informacjami o meczu */}
      <MatchInfoHeader
        matchInfo={matchInfo}
        onChangeMatch={() => setIsMatchModalOpen(true)}
      />

      <main className={styles.content}>
        <Instructions />
        <PlayersGrid
          players={players}
          selectedPlayerId={selectedPlayerId}
          onPlayerSelect={setSelectedPlayerId}
          onAddPlayer={() => setIsModalOpen(true)}
          onEditPlayer={handleEditPlayer}
          onDeletePlayer={onDeletePlayer}
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
              isShot={isShot}
              setIsShot={setIsShot}
              isGoal={isGoal}
              setIsGoal={setIsGoal}
              handleSaveAction={onSaveAction}
              resetActionState={resetActionState}
            />
            <ActionsTable
              actions={actions}
              onDeleteAction={handleDeleteAction}
              onDeleteAllActions={onDeleteAllActions}
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
          onClose={closeModal}
          onSave={handleSavePlayer}
          editingPlayer={
            editingPlayerId
              ? players.find((p) => p.id === editingPlayerId)
              : undefined
          }
        />

        {/* Modal do wyboru informacji o meczu */}
        <MatchInfoModal
          isOpen={isMatchModalOpen}
          onClose={() => setIsMatchModalOpen(false)}
          onSave={handleSaveMatchInfo}
          currentInfo={matchInfo}
        />

        <ExportButton
          players={players}
          actions={actions}
          matchInfo={matchInfo}
        />
      </main>
    </div>
  );
};

export default App;
