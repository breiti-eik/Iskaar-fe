import Phaser from "phaser";
import { StackView } from "./StackView";
import type { SupplyViewData } from "../view/SupplyViewData";

export class MarketView extends Phaser.GameObjects.Container {
  private slotPositions: Record<string, Phaser.Math.Vector2> = {};
  getSlotPositions() {
    return this.slotPositions;
  }
  private stacks: StackView[] = [];
  private cellWidth!: number;
  private cellHeight!: number;
  getCellWidth() {
    return this.cellWidth;
  }

  getCellHeight() {
    return this.cellHeight;
  }

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.scene.add.existing(this);

    for (let i = 0; i < 4; i++) {
      const stack = new StackView(this.scene, 0.8, true, false);
      this.stacks.push(stack);
      this.add(stack);
    }
  }

  setMarket(supplies: SupplyViewData[], totalWidth: number) {
    const count = supplies.length;
    if (count !== 4) return;

    const gap = totalWidth * 0.025;

    this.cellWidth = (totalWidth - gap * (count - 1)) / count;
    this.cellHeight = this.cellWidth * 1.4;

    const startX = -totalWidth / 2;
    const y = 0;

    supplies.forEach((supply, index) => {
      const x = startX + index * (this.cellWidth + gap);

      const stack = this.stacks[index];

      stack.setPosition(x + this.cellWidth / 2, y);
      this.slotPositions[supply.pileName] = new Phaser.Math.Vector2(
        x + this.cellWidth / 2,
        y,
      );

      const modifier = this.getModifierFromPile(supply.pileName);

      stack.setSupplyScaled(supply, this.cellWidth, this.cellHeight, modifier);
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
