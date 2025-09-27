import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface ICard {
    title: string;
    price: number | null;
}

export class Card extends Component<ICard> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.titleElement = ensureElement('.card__title', this.container);
        this.priceElement = ensureElement('.card__price', this.container);
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = value ? `${value} синапсов` : `Бесценно`;
    }
}