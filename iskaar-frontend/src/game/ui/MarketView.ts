import Phaser from "phaser";
import { StackView } from "./StackView";
import type { SupplyViewData } from "../view/SupplyViewData";

export class MarketView extends Phaser.GameObjects.Container {
  private stacks: StackView[] = [];

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.scene.add.existing(this);

    for (let i = 0; i < 4; i++) {
      const stack = new StackView(this.scene, 0.6, true, false);
      this.stacks.push(stack);
      this.add(stack);
    }
  }

  setMarket(supplies: SupplyViewData[], totalWidth: number) {
    const count = supplies.length;
    if (count !== 4) return;

    const gap = totalWidth * 0.025;

    const cellWidth = (totalWidth - gap * (count - 1)) / count;
    const cellHeight = cellWidth * 1.4;

    const startX = -totalWidth / 2;
    const y = 0;

    supplies.forEach((supply, index) => {
      const x = startX + index * (cellWidth + gap);

      const stack = this.stacks[index];

      stack.setPosition(x + cellWidth / 2, y);

      const modifier = this.getModifierFromPile(supply.pileName);

      stack.setSupplyScaled(supply, cellWidth, cellHeight, modifier);
    });
  }

  private getModifierFromPile(pileName: string): number {
    switch (pileName) {
      case "Slot +2":
        return 2;
      case "Slot +1":
        return 1;
      case "Slot 0":
        return 0;
      case "Slot -1":
        return -1;
      default:
        return 0;
    }
  }
}
