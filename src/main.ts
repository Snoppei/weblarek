import { Api } from "./components/base/Api";
import { Buyer } from "./components/Models/Buyer";
import { Cart } from "./components/Models/Cart";
import { Catalog } from "./components/Models/Catalog";
import { ApiService } from "./service/ApiService";
import { API_URL, CDN_URL } from "./utils/constants";
import "./scss/styles.scss";

import { Header } from "./components/Views/Header";
import { Gallery } from "./components/Views/Gallery";
import { Modal } from "./components/Views/Modal";
import { Basket } from "./components/Views/Basket";
import { OrderForm } from "./components/Views/OrderForm";
import { ContactForm } from "./components/Views/ContactForm";
import { OrderSuccess } from "./components/Views/OrderSuccess";
import { CardModal } from "./components/Views/CardModal";
import { CardCatalog } from "./components/Views/CardCatalog";
import { CardBasket } from "./components/Views/CardBasket";

import { cloneTemplate, ensureElement } from "./utils/utils";
import { EventEmitter } from "./components/base/Events";
import { IBuyer, IProduct, TPayment } from "./types";

const events = new EventEmitter();
events.onAll(({ eventName, data }) => console.log(eventName, data));

const apiInstance = new Api(API_URL);
const apiService = new ApiService(apiInstance, CDN_URL);

const catalogModel = new Catalog(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

// запрос на товары
try {
  const products: IProduct[] = await apiService.fetchProducts();
  catalogModel.setItems(products);
} catch (err) {
  console.error("Ошибка загрузки товаров:", err);
}

const headerContainer = ensureElement<HTMLElement>(".header");
const galleryContainer = ensureElement<HTMLElement>(".gallery");
const modalContainer = ensureElement<HTMLElement>(".modal");

// template`ы
const successTpl = ensureElement<HTMLTemplateElement>("#success");
const cardCatalogTpl = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardModalTpl = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTpl = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTpl = ensureElement<HTMLTemplateElement>("#basket");
const orderFormTpl = ensureElement<HTMLTemplateElement>("#order");
const contactFormTpl = ensureElement<HTMLTemplateElement>("#contacts");

// view
const headerView = new Header(events, headerContainer);
const galleryView = new Gallery(galleryContainer);
const modalView = new Modal(events, modalContainer);

const cardModalView = new CardModal(cloneTemplate(cardModalTpl), {
  onClick: () => {
    const openedItem = catalogModel.getOpenedItem();
    if (!openedItem?.price) {
      cardModalView.buyButtonState = "unavailable";
      return;
    }

    const inCart = cartModel.isItemIncluded(openedItem.id);
    if (inCart) {
      cartModel.deleteItem(openedItem);
      cardModalView.buyButtonState = "buy";
    } else {
      cartModel.addItem(openedItem);
      cardModalView.buyButtonState = "remove";
    }
    events.emit("modal:close");
  },
});

function renderCatalog() {
  const catalogCards = catalogModel.getItems().map((item) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTpl), {
      onClick: () => events.emit("card:open", item),
    });
    return card.render(item);
  });
  galleryView.catalog = catalogCards;
}
renderCatalog();

const basketView = new Basket(cloneTemplate(basketTpl), events);

function renderBasket() {
  let idx = 1;
  const basketCards = cartModel.getItems().map((item) => {
    const card = new CardBasket(cloneTemplate(cardBasketTpl), {
      onClick: () => events.emit("basket:removeProduct", item),
    });
    card.index = idx++;
    return card.render(item);
  });
  basketView.basketPrice = cartModel.getTotalPrice();
  basketView.basketList = basketCards;
}

const orderFormView = new OrderForm(cloneTemplate(orderFormTpl), events);
const contactFormView = new ContactForm(cloneTemplate(contactFormTpl), events);
const successView = new OrderSuccess(events, cloneTemplate(successTpl));

events.on("card:open", (item: IProduct) => {
  catalogModel.setOpenedItem(item);

  const inCart = cartModel.isItemIncluded(item.id);
  if (!item.price) {
    cardModalView.buyButtonState = "unavailable";
  } else {
    cardModalView.buyButtonState = inCart ? "remove" : "buy";
  }

  modalView.content = cardModalView.render(item);
  modalView.show();
});

events.on("modal:close", () => modalView.hide());

events.on("cart:change", () => {
  renderBasket();
  headerView.counter = cartModel.getTotalQuantity();
});

events.on("catalog:change", () => renderCatalog());

events.on("basket:open", () => {
  modalView.content = basketView.render();
  modalView.show();
});

events.on("basket:removeProduct", (item: IProduct) =>
  cartModel.deleteItem(item)
);

events.on("order:openForm", () => {
  orderFormView.errors = "";
  modalView.content = orderFormView.render();
  modalView.show();
});

events.on("contact:openForm", () => {
  contactFormView.errors = "";
  modalView.content = contactFormView.render();
  modalView.show();
});

events.on("payment:card", () => buyerModel.setBuyerData({ payment: "card" }));
events.on("payment:cash", () => buyerModel.setBuyerData({ payment: "cash" }));

events.on(
  "form:change",
  (data: { field: keyof IBuyer; value: string | TPayment }) => {
    buyerModel.setBuyerData({ [data.field]: data.value } as Partial<IBuyer>);
  }
);

events.on("buyer:change", () => {
  const buyerData = buyerModel.getBuyerData();

  orderFormView.payment = buyerData.payment;
  orderFormView.address = buyerData.address;
  contactFormView.phone = buyerData.phone;
  contactFormView.email = buyerData.email;

  const validation = buyerModel.validateBuyerData();
  orderFormView.validity = !validation.payment && !validation.address;
  orderFormView.errors = [validation.payment, validation.address];

  contactFormView.validity = !validation.phone && !validation.email;
  contactFormView.errors = [validation.phone, validation.email];
});

events.on("success:open", async () => {
  const validation = buyerModel.validateBuyerData();
  if (!validation.buyer) {
    modalView.hide();
    return;
  }

  const items = cartModel.getItems();

  try {
    const response = await apiService.sendOrder(
      buyerModel.getBuyerData(),
      items
    );

    if (response.total) {
      successView.price = response.total;
      modalView.content = successView.render();
      modalView.show();

      cartModel.clear();
      buyerModel.clearBuyerData();
    } else if (response.error) {
      modalView.hide();
    }
  } catch (err) {
    console.error("Ошибка отправки заказа:", err);
    modalView.hide();
  }
});

events.on("success:close", () => modalView.hide());
