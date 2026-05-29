import type { CardViewData } from "./CardViewData";

export class SupplyViewData {
  pileName: string;
  buyerId?: string; // optional, only set if a player is currently buying from this supply
  topCard: CardViewData;
  size: number;
  cost: number;
  open: boolean;

  constructor(
    pileName: string,
    buyerId: string | undefined,
    topCard: CardViewData,
    size: number,
    cost: number,
    open: boolean,
  ) {
    this.pileName = pileName;
    this.buyerId = buyerId;
    this.topCard = topCard;
    this.size = size;
    this.cost = cost;
    this.open = open;
  }
}
