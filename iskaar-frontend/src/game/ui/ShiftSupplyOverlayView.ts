import Phaser from "phaser";
import type { InteractionViewData } from "../view/InteractionViewData";
import type { ShiftSupplyOptionViewData } from "../view/ShiftSupplyOptionViewData ";

export class ShiftSupplyOverlayView extends Phaser.GameObjects.Container {
  private slotPositions: Record<string, Phaser.Math.Vector2> = {};
  setSlotPositions(slotPositions: Record<string, Phaser.Math.Vector2>) {
    this.slotPositions = slotPositions;
  }
  private layoutWidth!: number;
  private layoutHeight!: number;

  private arrows: Phaser.GameObjects.Image[] = [];
  private selections: ShiftSupplyOptionViewData[] = [];

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.scene.add.existing(this);

    this.setDepth(1000);
    this.setVisible(false);
  }

  setInteraction(interaction: InteractionViewData) {
    this.selections = interaction.selections ?? [];
    this.renderArrows();
    console.log("render arrows", this.selections);
  }

  updateLayout(width: number, height: number) {
    this.layoutWidth = width;
    this.layoutHeight = height;
    this.renderArrows();
  }

  private renderArrows() {
    this.arrows.forEach(arrow => arrow.destroy());
    this.arrows = [];

    this.selections.forEach(selection => {
      const slotPosition = this.slotPositions[selection.pileName];
      if (!slotPosition) {
        return;
      }
      console.log(slotPosition);

      const arrow = this.scene.add.image(
        slotPosition.x,
        slotPosition.y,
        "Arrow",
      );
      arrow.setScale(0.1);
      if (selection.pileName == "Slot -1") {
        arrow.setRotation(-Math.PI / 4);
        arrow.setPosition(
          slotPosition.x - arrow.displayWidth / 3,
          this.layoutHeight / 2 + arrow.displayHeight,
        );
      } else {
        arrow.setRotation(-Math.PI / 2);
        arrow.setPosition(
          slotPosition.x - arrow.displayWidth / 3,
          this.layoutHeight / 2,
        );
      }

      this.add(arrow);

      this.arrows.push(arrow);
    });
  }
}
