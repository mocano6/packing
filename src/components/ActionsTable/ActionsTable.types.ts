// src/components/ActionsTable/ActionsTable.types.ts

import { Action } from "../../types";

export interface ActionsTableProps {
  actions: Action[];
  onDeleteAction: (id: string) => void;
}
