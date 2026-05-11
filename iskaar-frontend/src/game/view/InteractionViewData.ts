import type { ChoiceOptionViewData } from "./ChoiceOptionViewData";
export class InteractionViewData {
  type: string;
  options: ChoiceOptionViewData[];
  skippable: boolean;

  constructor(
    type: string,
    options: ChoiceOptionViewData[],
    skippable: boolean,
  ) {
    this.type = type;
    this.options = options;
    this.skippable = skippable;
  }
}
