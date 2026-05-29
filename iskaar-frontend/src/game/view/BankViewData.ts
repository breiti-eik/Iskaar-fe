import type { CardViewData } from "./CardViewData";

export class BankViewData {
  cards: CardViewData[];
  amount: number;
  open: boolean;

  constructor(cards: CardViewData[], amount: number, open: boolean) {
    this.cards = cards;
    this.amount = amount;
    this.open = open;
  }
}
