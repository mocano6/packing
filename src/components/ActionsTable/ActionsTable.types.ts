// src/components/ActionsTable/ActionsTable.types.ts

import { Action } from "../../types";

export interface ActionsTableProps {
  actions: Action[];
  onDeleteAction?: (actionId: string) => void;
}

export interface SortConfig {
  key: keyof Action;
  direction: "asc" | "desc";
}
