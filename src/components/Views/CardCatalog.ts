import { ICardActions } from "../../types";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Card, ICard } from "./Card";

export interface ICardCatalog extends ICard {
    category: string;
    image: string;
}

type CategoryKey = keyof typeof categoryMap;

export class CardCatalog extends Card implements ICardCatalog {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);

        if(actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
    }

    set image(value: string) {
        this.setImage(this.imageElement, value)
    }

    set category(value: string) {
        this.categoryElement.textContent = value;

        for(const key in categoryMap) {
            this.categoryElement.classList.toggle(categoryMap[key as CategoryKey], key === value)
        }
    }
}