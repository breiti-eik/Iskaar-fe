export class OpponentView {
  playerId: string;
  handSize: number;

  constructor(playerId: string, handSize: number) {
    this.playerId = playerId;
    this.handSize = handSize;
  }
}
