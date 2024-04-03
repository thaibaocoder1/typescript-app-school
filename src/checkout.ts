import { Selectors } from "./constants/checkout";
import { Carts, WhiteLists } from "./constants";
import { Product } from "./models/Product";
import {
  calcPrice,
  displayNumberWhitelist,
  formatCurrencyNumber,
  hideSpinner,
  renderAccountInfo,
  showSpinner,
  toast,
} from "./utils";
import { calcPercentCoupon, displayNumOrder } from "./utils/cart";
import { renderSidebar } from "./utils/sidebar";
import { initFormCheckout } from "./utils/form-checkout";

// functions
async function renderBillCheckout(params: Selectors, cart: Carts[]) {
  if (!Array.isArray(cart) || cart.length === 0) return;
  const infoElement = document.getElementById(
    params.cardElement
  ) as HTMLDivElement;
  infoElement.textContent = "";
  const subTotalEl = document.getElementById(
    params.subtotalElement
  ) as HTMLElement;
  const totalEl = document.getElementById(params.totalElement) as HTMLElement;
  const shippingEl = document.getElementById(
    params.shippingElement
  ) as HTMLElement;
  let subtotal: number = 0;
  let shipping: number = calcPercentCoupon("list-coupon") || 0;
  let total: number = 0;
  let shipCost: number = cart.reduce((total, item) => {
    return total + item.quantity * 5000;
  }, 0);
  try {
    cart.forEach(async (item) => {
      subtotal += item.quantity * item.price;
      let shipCostPercent: number = shipCost * ((100 - shipping) / 100);
      total = subtotal + shipCostPercent;
      showSpinner();
      const product = await Product.loadOne(item.productID);
      hideSpinner();
      const divElement = document.createElement("div");
      divElement.className = "d-flex justify-content-between";
      divElement.innerHTML = `<p>${product.name} x ${item.quantity}</p>
      <p>${formatCurrencyNumber(
        calcPrice(product.price, product.discount)
      )}</p>`;
      infoElement.appendChild(divElement);
      subTotalEl.textContent = formatCurrencyNumber(subtotal);
      shippingEl.textContent = formatCurrencyNumber(shipCostPercent);
      totalEl.textContent = formatCurrencyNumber(total);
    });
  } catch (error) {
    toast.error("Có lỗi trong khi xử lý");
  }
}
// main
(async () => {
  let isHasCart: string | null = localStorage.getItem("cart");
  let isHasWhiteList: string | null = localStorage.getItem("whitelist");
  let accessToken: string | null = localStorage.getItem("accessToken");
  let accessTokenAdmin: string | null =
    localStorage.getItem("accessTokenAdmin");
  let cart: Carts[] = [];
  let whitelist: WhiteLists[] = [];
  if (typeof isHasCart === "string") {
    cart = JSON.parse(isHasCart);
  }
  if (typeof isHasWhiteList === "string") {
    whitelist = JSON.parse(isHasWhiteList);
  }
  if (accessToken !== null && accessTokenAdmin !== null) {
    renderAccountInfo("account");
  } else {
    if (typeof accessToken === "string") {
      renderAccountInfo("account");
    } else if (typeof accessTokenAdmin === "string") {
      renderAccountInfo("account");
    }
  }
  displayNumOrder("num-order", cart);
  displayNumberWhitelist("whitelist-order", whitelist);
  await renderSidebar("#sidebar-category");
  // Checkout page
  const params: Selectors = {
    cardElement: "card-info",
    subtotalElement: "subtotal",
    totalElement: "total",
    shippingElement: "shipping",
  };
  await renderBillCheckout(params, cart);
  await initFormCheckout("form-checkout", cart);
})();
