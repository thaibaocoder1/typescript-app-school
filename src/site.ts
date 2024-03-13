import { Carts } from "./main";
import { displayNumOrder } from "./utils/cart";
import { renderSidebar } from "./utils/sidebar";

// main
(async () => {
  let isHasCart: string | null = localStorage.getItem("cart");
  let cart: Carts[] = [];
  if (typeof isHasCart === "string") {
    cart = JSON.parse(isHasCart);
  }
  displayNumOrder("num-order", cart);
  await renderSidebar("#sidebar-category");
})();
