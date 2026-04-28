import type { ActionType } from "../../game/objects/Actions";
import { GameCommand } from "./GameCommand";

export class ActionCommand extends GameCommand {
  type = "PLAY_CARD";

  constructor(gameId: string, action: ActionType) {
    super(gameId);
    this.type = action;
  }
}
