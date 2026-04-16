import type { Card } from "../objects/Card";

export class OpponentViewData {
  playerId: string;
  playerName: string;
  drawPileSize: number;
  handSize: number;
  inPlay: Card[];
  discardTopCard: Card | null;

  constructor(
    playerId: string,
    playerName: string,
    drawPileSize: number,
    handSize: number,
    inPlay: Card[],
    discardTopCard: Card | null,
  ) {
    this.playerId = playerId;
    this.playerName = playerName;
    this.drawPileSize = drawPileSize;
    this.handSize = handSize;
    this.inPlay = inPlay;
    this.discardTopCard = discardTopCard;
  }
}
