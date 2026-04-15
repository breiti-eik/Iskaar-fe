import { Card } from "../objects/Card";

export class MeView {
  playerId: string;
  drawPileSize: number;
  persistentCards: Card[];
  hand: Card[];
  inPlay: Card[];
  discardPile: Card[];

  constructor(
    playerId: string,
    drawPileSize: number,
    persistentCards: Card[],
    hand: Card[],
    inPlay: Card[],
    discardPile: Card[],
  ) {
    this.playerId = playerId;
    this.drawPileSize = drawPileSize;
    this.persistentCards = persistentCards;
    this.hand = hand;
    this.inPlay = inPlay;
    this.discardPile = discardPile;
  }
}
