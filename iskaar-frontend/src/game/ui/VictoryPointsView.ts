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

    this.markers.forEach((marker, index) => {
      const slot = this.markerSlots[index];

      if (!slot) return;

      marker.setPosition(dimension * slot.x, -dimension * slot.y);
    });
  }

  private readonly markerSlots = [
    // obere Reihe → stark verteilt
    { x: 0.58, y: 0.14 },
    { x: 0.86, y: 0.12 },
    { x: 0.66, y: 0.3 },
    { x: 0.92, y: 0.32 },

    // mittlerer Bereich
    { x: 0.74, y: 0.44 },
    { x: 0.56, y: 0.48 },
    { x: 0.86, y: 0.52 },
    { x: 0.68, y: 0.6 },

    // unterer Bereich
    { x: 0.92, y: 0.66 },
    { x: 0.6, y: 0.74 },
    { x: 0.8, y: 0.8 },
    { x: 0.7, y: 0.9 },
  ];
}
