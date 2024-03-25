import { Carts, WhiteLists } from "./constants";
import { displayNumberWhitelist, renderAccountInfo } from "./utils";
import { displayNumOrder } from "./utils/cart";
import { renderSidebar } from "./utils/sidebar";

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
})();
