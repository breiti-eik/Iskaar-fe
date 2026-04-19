import type { CardViewData } from "./CardViewData";

export class MeViewData {
  playerId: string;
  playerName: string;
  drawPileSize: number;
  persistentCards: CardViewData[];
  hand: CardViewData[];
  inPlay: CardViewData[];
  discard: CardViewData[];

  constructor(
    playerId: string,
    playerName: string,
    drawPileSize: number,
    persistentCards: CardViewData[],
    hand: CardViewData[],
    inPlay: CardViewData[],
    discardPile: CardViewData[],
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
