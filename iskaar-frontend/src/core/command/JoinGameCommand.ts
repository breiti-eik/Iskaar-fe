import { GameCommand } from "./GameCommand";

export class JoinGameCommand extends GameCommand {
  readonly type = "JOIN_GAME";
  playerName: string;

  constructor(gameId: string, playerName: string) {
    super(gameId);
    this.playerName = playerName;
  }
}
