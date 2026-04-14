import { ServerMessage } from "./ServerMessage";
import { Card } from "../../game/objects/Card";

export class CardPlayedMessage extends ServerMessage {
  readonly type = "CARD_PLAYED";
  playerId: string;
  card: Card;

  constructor(playerId: string, card: Card) {
    super();
    this.playerId = playerId;
    this.card = card;
  }
}
