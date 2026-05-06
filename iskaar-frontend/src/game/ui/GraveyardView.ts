import Phaser from "phaser";
import { StackView } from "./StackView";
import type { CardViewData } from "../view/CardViewData";

export class GraveyardView extends Phaser.GameObjects.Container {
  private stack!: StackView;
  private frame!: Phaser.GameObjects.Image;

  private readonly PADDING = 20;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    scene.add.existing(this);

    this.create();
  }

  private create() {
    // 🪦 Stack (mit Hover Expand!)
    this.stack = new StackView(this.scene, 0.8, true, true, false);
    this.stack.setPosition(0, 0);

    this.stack.onExpand = () => this.handleExpand();
    this.stack.onCollapse = () => this.handleCollapse();

    // 🖼 Frame
    this.frame = this.scene.add.image(0, 0, "Frame");
    this.frame.setDisplaySize(100, 100); // vorläufige Größe
    this.frame.setOrigin(0.5);
    this.frame.setDepth(-1);

    this.add([this.frame, this.stack]);
  }

  setCards(cards: CardViewData[]) {
    if (!this.stack) return;
    this.stack.setCards(cards);
    this.handleCollapse();
    this.updateFrame();
  }

  private updateFrame() {
    const bounds = this.stack.getBounds();

    if (bounds.width === 0 || bounds.height === 0) {
      this.frame.setVisible(false);
      return;
    }

    this.frame.setVisible(true);

    const width = bounds.width + this.PADDING * 2;
    const height = bounds.height + this.PADDING * 2;

    this.frame.setDisplaySize(width, height);
    this.frame.setPosition(0, 0);
  }

  private handleExpand() {
    this.stack.list.forEach(obj => {
      if (obj instanceof Phaser.GameObjects.Image && obj.scene && obj.active) {
        obj.resetPipeline();
        obj.setAlpha(1);
      }
    });
  }
  private handleCollapse() {
    if (
      !(this.scene.game.renderer instanceof Phaser.Renderer.WebGL.WebGLRenderer)
    ) {
      return;
    }

    this.stack.list.forEach(obj => {
      if (obj instanceof Phaser.GameObjects.Image && obj.scene && obj.active) {
        obj.setPipeline("Grayscale");
        obj.setAlpha(0.85);
      }
    });
  }
}
