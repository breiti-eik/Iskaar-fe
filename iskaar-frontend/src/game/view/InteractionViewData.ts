import type { SelectionType } from "../objects/Selection";
import type { ChoiceOptionViewData } from "./ChoiceOptionViewData";
import type { SelectionViewData } from "./SelectionViewData";
export class InteractionViewData {
  type: SelectionType;
  actions: ChoiceOptionViewData[];
  selections: SelectionViewData[];
  affectedPlayerIds?: string[];

  constructor(
    type: SelectionType,
    actions: ChoiceOptionViewData[],
    selections: SelectionViewData[],
    affectedPlayerIds?: string[],
  ) {
    this.type = type;
    this.actions = actions;
    this.selections = selections;
    this.affectedPlayerIds = affectedPlayerIds;
  }
}
