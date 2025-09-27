import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form, IForm } from "./Form";

export interface IContactForm extends IForm {
  email: string;
  phone: string;
}

export class ContactForm extends Form<IContactForm> {
  protected emailInputElement: HTMLInputElement;
  protected phoneInputElement: HTMLInputElement;
  protected orderButtonElement: HTMLButtonElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(events, container);

    this.phoneInputElement = ensureElement<HTMLInputElement>(
      '.order__field [name="phone"]',
      this.container
    );
    this.emailInputElement = ensureElement<HTMLInputElement>(
      '.order__field [name="email"]',
      this.container
    );
    this.orderButtonElement = ensureElement<HTMLButtonElement>(
      '.modal__actions [type="submit"]',
      this.container
    );
    this.orderButtonElement.addEventListener("click", (e) => {
      e.preventDefault();
      this.events.emit(`success:open`);
    });
  }

  set phone(value: string) {
    this.phoneInputElement.value = value;
  }

  set email(value: string) {
    this.emailInputElement.value = value;
  }
}
