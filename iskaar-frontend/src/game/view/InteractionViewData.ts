import type { SelectionType } from "../objects/Selection";
import type { ChoiceOptionViewData } from "./ChoiceOptionViewData";
import type { SelectionViewData } from "./SelectionViewData";
export class InteractionViewData {
  type: SelectionType;
  actions: ChoiceOptionViewData[];
  selections: SelectionViewData[];

  constructor(
    type: SelectionType,
    actions: ChoiceOptionViewData[],
    selections: SelectionViewData[],
  ) {
    this.type = type;
    this.actions = actions;
    this.selections = selections;
  }
}
