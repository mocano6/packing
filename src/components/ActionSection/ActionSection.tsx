// components/ActionSection/ActionSection.tsx
import React from "react";
import { ActionSectionProps } from "../../types";
import FootballPitch from "../FootballPitch/FootballPitch";
import SelectionContainer from "../SelectionContainer/SelectionContainer";
import PointsButtons from "../PointsButtons/PointsButtons";
import styles from "./ActionSection.module.css";

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
  handleSaveAction,
  resetActionState,
}) => {
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
          onAddPoints={(points) => setCurrentPoints((prev) => prev + points)}
          isP3Active={isP3Active}
          onP3Toggle={() => setIsP3Active((prev) => !prev)}
          onSaveAction={handleSaveAction}
          onReset={resetActionState}
        />
      </div>
    </div>
  );
};

export default ActionSection;
