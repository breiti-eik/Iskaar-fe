import type { CardViewData } from "./CardViewData";

export class OpponentViewData {
  playerId: string;
  playerName: string;
  drawPileSize: number;
  handSize: number;
  inPlay: CardViewData[];
  discardTopCard: CardViewData | null;

  constructor(
    playerId: string,
    playerName: string,
    drawPileSize: number,
    handSize: number,
    inPlay: CardViewData[],
    discardTopCard: CardViewData | null,
  ) {
    this.playerId = playerId;
    this.playerName = playerName;
    this.drawPileSize = drawPileSize;
    this.handSize = handSize;
    this.inPlay = inPlay;
    this.discardTopCard = discardTopCard;
  }
}
