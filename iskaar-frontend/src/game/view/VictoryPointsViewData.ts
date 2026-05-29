export class VictoryPointsViewData {
  total: number;
  ones: number;
  fives: number;
  tens: number;

  constructor(total: number, ones: number, fives: number, tens: number) {
    this.total = total;
    this.ones = ones;
    this.fives = fives;
    this.tens = tens;
  }
}
