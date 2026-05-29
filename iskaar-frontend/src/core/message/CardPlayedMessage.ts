import { Card } from "../../game/objects/Card";

export class CardPlayedMessage {
  readonly type = "CARD_PLAYED";
  playerId: string;
  card: Card;

  constructor(playerId: string, card: Card) {
    this.playerId = playerId;
    this.card = card;
  }
}
