import type { CardViewData } from "./CardViewData";
import type { SelectionViewData } from "./SelectionViewData";

export class CardSelectionViewData implements SelectionViewData {
  type = "CARD";
  card: CardViewData;

  constructor(card: CardViewData) {
    this.card = card;
  }
}
