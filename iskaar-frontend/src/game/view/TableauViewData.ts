import type { AdventureViewData } from "./AdventureViewData";
import type { BankViewData } from "./BankViewData";
import type { BodyViewData } from "./BodyViewData";
import type { VictoryPointsViewData } from "./VictoryPointsViewData";

export class TableauViewData {
  adventure: AdventureViewData;
  bank: BankViewData;
  body: BodyViewData;
  victoryPoints: VictoryPointsViewData;

  constructor(
    adventure: AdventureViewData,
    bank: BankViewData,
    body: BodyViewData,
    victoryPoints: VictoryPointsViewData,
  ) {
    this.adventure = adventure;
    this.bank = bank;
    this.body = body;
    this.victoryPoints = victoryPoints;
  }
}
