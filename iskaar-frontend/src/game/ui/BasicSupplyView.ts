// src/game/ui/SupplyView.ts
import Phaser from "phaser";
import { StackView } from "./StatckView";
import type { BoardViewData } from "../view/BoardViewData";

export class BasicSupplyView {
  private stacks: StackView[] = [];
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    for (let i = 0; i < 4; i++) {
      this.stacks.push(new StackView(this.scene, 0.6, true, false));
    }
  }

  setBoard(board: BoardViewData) {
    const sceneWidth = this.scene.scale.width;

    const supplies = [
      board.resources.knutSupply,
      board.resources.groSupply,
      board.resources.randSupply,
      board.resources.trollSupply,
    ];

    // 🎯 Layout-Bereich (oben links)
    const areaWidth = sceneWidth * 0.18;
    const areaPadding = sceneWidth * 0.01;

    const cols = 2;

    const cellWidth = (areaWidth - areaPadding) / cols;
    const cellHeight = cellWidth * 1.4; // Kartenratio

    supplies.forEach((supply, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);

      const x = areaPadding + col * cellWidth;
      const y = areaPadding + row * cellHeight;

      const stack = this.stacks[index];

      stack.setPosition(x, y);
      stack.setSupplyScaled(supply, cellWidth, cellHeight);
    });
  }
}
