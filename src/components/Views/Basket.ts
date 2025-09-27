import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IBasket {
  basketList: HTMLElement[];
  basketPrice: number;
}

export class Basket extends Component<IBasket> {
  protected basketListElement: HTMLElement;
  protected basketPriceElement: HTMLElement;
  protected basketConfirmButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.basketListElement = ensureElement<HTMLElement>(
      ".basket__list",
      this.container
    );
    this.basketPriceElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container
    );
    this.basketConfirmButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container
    );

    this.basketConfirmButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.events.emit("order:openForm");
    });
  }

  set basketList(items: HTMLElement[]) {
    if (items.length !== 0) {
      this.basketListElement.replaceChildren(...items);
      this.basketConfirmButton.disabled = false;
    } else {
      this.basketListElement.textContent = "Корзина пуста";
      this.basketListElement.style.color = "gray";
      this.basketConfirmButton.disabled = true;
    }
  }

  set basketPrice(value: number) {
    this.basketPriceElement.textContent = `${String(value)} синапсов`;
  }
}
