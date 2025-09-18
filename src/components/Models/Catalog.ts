import { IProduct } from "../../types";

export class Catalog {
  private items: IProduct[] = [];
  private openedItem: IProduct | null = null;

  setItems(items: IProduct[]): void {
    this.items = items;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItem(itemId: string): IProduct {
    const item = this.items.find((i) => i.id === itemId);
    if (!item) {
      throw new Error(`Товар с id ${itemId} не найден`);
    }
    return item;
  }

  setOpenedItem(item: IProduct | null): void {
    this.openedItem = item;
  }

  getOpenedItem(): IProduct | null {
    return this.openedItem;
  }
}