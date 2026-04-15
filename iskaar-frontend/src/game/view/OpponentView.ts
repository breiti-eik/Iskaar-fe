import type { Card } from "../objects/Card";

export class OpponentView {
  playerId: string;
  drawPileSize: number;
  handSize: number;
  discardTopCard: Card | null;

  constructor(
    playerId: string,
    drawPileSize: number,
    handSize: number,
    discardTopCard: Card | null,
  ) {
    this.playerId = playerId;
    this.drawPileSize = drawPileSize;
    this.handSize = handSize;
    this.discardTopCard = discardTopCard;
  }
}
