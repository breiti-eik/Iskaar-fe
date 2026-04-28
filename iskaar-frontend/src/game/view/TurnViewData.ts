import type { ActionType } from "../objects/Actions";

export interface TurnViewData {
  phase: string;
  allowedActions: readonly ActionType[];
}
