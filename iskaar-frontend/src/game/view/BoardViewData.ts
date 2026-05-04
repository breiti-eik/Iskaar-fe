import type { CardViewData } from "./CardViewData";
import type { MarketViewData } from "./MarketViewData";
import type { RessourceViewData } from "./RessourceViewData";
export class BoardViewData {
  ressources: RessourceViewData;
  market: MarketViewData;
  graveyard: CardViewData[];

  constructor(
    ressources: RessourceViewData,
    market: MarketViewData,
    graveyard: CardViewData[],
  ) {
    this.ressources = ressources;
    this.market = market;
    this.graveyard = graveyard;
  }
}
