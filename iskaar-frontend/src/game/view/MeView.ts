import { Card } from "../objects/Card";

export class MeView {
  playerId: string;
  hand: Card[];

  constructor(playerId: string, hand: Card[]) {
    this.playerId = playerId;
    this.hand = hand;
  }
}
