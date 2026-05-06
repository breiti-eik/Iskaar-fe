export class BodyViewData {
  strength: number;
  health: number;
  unconscious: boolean;

  constructor(strength: number, health: number, unconscious: boolean) {
    this.strength = strength;
    this.health = health;
    this.unconscious = unconscious;
  }
}
