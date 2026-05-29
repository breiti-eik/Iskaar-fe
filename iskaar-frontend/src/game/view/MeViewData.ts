import type { CardViewData } from "./CardViewData";
import type { TableauViewData } from "./TableauViewData";

export class MeViewData {
  playerId: string;
  playerName: string;
  drawPileSize: number;
  persistentCards: CardViewData[];
  hand: CardViewData[];
  inPlay: CardViewData[];
  discard: CardViewData[];
  tableau: TableauViewData;

  constructor(
    playerId: string,
    playerName: string,
    drawPileSize: number,
    persistentCards: CardViewData[],
    hand: CardViewData[],
    inPlay: CardViewData[],
    discardPile: CardViewData[],
    tableau: TableauViewData,
  ) {
    this.playerId = playerId;
    this.playerName = playerName;
    this.drawPileSize = drawPileSize;
    this.persistentCards = persistentCards;
    this.hand = hand;
    this.inPlay = inPlay;
    this.discard = discardPile;
    this.tableau = tableau;
  }
}
