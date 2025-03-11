// components/ActionSection/ActionSection.tsx
import React from "react";
import FootballPitch from "../FootballPitch/FootballPitch";
import SelectionContainer from "../SelectionContainer/SelectionContainer";
import PointsButtons from "../PointsButtons/PointsButtons";
import styles from "./ActionSection.module.css";
import { Player } from "../../types"; // Dostosuj ścieżkę importu do swojego projektu

// Kompletny interfejs komponentu
interface ActionSectionProps {
  selectedZone: number | null;
  handleZoneSelect: (
    zone: number | null,
    xT?: number,
    value1?: number,
    value2?: number
  ) => void;
  players: Player[];
  selectedPlayerId: string | null;
  selectedReceiverId: string | null;
  setSelectedReceiverId: (id: string | null) => void;
  actionMinute: number;
  setActionMinute: (minute: number) => void;
  actionType: "pass" | "dribble";
  setActionType: (type: "pass" | "dribble") => void;
  currentPoints: number;
  setCurrentPoints: React.Dispatch<React.SetStateAction<number>>;
  isP3Active: boolean;
  setIsP3Active: React.Dispatch<React.SetStateAction<boolean>>;
  isShot: boolean;
  setIsShot: React.Dispatch<React.SetStateAction<boolean>>;
  isGoal: boolean;
  setIsGoal: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveAction: () => void;
  resetActionState: () => void;
}

const ActionSection: React.FC<ActionSectionProps> = ({
  selectedZone,
  handleZoneSelect,
  players,
  selectedPlayerId,
  selectedReceiverId,
  setSelectedReceiverId,
  actionMinute,
  setActionMinute,
  actionType,
  setActionType,
  currentPoints,
  setCurrentPoints,
  isP3Active,
  setIsP3Active,
  isShot,
  setIsShot,
  isGoal,
  setIsGoal,
  handleSaveAction,
  resetActionState,
}) => {
  // Funkcje pomocnicze do obsługi interakcji użytkownika
  const handleAddPoints = (points: number) => {
    setCurrentPoints(currentPoints + points);
  };

  const handleP3Toggle = () => {
    setIsP3Active(!isP3Active);
  };

  const handleShotToggle = (checked: boolean) => {
    setIsShot(checked);
    if (!checked) setIsGoal(false); // Jeśli odznaczamy strzał, odznaczamy też bramkę
  };

  const handleGoalToggle = (checked: boolean) => {
    setIsGoal(checked);
    if (checked) setIsShot(true); // Jeśli zaznaczamy bramkę, zaznaczamy też strzał
  };

  return (
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
          actionType={actionType}
          onActionTypeChange={setActionType}
        />
        <PointsButtons
          currentPoints={currentPoints}
          onAddPoints={handleAddPoints}
          isP3Active={isP3Active}
          onP3Toggle={handleP3Toggle}
          isShot={isShot}
          onShotToggle={handleShotToggle}
          isGoal={isGoal}
          onGoalToggle={handleGoalToggle}
          onSaveAction={handleSaveAction}
          onReset={resetActionState}
        />
      </div>
    </div>
  );
};

export default ActionSection;
