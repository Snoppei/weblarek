import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Cart {
  private items: IProduct[] = [];

  constructor(protected events: IEvents, items: IProduct[] = []) {
    this.items = items;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    this.items.push(item);
    this.events.emit("cart:change");
  }

  deleteItem(item: IProduct): void {
    this.items = this.items.filter((i) => i.id !== item.id);
    this.events.emit("cart:change");
  }

  clear(): void {
    this.items = [];
    this.events.emit("cart:change");
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => {
      if (item.price === null) {
        return sum;
      }
      return sum + item.price;
    }, 0);
  }

  getTotalQuantity(): number {
    return this.items.length;
  }

  isItemIncluded(itemId: string): boolean {
    return this.items.some((i) => i.id === itemId);
  }
}
