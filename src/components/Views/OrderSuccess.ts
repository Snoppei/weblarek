import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IOrderSuccess {
  price: number;
}

export class OrderSuccess extends Component<IOrderSuccess> {
  protected succesButtonElement: HTMLButtonElement;
  protected orderPriceElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.succesButtonElement = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container
    );
    this.orderPriceElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container
    );

    this.succesButtonElement.addEventListener("click", () => {
      this.events.emit("success:close");
    });
  }

  set price(value: number) {
    this.orderPriceElement.textContent = `Списано ${value} синапсов`;
  }
}
