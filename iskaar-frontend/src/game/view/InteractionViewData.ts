import type { ChoiceOptionViewData } from "./ChoiceOptionViewData";
import type { ShiftSupplyOptionViewData } from "./ShiftSupplyOptionViewData ";
export class InteractionViewData {
  actions: ChoiceOptionViewData[];
  selections: any;

  constructor(
    actions: ChoiceOptionViewData[],
    selections: ShiftSupplyOptionViewData[],
  ) {
    this.actions = actions;
    this.selections = selections;
  }
}
