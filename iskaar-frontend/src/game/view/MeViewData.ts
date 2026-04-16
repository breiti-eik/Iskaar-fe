import { Card } from "../objects/Card";

export class MeViewData {
  playerId: string;
  playerName: string;
  drawPileSize: number;
  persistentCards: Card[];
  hand: Card[];
  inPlay: Card[];
  discard: Card[];

  constructor(
    playerId: string,
    playerName: string,
    drawPileSize: number,
    persistentCards: Card[],
    hand: Card[],
    inPlay: Card[],
    discardPile: Card[],
  ) {
    this.playerId = playerId;
    this.playerName = playerName;
    this.drawPileSize = drawPileSize;
    this.persistentCards = persistentCards;
    this.hand = hand;
    this.inPlay = inPlay;
    this.discard = discardPile;
  }
}
