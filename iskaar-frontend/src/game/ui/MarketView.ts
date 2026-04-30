import Phaser from "phaser";
import { StackView } from "./StatckView";
import type { SupplyViewData } from "../view/SupplyViewData";

export class MarketView {
  private stacks: StackView[] = [];
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    for (let i = 0; i < 4; i++) {
      this.stacks.push(new StackView(this.scene, 0.6, true, false));
    }
  }

  setMarket(
    supplies: SupplyViewData[], // 👉 exakt 4!
  ) {
    const sceneWidth = this.scene.scale.width;

    const count = supplies.length;
    if (count !== 4) return; // strikt laut Domain

    // 🎯 Layout Parameter
    const totalWidth = sceneWidth * 0.5;
    const gap = totalWidth * 0.05;

    const cellWidth = (totalWidth - gap * (count - 1)) / count;
    const cellHeight = cellWidth * 1.4;

    const startX = (sceneWidth - totalWidth) / 2;
    const y = this.scene.scale.height * 0.08;

    supplies.forEach((supply, index) => {
      const x = startX + index * (cellWidth + gap);

      const stack = this.stacks[index];

      stack.setPosition(x, y);
      stack.setSupplyScaled(supply, cellWidth, cellHeight);
    });
  }
}
