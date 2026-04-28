import type { CardViewData } from "./CardViewData";

export class SupplyViewData {
  topCard: CardViewData;
  size: number;
  cost: number;
  open: boolean;

  constructor(
    topCard: CardViewData,
    size: number,
    cost: number,
    open: boolean,
  ) {
    this.topCard = topCard;
    this.size = size;
    this.cost = cost;
    this.open = open;
  }
}
