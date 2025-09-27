import { TPayment } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form, IForm } from "./Form";

export interface IOrderForm extends IForm {
    payment: TPayment;
    address: string;
}

export class OrderForm extends Form<IOrderForm> {
    protected paymentCashButton: HTMLButtonElement;
    protected paymentCardButton: HTMLButtonElement;
    protected addressElement: HTMLInputElement;
    protected nextButton: HTMLButtonElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(events, container);

        this.paymentCardButton = ensureElement<HTMLButtonElement>('.order__buttons [name="card"]', this.container);
        this.paymentCashButton = ensureElement<HTMLButtonElement>('.order__buttons [name="cash"]', this.container);
        this.addressElement = ensureElement<HTMLInputElement>('.order__field [name="address"]', this.container);
        this.nextButton = ensureElement<HTMLButtonElement>('.modal__actions [type="submit"]', this.container);

        this.paymentCardButton.addEventListener('click', () => {
            this.events.emit(`payment:card`)
        })
        this.paymentCashButton.addEventListener('click', () => {
            this.events.emit(`payment:cash`)
        })
        this.nextButton.addEventListener('click', e => {
            e.preventDefault()
            this.events.emit(`contact:openForm`)
        })
    }

    set payment(value: TPayment) {
        this.paymentCardButton.classList.toggle('button_alt-active', value === 'card')
        this.paymentCashButton.classList.toggle('button_alt-active', value === 'cash')
    }

    set address(value: string) {
        this.addressElement.value = value
    }
}