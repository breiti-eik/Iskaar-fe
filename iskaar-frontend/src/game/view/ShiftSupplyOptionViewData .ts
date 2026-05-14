import type { SupplyDirectionType } from "../objects/SupplyDirection";

export class ShiftSupplyOptionViewData {
  pileName: string;
  direction: SupplyDirectionType;

  constructor(pileName: string, direction: SupplyDirectionType) {
    this.pileName = pileName;
    this.direction = direction;
  }
}
