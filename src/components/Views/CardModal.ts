import { ICardActions } from "../../types";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Card, ICard } from "./Card";

export interface ICardModal extends ICard {
    category: string;
    image: string;
    description: string;
}

type CategoryKey = keyof typeof categoryMap;

export class CardModal extends Card implements ICardModal {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected descriptionElement: HTMLElement;
    protected buyButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buyButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
        
        if(actions?.onClick) {
            this.buyButton.addEventListener('click', actions.onClick);
        }
    }

    set category(value: string) {
        this.categoryElement.textContent = value;

        for(const key in categoryMap) {
            this.categoryElement.classList.toggle(categoryMap[key as CategoryKey], key === value)
        }
    }

    set image(value: string) {
        this.setImage(this.imageElement, value)
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set buyButtonState(value: string) {
        switch(value) {
            case 'buy':
                this.buyButton.textContent = 'Купить';
                this.buyButton.disabled = false;
                break;
            case 'delete':
                this.buyButton.textContent = 'Удалить из корзины';
                this.buyButton.disabled = false;
                break;
            case 'unavailable':
                this.buyButton.textContent = 'Недоступно';
                this.buyButton.disabled = true;
                break;

        }
    }
}