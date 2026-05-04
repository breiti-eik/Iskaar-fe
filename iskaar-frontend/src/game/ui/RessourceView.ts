import Phaser from "phaser";
import { StackView } from "./StackView";
import type { BoardViewData } from "../view/BoardViewData";

export class RessourceView extends Phaser.GameObjects.Container {
  private stacks: StackView[] = [];

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.scene.add.existing(this);
    for (let i = 0; i < 4; i++) {
      const stack = new StackView(scene, 1.0, true, false);
      this.stacks.push(stack);
      this.add(stack);
    }
  }

  setBoard(board: BoardViewData, width: number) {
    const supplies = [
      board.resources.knutSupply,
      board.resources.groSupply,
      board.resources.randSupply,
      board.resources.trollSupply,
    ];

    const cols = 2;

    const padding = width * 0.05;

    const cellWidth = (width - padding) / cols;
    const cellHeight = cellWidth * 1.4; // Kartenratio

    supplies.forEach((supply, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);

      const x = col * cellWidth;
      const y = row * cellHeight;

      const stack = this.stacks[index];

      stack.setPosition(x, y);
      stack.setSupplyScaled(supply, cellWidth, cellHeight);
    });
  }
}
