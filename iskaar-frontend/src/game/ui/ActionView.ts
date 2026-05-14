import Phaser from "phaser";
import { Button } from "../objects/Button";
import { GameEventBus } from "../events/GameEventBus";
import type { ActionType } from "../objects/Actions";
import type { GameScene } from "../scenes/GameScene";
import { t } from "../../core/i18n";
import type { InteractionViewData } from "../view/InteractionViewData";

export class ActionView extends Phaser.GameObjects.Container {
  private debugBg!: Phaser.GameObjects.Rectangle;

  private actionButtons: Map<ActionType, Button> = new Map();

  private buttonPadding: number = 10;
  private MIN_BUTTON_WIDTH = 100;

  constructor(scene: GameScene) {
    super(scene);
    this.scene.add.existing(this);
    this.create();
  }

  create() {
    this.debugBg = this.scene.add.rectangle(0, 0, 100, 100, 0xff0000, 0);
    this.setVisible(false);
  }

  private renderButtons(interaction: InteractionViewData) {
    this.actionButtons.forEach(btn => btn.destroy());
    this.actionButtons.clear();

    interaction.actions.forEach(option => {
      const button = new Button(
        this.scene,
        0,
        0,
        200,
        t("action", option.action),
        "Button_3",
      );

      button.on("pointerdown", () => {
        GameEventBus.emit("playerAction", option.action);
      });

      this.actionButtons.set(option.action, button);
      this.add([button, this.debugBg]);
    });
  }

  updateActionView(interaction: InteractionViewData, shown: boolean) {
    this.renderButtons(interaction);
    this.show(shown);
  }

  updateLayoutUI(width: number, height: number) {
    this.debugBg.setDisplaySize(width, height);
    this.layoutButtons(width);
  }

  private show(isShown: boolean) {
    this.setVisible(isShown);
  }

  private layoutButtons(referenceWidth: number) {
    const buttons = Array.from(this.actionButtons.values());

    if (buttons.length === 0) return;

    const bw = Math.max(
      this.MIN_BUTTON_WIDTH,
      this.calculateButtonWidth(referenceWidth),
    );
    const maxSlots = 5;

    buttons.forEach((button, index) => {
      const slot = maxSlots - buttons.length + index;
      const x = this.calculateButtonPosition(referenceWidth, slot, bw);
      const scale = bw / button.width;

      button.setScale(scale);
      button.setPosition(x!, 0);
    });
  }

  private calculateButtonWidth(referenceWidth: number) {
    return referenceWidth * 0.25 - this.buttonPadding; //1/4 vom Container
  }

  private calculateButtonPosition(
    referenceWidth: number,
    slot: number,
    buttonWidth: number,
  ): number | undefined {
    if (slot <= 0) {
      return undefined;
    }
    const step = buttonWidth + this.buttonPadding;

    return -referenceWidth / 2 + step * slot - step / 2;
  }
}
