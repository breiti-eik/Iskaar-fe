import { VPMarker } from "../objects/VPMarker";
import type { VictoryPointsViewData } from "../view/VictoryPointsViewData";

export class VictoryPointsView extends Phaser.GameObjects.Container {
  private debugBg!: Phaser.GameObjects.Rectangle;
  private victoryPointsViewData!: VictoryPointsViewData;
  private markers!: VPMarker[];

  private layoutWidth!: number;
  private layoutHeight!: number;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.scene.add.existing(this);

    this.debugBg = this.scene.add.rectangle(0, 0, 100, 100, 0x00ffff, 0);
    this.debugBg.setOrigin(0, 1);
    this.add(this.debugBg);
    this.setVisible(false);
  }

  setVictoryPointsData(victoryPoints: VictoryPointsViewData) {
    this.victoryPointsViewData = victoryPoints;
    this.createMarker();
  }

  updateLayout(x: number, y: number, width: number, height: number) {
    this.setPosition(x, y);
    this.setSize(width, height);

    this.layoutWidth = width;
    this.layoutHeight = height;
    this.debugBg.setDisplaySize(width, height);
    this.layoutMarker();
    this.setVisible(true);
  }

  private createMarker() {
    this.markers?.forEach(marker => marker.destroy());
    this.markers = [];
    for (let i = 0; i < this.victoryPointsViewData.ones; i++) {
      const one = new VPMarker(this.scene, "o" + i, "Marker1VP", 0.2);
      this.markers.push(one);
      this.add(one);
    }
    if (this.victoryPointsViewData.fives === 1) {
      const five = new VPMarker(this.scene, "f", "Marker5VP", 0.2);
      this.markers.push(five);
      this.add(five);
    }
    for (let i = 0; i < this.victoryPointsViewData.tens; i++) {
      const ten = new VPMarker(this.scene, "t" + i, "Marker10VP", 0.2);
      this.markers.push(ten);
      this.add(ten);
    }
  }

  private layoutMarker() {
    const padding = 30;
    const dimension = this.layoutWidth - padding;

    this.markers.forEach(marker => {
      const hw = (marker.displayWidth - padding) * 0.5;
      const hh = (marker.displayHeight - padding) * 0.5;

      const x = Phaser.Math.Between(padding + hw, dimension - padding - hw);

      const y = Phaser.Math.Between(-dimension + padding + hh, -padding - hh);

      marker.setPosition(x, y);
    });
  }
}
