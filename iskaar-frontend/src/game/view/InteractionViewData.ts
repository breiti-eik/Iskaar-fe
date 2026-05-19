import type { SelectionType } from "../objects/Selection";
import type { ChoiceOptionViewData } from "./ChoiceOptionViewData";
import type { ShiftSupplyOptionViewData } from "./ShiftSupplyOptionViewData ";
export class InteractionViewData {
  type: SelectionType;
  actions: ChoiceOptionViewData[];
  selections: ShiftSupplyOptionViewData[];

  constructor(
    type: SelectionType,
    actions: ChoiceOptionViewData[],
    selections: ShiftSupplyOptionViewData[],
  ) {
    this.type = type;
    this.actions = actions;
    this.selections = selections;
  }
}
