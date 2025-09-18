import { TPayment, IBuyer } from "../../types";

export class Buyer {
  private payment: TPayment | null = null;
  private address: string = "";
  private email: string = "";
  private phone: string = "";

  setBuyerData(
    payment: TPayment,
    address: string,
    email: string,
    phone: string
  ): void {
    this.payment = payment;
    this.address = address;
    this.email = email;
    this.phone = phone;
  }

  getBuyerData(): IBuyer {
    if (!this.payment) {
      throw new Error("Данные покупателя не заданы");
    }
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  clearBuyerData(): void {
    this.payment = null;
    this.address = "";
    this.email = "";
    this.phone = "";
  }

  isValidData(): boolean {
    const emailValid = /\S+@\S+\.\S+/.test(this.email);
    const phoneValid = /^\+?[0-9]{11}$/.test(this.phone);
    const addressValid = this.address.trim().length > 0;
    const paymentValid = this.payment !== null;

    return emailValid && phoneValid && addressValid && paymentValid;
  }
}
