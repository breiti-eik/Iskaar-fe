import type { SupplyViewData } from "./SupplyViewData";

export class MarketViewData {
  minusOne: SupplyViewData;
  plusZero: SupplyViewData;
  plusOne: SupplyViewData;
  plusTwo: SupplyViewData;

  constructor(
    minusOne: SupplyViewData,
    plusZero: SupplyViewData,
    plusOne: SupplyViewData,
    plusTwo: SupplyViewData,
  ) {
    this.minusOne = minusOne;
    this.plusZero = plusZero;
    this.plusOne = plusOne;
    this.plusTwo = plusTwo;
  }

  getSupplies(): SupplyViewData[] {
    return [this.plusTwo, this.plusOne, this.plusZero, this.minusOne];
  }
}
