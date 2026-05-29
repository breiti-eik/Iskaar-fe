import { GameCommand } from "./GameCommand";

export class PlayCardCommand extends GameCommand {
  public type: string;
  cardId: string;

  constructor(gameId: string, cardId: string) {
    super(gameId);
    this.type = "PLAY_CARD";
    this.cardId = cardId;
  }
}
