import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Catalog {
  private items: IProduct[] = [];
  private openedItem: IProduct | null = null;

  constructor(protected events: IEvents, items: IProduct[] = [], openedItem: IProduct | null = null) {
    this.items = items;
    this.openedItem = openedItem;
  }

  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit('catalog:change');
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
    this.events.emit('catalog:changeOpened')
  }

  getOpenedItem(): IProduct | null {
    return this.openedItem;
  }
}
