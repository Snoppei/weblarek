import { IProduct } from "../../types";

export class Cart {
  private items: IProduct[] = [];

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    this.items.push(item);
  }

  deleteItem(item: IProduct): void {
    this.items = this.items.filter((i) => i.id !== item.id);
  }

  clear(): void {
    this.items = [];
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
