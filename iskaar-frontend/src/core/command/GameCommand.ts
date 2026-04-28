export abstract class GameCommand {
  abstract type: string;
  gameId: string;

  protected constructor(gameId: string) {
    this.gameId = gameId;
  }
}
