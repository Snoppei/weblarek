import { Api } from "./components/base/Api";
import { Buyer } from "./components/Models/Buyer";
import { Cart } from "./components/Models/Cart";
import { Catalog } from "./components/Models/Catalog";
import "./scss/styles.scss";
import { ApiService } from "./service/ApiService";
import { API_URL } from "./utils/constants";
import { apiProducts } from "./utils/data";

const catalogModelTest = new Catalog();
catalogModelTest.setItems(apiProducts.items);

console.log(`Массив товаров из каталога: `, catalogModelTest.getItems());
console.log(``);

console.log("Получаем товар с id: ");
console.log(catalogModelTest.getItem("854cef69-976d-4c2a-a18c-2aa45046c390"));

catalogModelTest.setOpenedItem(
  catalogModelTest.getItem("854cef69-976d-4c2a-a18c-2aa45046c390")
);
console.log("Открытый товар:");
console.log(catalogModelTest.getOpenedItem());

catalogModelTest.setOpenedItem(null);
console.log("Открытый товар после очистки:");
console.log(catalogModelTest.getOpenedItem());

const cartModel = new Cart();
cartModel.addItem(catalogModelTest.getItem("854cef69-976d-4c2a-a18c-2aa45046c390"));
cartModel.addItem(catalogModelTest.getItem("c101ab44-ed99-4a54-990d-47aa2bb4e7d9"));
cartModel.addItem(catalogModelTest.getItem("b06cde61-912f-4663-9751-09956c0eed67"));

console.log("Товары в корзине:");
console.table(cartModel.getItems());

console.log("Общая стоимость корзины:", cartModel.getTotalPrice());
console.log("Общее количество товаров:", cartModel.getTotalQuantity());
console.log(
  "Проверка наличия товара с id='c101ab44-ed99-4a54-990d-47aa2bb4e7d9':",
  cartModel.isItemIncluded("c101ab44-ed99-4a54-990d-47aa2bb4e7d9")
);

cartModel.deleteItem(
  catalogModelTest.getItem("c101ab44-ed99-4a54-990d-47aa2bb4e7d9")
);
console.log(
  "Корзина после удаления товара с id='c101ab44-ed99-4a54-990d-47aa2bb4e7d9':"
);
console.table(cartModel.getItems());

cartModel.clear();
console.log("Корзина после очистки:");
console.table(cartModel.getItems());

const buyerModel = new Buyer();
buyerModel.setBuyerData(
  "card",
  "ул. Ленина, д.1",
  "user@example.com",
  "+79001234567"
);

console.log("Данные покупателя:");
console.log(buyerModel.getBuyerData());

console.log("Проверка валидности данных покупателя:", buyerModel.isValidData());

const api = new Api(API_URL);
const apiService = new ApiService(api);

const catalogModel = new Catalog();

apiService
  .fetchProducts()
  .then((products) => {
    catalogModel.setItems(products);

    console.log("Каталог товаров после загрузки с сервера:");
    console.table(catalogModel.getItems());

    console.log(`Массив товаров из каталога: `, catalogModel.getItems());
    console.log(``);

    console.log("Получаем товар с id: ");
    console.log(catalogModel.getItem("f3867296-45c7-4603-bd34-29cea3a061d5"));

    catalogModel.setOpenedItem(
      catalogModel.getItem("854cef69-976d-4c2a-a18c-2aa45046c390")
    );
    console.log("Открытый товар:");
    console.log(catalogModel.getOpenedItem());

    catalogModel.setOpenedItem(null);
    console.log("Открытый товар после очистки:");
    console.log(catalogModel.getOpenedItem());

    const cartModel = new Cart();
    cartModel.addItem(
      catalogModel.getItem("854cef69-976d-4c2a-a18c-2aa45046c390")
    );
    cartModel.addItem(
      catalogModel.getItem("c101ab44-ed99-4a54-990d-47aa2bb4e7d9")
    );
    cartModel.addItem(
      catalogModel.getItem("b06cde61-912f-4663-9751-09956c0eed67")
    );

    console.log("Товары в корзине:");
    console.table(cartModel.getItems());

    console.log("Общая стоимость корзины:", cartModel.getTotalPrice());
    console.log("Общее количество товаров:", cartModel.getTotalQuantity());
    console.log(
      "Проверка наличия товара с id='c101ab44-ed99-4a54-990d-47aa2bb4e7d9':",
      cartModel.isItemIncluded("c101ab44-ed99-4a54-990d-47aa2bb4e7d9")
    );

    cartModel.deleteItem(
      catalogModel.getItem("c101ab44-ed99-4a54-990d-47aa2bb4e7d9")
    );
    console.log(
      "Корзина после удаления товара с id='c101ab44-ed99-4a54-990d-47aa2bb4e7d9':"
    );
    console.table(cartModel.getItems());

    cartModel.clear();
    console.log("Корзина после очистки:");
    console.table(cartModel.getItems());

    const buyerModel = new Buyer();
    buyerModel.setBuyerData(
      "card",
      "ул. Ленина, д.1",
      "user@example.com",
      "+79001234567"
    );

    console.log("Данные покупателя:");
    console.log(buyerModel.getBuyerData());

    console.log(
      "Проверка валидности данных покупателя:",
      buyerModel.isValidData()
    );
  })
  .catch((error) => {
    console.error("Ошибка при загрузке товаров с сервера:", error);
  });
