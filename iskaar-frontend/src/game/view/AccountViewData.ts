export class AccountViewData {
  action: number;
  budget: number;
  buy: number;
  moneyAction: number;
  constructor(
    action: number,
    budget: number,
    buy: number,
    moneyAction: number,
  ) {
    this.action = action;
    this.budget = budget;
    this.buy = buy;
    this.moneyAction = moneyAction;
  }
}
