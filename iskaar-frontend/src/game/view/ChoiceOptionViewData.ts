import type { ActionType } from "../objects/Actions";

export class ChoiceOptionViewData {
  action: ActionType;

  constructor(action: ActionType) {
    this.action = action;
  }
}
