import type { ActionType } from "../objects/Actions";

export class InteractionViewData {
  type: string;
  allowedActions: ActionType[];

  constructor(type: string, allowedActions: ActionType[]) {
    this.type = type;
    this.allowedActions = allowedActions;
  }
}
