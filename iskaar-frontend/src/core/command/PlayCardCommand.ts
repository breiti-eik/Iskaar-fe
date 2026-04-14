import { GameCommand } from "./GameCommand";

export class PlayCardCommand extends GameCommand {
  readonly type = "PLAY_CARD";
  cardId: string;

  constructor(gameId: string, cardId: string) {
    super(gameId);
    this.cardId = cardId;
  }
}
