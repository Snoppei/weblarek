import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IModal {
  content: HTMLElement;
  show(): void;
  hide(): void;
}

export class Modal extends Component<IModal> {
  protected closeButtonElement: HTMLButtonElement;
  protected contentElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.closeButtonElement = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container
    );
    this.contentElement = ensureElement<HTMLElement>(
      ".modal__content",
      this.container
    );

    this.closeButtonElement.addEventListener("click", () => {
      this.events.emit("modal:close");
    });

    this.container.addEventListener("click", (e) => {
      if (e.target === e.currentTarget) {
        this.events.emit("modal:close");
      }
    });
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  show() {
    this.container.classList.add("modal_active");
  }

  hide() {
    this.container.classList.remove("modal_active");
    this.contentElement.replaceChildren();
  }
}
