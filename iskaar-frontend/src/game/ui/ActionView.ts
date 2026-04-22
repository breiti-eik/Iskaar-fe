import Phaser from "phaser";
import { Button } from "../objects/Button";
import { ssrImportKey } from "vite/module-runner";
import type { TurnViewData } from "../view/TurnViewData";
import { TurnPhase } from "../objects/TurnPhase";

export class ActionView {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private debugBg!: Phaser.GameObjects.Rectangle;

  private endTurnButton!: Button;

  private buttonPadding: number = 10;
  private VIEW_HEIGHT: number = 40;
  private MIN_BUTTON_WIDTH = 100;
  private GAP_TO_FRAME = 20;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create() {
    this.container = this.scene.add.container(0, 0);

    this.endTurnButton = new Button(
      this.scene,
      0,
      0,
      200, // gewünschte Breite
      "End Turn", // Text
      "Button_3", // Texture
      () => {
        console.log("End Turn clicked");
        // hier deine Logik
      },
    );
    this.endTurnButton.setVisible(false);

    this.debugBg = this.scene.add.rectangle(0, 0, 100, 100, 0xff0000, 0);

    this.container.add(this.debugBg);
    this.container.add(this.endTurnButton);
    // EVENT kommt später
  }

  setPosition(x: number, y: number) {
    this.container.setPosition(x, y);
  }

  updateActionView(bounds: Phaser.Geom.Rectangle, turn: TurnViewData) {
    const referenceWidth = bounds.width;

    // 1. Position setzen (sticky)
    this.setPosition(bounds.centerX, bounds.bottom + this.GAP_TO_FRAME);

    // 2. Größe der View definieren (🔥 NEU)
    this.setSize(referenceWidth, this.VIEW_HEIGHT);

    // 4. Button IM Container zentrieren (🔥 wichtig)
    this.layoutButtons(referenceWidth, turn);
  }

  private layoutButtons(referenceWidth: number, turn: TurnViewData) {
    // Button x berechen
    const bw = Math.max(
      this.MIN_BUTTON_WIDTH,
      this.calculateButtonWidth(referenceWidth),
    );
    const buttonX = this.calculateButtonPosition(referenceWidth, 5, bw);
    const bs = bw / this.endTurnButton.width;
    this.endTurnButton.setScale(bs);
    this.endTurnButton.setPosition(buttonX, 0);
    this.endTurnButton.show(turn.phase === TurnPhase.PLAY && turn.skipable);
  }

  private setSize(width: number, height: number) {
    this.debugBg.setDisplaySize(width, height);
  }

  private calculateButtonWidth(referenceWidth: number) {
    return referenceWidth * 0.2 - this.buttonPadding; //1/5 vom Container
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
