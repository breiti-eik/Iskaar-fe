import Phaser from "phaser";

export class StackView {
  private scene: Phaser.Scene;

  private cards: Phaser.GameObjects.Image[] = [];
  private counter?: Phaser.GameObjects.Text;

  private x = 0;
  private y = 0;
  private scale: number;
  private hasCounter: boolean;

  constructor(
    scene: Phaser.Scene,
    scale: number = 0.6,
    hasCounter: boolean = true,
  ) {
    this.scene = scene;
    this.scale = scale;
    this.hasCounter = hasCounter;
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  // 👉 Fall 1: echte Karten (Discard etc.)
  setCards(cards: { texture: string }[]) {
    this.clear();

    if (!cards || cards.length === 0) return;

    const top = cards[cards.length - 1];

    const sprite = this.scene.add.image(this.x, this.y, top.texture);
    sprite.setScale(this.scale);

    this.cards.push(sprite);

    this.renderCounter(cards.length, sprite, cards.length);
  }

  // 👉 Fall 2: nur Anzahl (DrawPile etc.)
  setCount(count: number) {
    this.clear();

    if (count <= 0) return;

    const stackSize = Math.min(count, 5);

    let topSprite!: Phaser.GameObjects.Image;

    const stackLift = Math.round(16 * this.scale);
    const offset = Math.max(2, stackLift);

    for (let i = 0; i < stackSize; i++) {
      const card = this.scene.add.image(
        this.x - i * offset,
        this.y - i * offset,
        "CardBack",
      );

      card.setScale(this.scale);
      card.setDepth(i);

      this.cards.push(card);

      if (i === 0) topSprite = card;
    }
    this.renderCounter(count, topSprite, stackLift);
  }

  private renderCounter(
    amount: number,
    topSprite: Phaser.GameObjects.Image,
    stackLift: number,
  ) {
    if (!this.hasCounter) {
      return;
    }

    const fontSize = Math.max(24, Math.round(60 * this.scale));
    const stroke = Math.max(2, Math.round(6 * this.scale));
    const padding = Math.round(15 * this.scale);

    const x = topSprite.x + topSprite.displayWidth / 2 - padding - stackLift;
    const y = topSprite.y + topSprite.displayHeight / 2 - padding - stackLift;

    this.counter = this.scene.add.text(x, y, `${amount}`, {
      fontSize: `${fontSize}px`,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: stroke,
      fontStyle: "bold",
    });

    this.counter.setOrigin(1, 1);

    // 🔥 garantiert über allen Karten
    this.counter.setDepth(1000);
  }

  private clear() {
    this.cards.forEach(c => c.destroy());
    this.cards = [];

    if (this.counter) {
      this.counter.destroy();
      this.counter = undefined;
    }
  }
}
