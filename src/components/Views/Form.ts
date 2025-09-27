import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IForm {
    errors: string | string[];
    validity: boolean;
}

export class Form<T> extends Component<IForm> {
    protected errorsElement: HTMLElement;
    protected submitButton: HTMLButtonElement;

    constructor(protected events: IEvents, protected container: HTMLFormElement) {
        super(container);

        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
        this.submitButton = ensureElement<HTMLButtonElement>('.modal__actions .button', this.container);

        this.container.addEventListener('input', e => {
            const target = e.target;
            if(target instanceof HTMLInputElement) {
                const field = target.name;
                const value = target.value;
                this.onChange(field as keyof T, value);
            }
        })

        this.container.addEventListener('submit', e => {
            e.preventDefault()
            this.events.emit(`${this.container.name}:submit`)
        });
    }

    protected onChange(field: keyof T, value: string) {
        this.events.emit('form:change', {
            field,
            value
        })
    }

    set validity(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string | string[]) {
        this.errorsElement.textContent = typeof value === "string" ? value : value.join(" ");
    }
}
