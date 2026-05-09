import type { BankViewData } from "../view/BankViewData";
import { StackView } from "./StackView";

export class BankView extends Phaser.GameObjects.Container {
  private debugBg!: Phaser.GameObjects.Rectangle;
  private stack!: StackView;
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.scene.add.existing(this);
    this.setVisible(false);
    this.debugBg = this.scene.add.rectangle(0, 0, 100, 100, 0xff5500, 0);
    this.debugBg.setOrigin(0, 1);

    this.create();
  }

  private create() {
    // 🪦 Stack (mit Hover Expand!)
    this.stack = new StackView(this.scene, 0.8, true, true, false);
    this.stack.setScale(0.65);

    this.add([this.debugBg, this.stack]);
  }

  setBankData(bankData: BankViewData) {
    this.stack.setCards(bankData.cards);
  }

  updateLayout(x: number, y: number, width: number, height: number) {
    this.setPosition(x, y);
    this.debugBg.setDisplaySize(width, height);

    this.stack.setPosition(width * 0.6, -height / 2);

    this.setVisible(true);
  }
}
