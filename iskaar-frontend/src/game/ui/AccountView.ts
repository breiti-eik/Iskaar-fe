import Phaser from "phaser";
import type { AccountViewData } from "../view/AccountViewData";

export class AccountView extends Phaser.GameObjects.Container {
  private values: Record<string, Phaser.GameObjects.Text> = {};
  private gapToFrame = 30;
  private actionColor = 0x7a9aff;
  private moneyActionColor = 0xffff7a;
  private buyColor = 0x7abf7a;
  private budgetColor = 0xffaa7a;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.scene.add.existing(this);
  }

  create() {
    const spacing = 70;

    const textStyle = this.scene.cache.obj.get("textStyle-label"); // 🔥 hier holen

    const items: { key: keyof AccountViewData; color: number }[] = [
      { key: "action", color: this.actionColor },
      { key: "moneyAction", color: this.moneyActionColor },
      { key: "buy", color: this.buyColor },
      { key: "budget", color: this.budgetColor },
    ];

    const totalHeight = (items.length - 1) * spacing;
    const startY = -totalHeight / 2;

    items.forEach((item, index) => {
      const y = startY + index * spacing;

      const icon = this.scene.add
        .image(0, y, "Rosette")
        .setScale(0.3)
        .setTint(item.color);

      const text = this.scene.add
        .text(0, y, "0", textStyle) // 🔥 dein Style
        .setOrigin(0.5)
        .setScale(0.6); // 👈 wichtig, sonst viel zu groß

      this.values[item.key] = text;

      this.add(icon);
      this.add(text);
      this.setVisible(false);
    });
  }

  setAccount(account: AccountViewData) {
    if (!account) return;

    this.values.action.setText(String(account.action));
    this.values.buy.setText(String(account.buy));
    this.values.moneyAction.setText(String(account.moneyAction));
    this.values.budget.setText(String(account.budget));
  }

  updateAccountView(bounds: Phaser.Geom.Rectangle) {
    const offsetX = bounds.width / 2 + this.gapToFrame;

    this.setPosition(bounds.centerX - offsetX, bounds.centerY);
    this.setVisible(true);
  }
}
