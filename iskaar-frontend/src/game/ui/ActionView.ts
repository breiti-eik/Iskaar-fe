import Phaser from "phaser";
import { Button } from "../objects/Button";
import type { TurnViewData } from "../view/TurnViewData";
import { GameEventBus } from "../events/GameEventBus";
import type { ActionType } from "../objects/Actions";
import type { GameScene } from "../scenes/GameScene";
import { t } from "../../core/i18n";

export class ActionView extends Phaser.GameObjects.Container {
  private debugBg!: Phaser.GameObjects.Rectangle;

  private actionButtons: Map<ActionType, Button> = new Map();

  private buttonPadding: number = 10;
  private VIEW_HEIGHT: number = 40;
  private MIN_BUTTON_WIDTH = 100;

  constructor(scene: GameScene) {
    super(scene);
    this.scene.add.existing(this);
    this.create();
  }

  create() {
    this.debugBg = this.scene.add.rectangle(0, 0, 100, 100, 0xff0000, 0);

    this.add(this.debugBg);
  }

  private renderButtons(turn: TurnViewData) {
    this.actionButtons.forEach(btn => btn.destroy());
    this.actionButtons.clear();

    turn.allowedActions.forEach(action => {
      const button = new Button(
        this.scene,
        0,
        0,
        200,
        t("action", action),
        "Button_3",
      );

      button.on("pointerdown", () => {
        GameEventBus.emit("playerAction", action);
      });

      this.add(button);
      this.actionButtons.set(action, button);
    });
  }

  updateActionView(bounds: Phaser.Geom.Rectangle, turn: TurnViewData) {
    const referenceWidth = bounds.width;
    this.updateSize(referenceWidth, this.VIEW_HEIGHT);

    this.renderButtons(turn);

    this.layoutButtons(referenceWidth);
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

  private updateSize(width: number, height: number) {
    this.debugBg.setDisplaySize(width, height);
  }

  private calculateButtonWidth(referenceWidth: number) {
    return referenceWidth * 0.25 - this.buttonPadding; //1/5 vom Container
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
