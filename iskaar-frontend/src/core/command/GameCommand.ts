export abstract class GameCommand {
  abstract readonly type: string;
  gameId: string;

  protected constructor(gameId: string) {
    this.gameId = gameId;
  }
}
