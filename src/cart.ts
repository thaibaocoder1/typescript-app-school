import { Carts } from "./main";
import { renderSidebar } from "./utils/sidebar";
import { paramsCart, renderListProductInCart } from "./utils/cart";

// functions
// main
(async () => {
  let isHasCart: string | null = localStorage.getItem("cart");
  let cart: Carts[] = [];
  if (typeof isHasCart === "string") {
    cart = JSON.parse(isHasCart);
  }
  await renderSidebar("#sidebar-category");
  await renderListProductInCart(paramsCart, cart);
})();
