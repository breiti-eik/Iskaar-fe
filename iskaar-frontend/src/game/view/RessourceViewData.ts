import type { SupplyViewData } from "./SupplyViewData";

export class RessourceViewData {
  knutSupply: SupplyViewData;
  groSupply: SupplyViewData;
  randSupply: SupplyViewData;
  trollSupply: SupplyViewData;

  constructor(
    knutPile: SupplyViewData,
    groPile: SupplyViewData,
    randPile: SupplyViewData,
    trollPile: SupplyViewData,
  ) {
    this.knutSupply = knutPile;
    this.groSupply = groPile;
    this.randSupply = randPile;
    this.trollSupply = trollPile;
  }
}
