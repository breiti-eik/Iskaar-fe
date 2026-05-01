import type { MarketViewData } from "./MarketViewData";
import type { ResourceViewData } from "./RessourceViewData";
export class BoardViewData {
  resources: ResourceViewData;
  market: MarketViewData;

  constructor(resources: ResourceViewData, market: MarketViewData) {
    this.resources = resources;
    this.market = market;
  }
}
