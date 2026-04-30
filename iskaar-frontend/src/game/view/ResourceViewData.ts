import type { SupplyViewData } from "./SupplyViewData";

export class ResourceViewData {
  knutSupply: SupplyViewData;
  groSupply: SupplyViewData;
  randSupply: SupplyViewData;
  trollSupply: SupplyViewData;

  constructor(
    knutPileSize: SupplyViewData,
    groPileSize: SupplyViewData,
    randPileSize: SupplyViewData,
    trollPileSize: SupplyViewData,
  ) {
    this.knutSupply = knutPileSize;
    this.groSupply = groPileSize;
    this.randSupply = randPileSize;
    this.trollSupply = trollPileSize;
  }
}
