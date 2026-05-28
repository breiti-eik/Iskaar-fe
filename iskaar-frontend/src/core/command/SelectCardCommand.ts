import { GameCommand } from "./GameCommand";

export class SelectCardCommand extends GameCommand {
  public type: string;
  playerId: string;
  cardId: string;

  constructor(gameId: string, playerId: string, cardId: string) {
    super(gameId);
    this.type = "SELECT_CARD";
    this.playerId = playerId;
    this.cardId = cardId;
  }
}
