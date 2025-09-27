import { TPayment, IBuyer, IValidateBuyer } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  public payment: TPayment = "";
  public address: string = "";
  public email: string = "";
  public phone: string = "";

  constructor(protected events: IEvents) {}

  setBuyerData(buyerData: Partial<IBuyer>): void {
    this.payment = buyerData.payment ?? this.payment;
    this.address = buyerData.address ?? this.address;
    this.email = buyerData.email ?? this.email;
    this.phone = buyerData.phone ?? this.phone;
    this.events.emit("buyer:change");
  }

  getBuyerData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  clearBuyerData(): void {
    this.payment = "";
    this.address = "";
    this.email = "";
    this.phone = "";
    this.events.emit("buyer:change");
  }

  validateBuyerData(): IValidateBuyer {
  const check = (value: string, message: string) => 
    value.trim() !== "" ? "" : message;

  return {
    payment: check(this.payment, "Необходимо выбрать способ оплаты"),
    address: check(this.address, "Необходимо указать адрес"),
    email: check(this.email, "Необходимо указать электронную почту"),
    phone: check(this.phone, "Необходимо указать телефон"),
    buyer: [this.payment, this.address, this.email, this.phone].every(v => v !== "")
  };
}

  // validateData(): boolean {
  //   const emailValid = /\S+@\S+\.\S+/.test(this.email);
  //   const phoneValid = /^\+?[0-9]{11}$/.test(this.phone);
  //   const addressValid = this.address.trim().length > 0;
  //   const paymentValid = this.payment !== null;

  //   return emailValid && phoneValid && addressValid && paymentValid;
  // }
}
