import type { BankViewData } from "../view/BankViewData";

export class BankView extends Phaser.GameObjects.Container {
  private debugBg!: Phaser.GameObjects.Rectangle;
  private bankViewData!: BankViewData;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.scene.add.existing(this);

    this.setVisible(false);
    this.debugBg = this.scene.add.rectangle(0, 0, 100, 100, 0xff5500, 0);
    this.debugBg.setOrigin(0, 1);

    this.add([this.debugBg]);
  }

  setBankData(victoryPoints: BankViewData) {
    this.bankViewData = victoryPoints;
  }

  updateLayout(x: number, y: number, width: number, height: number) {
    this.debugBg.setPosition(x, y);
    this.debugBg.setDisplaySize(width, height);

    this.setVisible(true);
  }
}
