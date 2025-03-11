// components/SummarySection/SummarySection.tsx
import React, { useState, useMemo, useEffect } from "react";
import { SummarySectionProps } from "../../types";
import PlayerStats from "../PlayerStats/PlayerStats";
import styles from "./SummarySection.module.css";

// Korzystamy z typu Player z propsów
type Player = SummarySectionProps["players"][0];

// Interfejs dla zagregowanych statystyk zawodnika
interface PlayerSummary {
  player: Player;
  xtAsSender: number;
  xtAsReceiver: number;
  xtPerActionAsSender: number;
  xtPerActionAsReceiver: number;
  pxtValue: number;
  // Dodajemy pola dla debugowania
  actionsAsSenderCount: number;
  actionsAsReceiverCount: number;
}

const SummarySection: React.FC<SummarySectionProps> = ({
  selectedPlayerId,
  players,
  actions,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    keyof PlayerSummary | "player.name" | "player.number"
  >("xtAsSender");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Wyświetl surowe dane przykładowej akcji bezpośrednio w komponencie
  const sampleAction = actions.length > 0 ? actions[0] : null;

  // Dokładniejsze funkcje do uzyskiwania wartości - adaptujemy się do struktury danych
  const getXT = (action: any): number => {
    // Spróbujmy różnych formatów dostępu do danych
    try {
      // Bezpośredni dostęp jako właściwość
      if (typeof action.expectedThreat === "number")
        return action.expectedThreat;
      if (typeof action.xT === "number") return action.xT;

      // Dostęp przez metody obliczeniowe (jeśli są funkcjami)
      if (typeof action.getExpectedThreat === "function")
        return action.getExpectedThreat();
      if (typeof action.getXT === "function") return action.getXT();

      // Dostęp przez zagnieżdżone obiekty
      if (action.data && typeof action.data.expectedThreat === "number")
        return action.data.expectedThreat;
      if (action.metrics && typeof action.metrics.xT === "number")
        return action.metrics.xT;

      // Dostęp przez pola z wartościami
      if (typeof action.value === "number") return action.value;
      if (typeof action.points === "number") return action.points;

      // Jeśli żadne z powyższych nie zadziałało, spróbuj ostatniej opcji
      const keys = Object.keys(action);
      for (const key of keys) {
        if (
          typeof action[key] === "number" &&
          (key.toLowerCase().includes("xt") ||
            key.toLowerCase().includes("threat") ||
            key.toLowerCase().includes("value"))
        ) {
          return action[key];
        }
      }

      // W ostateczności zwróć 0
      return 0;
    } catch (e) {
      console.error("Error getting xT value:", e);
      return 0;
    }
  };

  const getPacking = (action: any): number => {
    try {
      // Bezpośredni dostęp jako właściwość
      if (typeof action.packing === "number") return action.packing;

      // Dostęp przez metody obliczeniowe
      if (typeof action.getPacking === "function") return action.getPacking();

      // Dostęp przez zagnieżdżone obiekty
      if (action.data && typeof action.data.packing === "number")
        return action.data.packing;
      if (action.metrics && typeof action.metrics.packing === "number")
        return action.metrics.packing;

      // Dostęp przez pola z wartościami
      if (typeof action.packingValue === "number") return action.packingValue;
      if (typeof action.packingFactor === "number") return action.packingFactor;

      // Jeśli żadne z powyższych nie zadziałało, spróbuj ostatniej opcji
      const keys = Object.keys(action);
      for (const key of keys) {
        if (
          typeof action[key] === "number" &&
          (key.toLowerCase().includes("pack") ||
            key.toLowerCase().includes("bypass"))
        ) {
          return action[key];
        }
      }

      // W ostateczności zwróć 1
      return 1;
    } catch (e) {
      console.error("Error getting packing value:", e);
      return 1;
    }
  };

  // Obliczenie statystyk dla każdego zawodnika
  const playerStats = useMemo(() => {
    return players.map((player) => {
      // Akcje, gdzie zawodnik jest podającym
      const actionsAsSender = actions.filter((a) => a.senderId === player.id);

      // Akcje, gdzie zawodnik jest odbierającym
      const actionsAsReceiver = actions.filter(
        (a) => a.receiverId === player.id
      );

      // Próbujemy obliczyć wartości
      let totalXtAsSender = 0;
      let totalXtAsReceiver = 0;
      let totalPxt = 0;

      // Iterujemy przez każdą akcję i dodajemy wartości
      for (const action of actionsAsSender) {
        const xt = getXT(action);
        totalXtAsSender += xt;

        const packing = getPacking(action);
        totalPxt += packing * xt;
      }

      for (const action of actionsAsReceiver) {
        const xt = getXT(action);
        totalXtAsReceiver += xt;
      }

      // Obliczamy statystyki pochodne
      const xtPerActionAsSender =
        actionsAsSender.length > 0
          ? totalXtAsSender / actionsAsSender.length
          : 0;
      const xtPerActionAsReceiver =
        actionsAsReceiver.length > 0
          ? totalXtAsReceiver / actionsAsReceiver.length
          : 0;

      return {
        player,
        xtAsSender: totalXtAsSender,
        xtAsReceiver: totalXtAsReceiver,
        xtPerActionAsSender,
        xtPerActionAsReceiver,
        pxtValue: totalPxt,
        // Dla debugowania
        actionsAsSenderCount: actionsAsSender.length,
        actionsAsReceiverCount: actionsAsReceiver.length,
      };
    });
  }, [players, actions]);

  // Filtrowanie i sortowanie
  const filteredAndSortedStats = useMemo(() => {
    // Filtruj po wyszukiwanym tekście
    const filtered = playerStats.filter((stat) =>
      stat.player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sortuj według wybranej kolumny
    return [...filtered].sort((a, b) => {
      let valueA, valueB;

      if (sortBy === "player.name") {
        valueA = a.player.name;
        valueB = b.player.name;
      } else if (sortBy === "player.number") {
        valueA = a.player.number || 0;
        valueB = b.player.number || 0;
      } else {
        valueA = a[sortBy];
        valueB = b[sortBy];
      }

      if (typeof valueA === "string") {
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB as string)
          : (valueB as string).localeCompare(valueA);
      }

      return sortDirection === "asc"
        ? (valueA as number) - (valueB as number)
        : (valueB as number) - (valueA as number);
    });
  }, [playerStats, searchTerm, sortBy, sortDirection]);

  // Obsługa kliknięcia nagłówka kolumny do sortowania
  const handleSort = (
    column: keyof PlayerSummary | "player.name" | "player.number"
  ) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("desc"); // Domyślnie sortuj malejąco
    }
  };

  // Obsługa kliknięcia wiersza zawodnika
  const handlePlayerSelect = (playerId: string) => {
    // Emitujemy zdarzenie, można to zastąpić bezpośrednim ustawieniem stanu
    const event = new CustomEvent("selectPlayer", { detail: playerId });
    window.dispatchEvent(event);
  };

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Szukaj zawodnika..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.debugInfo}>
        <p>
          Dane: {players.length} zawodników, {actions.length} akcji
        </p>
        <details>
          <summary>Przykładowa akcja (rozwiń)</summary>
          <pre>
            {sampleAction
              ? JSON.stringify(sampleAction, null, 2)
              : "Brak akcji"}
          </pre>
        </details>
      </div>

      <div className={styles.statsTableContainer}>
        <table className={styles.statsTable}>
          <thead>
            <tr>
              <th onClick={() => handleSort("player.number")}>
                #{" "}
                {sortBy === "player.number" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("player.name")}>
                Zawodnik{" "}
                {sortBy === "player.name" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("actionsAsSenderCount")}>
                Podający
              </th>
              <th onClick={() => handleSort("actionsAsReceiverCount")}>
                Odbierający
              </th>
              <th onClick={() => handleSort("xtAsSender")}>
                xT podający{" "}
                {sortBy === "xtAsSender" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("xtAsReceiver")}>
                xT przyjmujący{" "}
                {sortBy === "xtAsReceiver" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("xtPerActionAsSender")}>
                xT/akcję podający{" "}
                {sortBy === "xtPerActionAsSender" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("xtPerActionAsReceiver")}>
                xT/akcję przyjmujący{" "}
                {sortBy === "xtPerActionAsReceiver" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("pxtValue")}>
                PxT{" "}
                {sortBy === "pxtValue" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedStats.map((stat) => (
              <tr
                key={stat.player.id}
                className={
                  selectedPlayerId === stat.player.id ? styles.selectedRow : ""
                }
                onClick={() => handlePlayerSelect(stat.player.id)}
              >
                <td>{stat.player.number || "-"}</td>
                <td>{stat.player.name}</td>
                <td>{stat.actionsAsSenderCount}</td>
                <td>{stat.actionsAsReceiverCount}</td>
                <td>{stat.xtAsSender.toFixed(2)}</td>
                <td>{stat.xtAsReceiver.toFixed(2)}</td>
                <td>{stat.xtPerActionAsSender.toFixed(3)}</td>
                <td>{stat.xtPerActionAsReceiver.toFixed(3)}</td>
                <td>{stat.pxtValue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPlayerId && (
        <div className={styles.playerDetails}>
          <PlayerStats
            player={players.find((p) => p.id === selectedPlayerId)!}
            actions={actions.filter(
              (a) =>
                a.senderId === selectedPlayerId ||
                a.receiverId === selectedPlayerId
            )}
          />
        </div>
      )}
    </div>
  );
};

export default SummarySection;
