import Phaser from "phaser";

export class StackView {
  private scene: Phaser.Scene;

  private cards: Phaser.GameObjects.Image[] = [];
  private counter?: Phaser.GameObjects.Text;

  private x = 0;
  private y = 0;
  private scale: number;
  private hasCounter: boolean;
  private MAX_STACK_VISIBLE = 3;
  private hoverEnabled: boolean = false;
  private isExpanded: boolean = false;
  private fullCards: { name: string }[] = [];

  setHoverEnabled(enabled: boolean) {
    this.hoverEnabled = enabled;
  }

  constructor(
    scene: Phaser.Scene,
    scale: number = 0.6,
    hasCounter: boolean = true,
    hoverEnabled: boolean = false,
  ) {
    this.scene = scene;
    this.scale = scale;
    this.hasCounter = hasCounter;
    this.hoverEnabled = hoverEnabled;
    this.scene.input.on("pointermove", this.handlePointerMove, this);
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  // 👉 Fall 1: Karten verdeckt (DrawPile etc.)
  setCards(cards: { name: string }[]) {
    this.isExpanded = false;
    this.clear();

    if (!cards || cards.length === 0) return;
    this.fullCards = [...cards];

    console.log("SetCards:", this.fullCards);

    const stackSize = Math.min(cards.length, this.MAX_STACK_VISIBLE);
    const stackLift = Math.round(16 * this.scale);
    const offset = Math.max(2, stackLift);

    let topSprite!: Phaser.GameObjects.Image;

    for (let i = 0; i < stackSize; i++) {
      const cardData = cards[cards.length - 1 - i]; // 👈 von oben nach unten

      const card = this.scene.add.image(
        this.x - i * offset,
        this.y - i * offset,
        cardData.name,
      );

      console.log("Card: ", card);

      card.setScale(this.scale);
      card.setDepth(i);

      this.cards.push(card);

      if (i === 0) topSprite = card;
    }

    this.renderCounter(cards.length, topSprite, stackLift);

    if (this.hoverEnabled && this.cards.length > 0) {
      const hitArea = this.cards[0];

      hitArea.setInteractive();

      hitArea.on("pointerover", () => this.expandStack());
    }
  }

  // 👉 Fall 2: Karten aufgedeckt (Discard etc.)
  setCount(count: number) {
    this.clear();

    if (count <= 0) return;

    const stackSize = Math.min(count, this.MAX_STACK_VISIBLE);

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

  private handlePointerMove(pointer: Phaser.Input.Pointer) {
    if (!this.isExpanded || this.cards.length === 0) return;

    const inside = this.cards.some(card =>
      card.getBounds().contains(pointer.x, pointer.y),
    );

    if (!inside) {
      this.collapseStack();
    }
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

  private expandStack() {
    if (!this.hoverEnabled || this.fullCards.length <= this.MAX_STACK_VISIBLE)
      return;

    this.isExpanded = true;

    // 👉 neu rendern mit ALLEN Karten
    this.clear();

    const spacing = 60 * this.scale;
    const totalWidth = (this.fullCards.length - 1) * spacing;

    this.cards = [];

    this.fullCards.forEach((cardData, index) => {
      const card = this.scene.add.image(
        this.x - totalWidth / 2 + index * spacing,
        this.y - 15,
        cardData.name,
      );

      card.setScale(this.scale);
      card.setDepth(100 + index);

      this.cards.push(card);
    });
  }

  private collapseStack() {
    this.isExpanded = false;
    this.setCards(this.fullCards);
  }

  private clear() {
    this.scene.tweens.killTweensOf(this.cards);

    this.cards.forEach(c => {
      c.removeAllListeners();
      c.destroy();
    });

    this.cards = [];

    if (this.counter) {
      this.counter.destroy();
      this.counter = undefined;
    }
  }
}
