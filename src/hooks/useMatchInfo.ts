import { useState, useEffect } from "react";
import { TeamInfo } from "../types";

export function useMatchInfo() {
  const [matchInfo, setMatchInfo] = useState<TeamInfo | null>(() => {
    const savedMatchInfo = localStorage.getItem("matchInfo");
    if (savedMatchInfo) {
      const parsedInfo = JSON.parse(savedMatchInfo);
      // Upewnij się, że istnieje ID meczu
      if (!parsedInfo.matchId) {
        parsedInfo.matchId = crypto.randomUUID();
      }
      return parsedInfo;
    }
    return null;
  });

  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

  // Zapisz dane meczu do localStorage
  useEffect(() => {
    if (matchInfo) {
      localStorage.setItem("matchInfo", JSON.stringify(matchInfo));
    } else {
      localStorage.removeItem("matchInfo");
    }
  }, [matchInfo]);

  const handleSaveMatchInfo = (info: TeamInfo) => {
    setMatchInfo(info);
    setIsMatchModalOpen(false);
  };

  return {
    matchInfo,
    setMatchInfo,
    isMatchModalOpen,
    setIsMatchModalOpen,
    handleSaveMatchInfo,
  };
}
