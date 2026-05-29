import { GameCommand } from "./GameCommand";

export class BuyFromPileCommand extends GameCommand {
  type = "BUY_FROM_PILE";
  playerId: string;
  pileName: string;

  constructor(gameId: string, playerId: string, pileName: string) {
    super(gameId);
    this.playerId = playerId;
    this.pileName = pileName;
  }
}
