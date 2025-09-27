import { Api } from "../components/base/Api";
import { IProduct, IBuyer, IOrderPostRequest } from "../types";

export class ApiService {
  private api: Api;

  constructor(apiInstance: Api, readonly cdnURL: string) {
    this.api = apiInstance;
  }

  fetchProducts(): Promise<IProduct[]> {
    return this.api
      .get<{ total: number; items: IProduct[] }>("/product/")
      .then((response) =>
        response.items.map((item) => ({
          ...item,
          image: (this.cdnURL + item.image).replace(/\.svg$/i, ".png"),
        }))
      );
  }

  fetchProductById(productId: string): Promise<IProduct> {
    return this.api.get<IProduct>(`/product/${productId}`);
  }

  sendOrder(buyer: IBuyer, items: IProduct[]): Promise<any> {
    let total = 0;
    for (const item of items) {
      if (item.price !== null) {
        total += item.price;
      }
    }

    const itemsIds = items.map((item) => item.id);

    const orderData: IOrderPostRequest = {
      payment: buyer.payment,
      email: buyer.email,
      phone: buyer.phone,
      address: buyer.address,
      total,
      items: itemsIds,
    };

    return this.api.post("/order/", orderData);
  }
}
