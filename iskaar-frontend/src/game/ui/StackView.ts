import Phaser from "phaser";
import type { SupplyViewData } from "../view/SupplyViewData";
import { GameEventBus } from "../events/GameEventBus";

export class StackView extends Phaser.GameObjects.Container {
  private cards: Phaser.GameObjects.Image[] = [];
  private counter?: Phaser.GameObjects.Text;

  private hasCounter: boolean;
  private MAX_STACK_VISIBLE = 3;
  private hoverEnabled: boolean = false;
  private isExpanded: boolean = false;
  private fullCards: { name: string }[] = [];
  private coinIcon?: Phaser.GameObjects.Image;
  private costText?: Phaser.GameObjects.Text;
  private modifierIcon?: Phaser.GameObjects.Image;
  private modifierText?: Phaser.GameObjects.Text;

  setHoverEnabled(enabled: boolean) {
    this.hoverEnabled = enabled;
  }

  constructor(
    scene: Phaser.Scene,
    scale: number = 0.6,
    hasCounter: boolean = true,
    hoverEnabled: boolean = false,
  ) {
    super(scene, 0, 0);
    this.scale = scale;
    this.hasCounter = hasCounter;
    this.hoverEnabled = hoverEnabled;

    this.scene.add.existing(this);

    this.scene.input.on("pointermove", this.handlePointerMove, this);
  }

  // 👉 Fall 1: Karten aufgedeckt (Discard etc.)
  setCards(cards: { name: string }[]) {
    this.isExpanded = false;
    this.clear();

    if (!cards || cards.length === 0) return;
    this.fullCards = [...cards];

    const stackSize = Math.min(cards.length, this.MAX_STACK_VISIBLE);
    const stackLift = Math.round(16 * this.scale);
    const offset = Math.max(2, stackLift);

    let topSprite!: Phaser.GameObjects.Image;

    for (let i = 0; i < stackSize; i++) {
      const cardData = cards[cards.length - 1 - i]; // 👈 von oben nach unten

      const card = this.scene.add.image(
        -i * offset,
        -i * offset,
        cardData.name,
      );
      this.add(card);

      card.setScale(this.scale);
      card.setDepth(stackSize - i);

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
  // 👉 Fall : Karten verdeckt (DrawPile etc.)
  setCount(count: number) {
    this.clear();

    if (count <= 0) return;

    const stackSize = Math.min(count, this.MAX_STACK_VISIBLE);

    let topSprite!: Phaser.GameObjects.Image;

    const stackLift = Math.round(16 * this.scale);
    const offset = Math.max(2, stackLift);

    for (let i = 0; i < stackSize; i++) {
      const card = this.scene.add.image(-i * offset, -i * offset, "CardBack");
      this.add(card);

      card.setScale(this.scale);
      card.setDepth(i);

      this.cards.push(card);

      if (i === 0) topSprite = card;
    }
    this.renderCounter(count, topSprite, stackLift);
  }

  setSupplyScaled(
    supply: SupplyViewData,
    targetWidth: number,
    targetHeight: number,
    modifier?: number,
  ) {
    this.clear();

    if (!supply?.topCard) return;

    const textureKey = supply.topCard.name;

    // 🖼 Karte erstellen
    const card = this.scene.add.image(0, 0, textureKey);
    card.setOrigin(0, 0);

    // 🎯 Layout / Scaling
    const INNER_PADDING = 0.15;

    const availableWidth = targetWidth * (1 - INNER_PADDING);
    const availableHeight = targetHeight * (1 - INNER_PADDING);

    const scaleX = availableWidth / card.width;
    const scaleY = availableHeight / card.height;
    const scale = Math.min(scaleX, scaleY);

    card.setScale(scale);

    // 🎯 Zentrierung in der Grid-Zelle
    const offsetX = (targetWidth - card.displayWidth) / 2;
    const offsetY = (targetHeight - card.displayHeight) / 2;

    card.setPosition(offsetX, offsetY);
    this.add(card);

    this.cards.push(card);

    // =========================
    // 🔢 STACK COUNT (unten rechts)
    // =========================
    this.counter = this.scene.add.text(
      card.x + card.displayWidth * 0.95,
      card.y + card.displayHeight * 0.95,
      `${supply.size}`,
      {
        fontSize: `${Math.max(14, card.displayWidth * 0.18)}px`,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
        fontStyle: "bold",
      },
    );

    this.counter.setOrigin(1, 1);
    this.counter.setDepth(1000);
    this.add(this.counter);

    // =========================
    // 🪙 COIN + COST
    // =========================
    if (supply.open) {
      const coinX = card.x + card.displayWidth * 0.05;
      const coinY = card.y + card.displayHeight * 0.95;

      this.coinIcon = this.scene.add.image(coinX, coinY, "Coin");
      this.add(this.coinIcon);
      this.coinIcon.setOrigin(0, 1);

      const coinScale = (card.displayWidth * 0.3) / this.coinIcon.width;
      this.coinIcon.setScale(coinScale);
      this.coinIcon.setDepth(1000);

      this.costText = this.scene.add.text(
        this.coinIcon.x + this.coinIcon.displayWidth / 2,
        this.coinIcon.y - this.coinIcon.displayHeight * 0.1,
        `${supply.cost}`,
        {
          fontSize: `${Math.max(14, card.displayWidth * 0.16)}px`,
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 3,
          fontStyle: "bold",
        },
      );

      this.costText.setOrigin(0.5, 1);
      this.costText.setDepth(1000);

      this.add(this.costText);
    }

    if (modifier !== undefined) {
      const baseX = card.x;
      const baseY = card.y;

      // 🪙 ICON
      if (!this.modifierIcon) {
        this.modifierIcon = this.scene.add.image(baseX, baseY, "Coin");
        this.modifierIcon.setOrigin(0.5, 0.5);
        this.modifierIcon.setDepth(999);
      }

      this.modifierIcon.setPosition(baseX, baseY);

      const iconScale = (card.displayWidth * 0.35) / this.modifierIcon.width;
      this.modifierIcon.setScale(iconScale);
      this.modifierIcon.setTint(0x00aa00);
      this.modifierIcon.setAlpha(0.7);
      this.add(this.modifierIcon);

      // 🔢 TEXT
      if (!this.modifierText) {
        this.modifierText = this.scene.add.text(baseX, baseY, "", {
          fontSize: `${Math.max(14, card.displayWidth * 0.16)}px`,
          color: "#000000",
          stroke: "#ffffff",
          strokeThickness: 3,
          fontStyle: "bold",
        });

        this.modifierText.setOrigin(0.5, 0.5);
        this.modifierText.setDepth(1000);
      }

      this.modifierText.setPosition(baseX, baseY);
      this.modifierText.setText(`${modifier > 0 ? "+" : ""}${modifier}`);
      this.add(this.modifierText);
    }

    // =========================
    // 🖱 CLICK LISTENER (nur wenn open)
    // =========================

    // 🧼 Sicherheit: alte Listener weg
    card.removeAllListeners();
    card.disableInteractive();

    if (supply.open) {
      card.setInteractive({ useHandCursor: true });

      card.on("pointerdown", () => {
        // 👉 besser GameEventBus verwenden, falls vorhanden
        GameEventBus.emit("buyCard", {
          pileName: supply.pileName,
          buyerId: supply.buyerId,
        });
      });

      card.on("pointerover", () => card.setTint(0xdddddd));
      card.on("pointerout", () => card.clearTint());
    }
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
    this.add(this.counter);
  }

  private expandStack() {
    if (!this.hoverEnabled || this.fullCards.length <= 1) return;

    this.isExpanded = true;

    // 👉 neu rendern mit ALLEN Karten
    this.clear();

    const spacing = 60 * this.scale;
    const totalWidth = (this.fullCards.length - 1) * spacing;

    this.cards = [];

    this.fullCards.forEach((cardData, index) => {
      const card = this.scene.add.image(
        -totalWidth / 2 + index * spacing,
        -15,
        cardData.name,
      );

      this.add(card);

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
    this.coinIcon?.destroy();
    this.coinIcon = undefined;

    this.costText?.destroy();
    this.costText = undefined;

    this.modifierIcon?.destroy();
    this.modifierIcon = undefined;

    this.modifierText?.destroy();
    this.modifierText = undefined;

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
