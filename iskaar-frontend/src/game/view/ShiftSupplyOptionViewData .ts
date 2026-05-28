import type { SupplyDirectionType } from "../objects/SupplyDirection";
import type { SelectionViewData } from "./SelectionViewData";

export class ShiftSupplyOptionViewData implements SelectionViewData {
  type = "CARD_SHIFT";
  pileName: string;
  direction: SupplyDirectionType;

  constructor(pileName: string, direction: SupplyDirectionType) {
    this.pileName = pileName;
    this.direction = direction;
  }
}
