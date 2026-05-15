import type { SupplyDirectionType } from "../../game/objects/SupplyDirection";
import type { SupplyNameType } from "../../game/objects/SupplyName";
import { GameCommand } from "./GameCommand";

export class ShiftSupplyCommand extends GameCommand {
  type = "SHIFT_SUPPLY";
  playerId: string;
  pileName: SupplyNameType;
  direction: SupplyDirectionType;

  constructor(
    gameId: string,
    playerId: string,
    pileName: SupplyNameType,
    direction: SupplyDirectionType,
  ) {
    super(gameId);
    this.playerId = playerId;
    this.pileName = pileName;
    this.direction = direction;
  }
}
