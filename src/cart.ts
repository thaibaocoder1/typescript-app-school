import { Carts, WhiteLists } from "./constants";
import { renderSidebar } from "./utils/sidebar";
import { paramsCart, renderListProductInCart } from "./utils/cart";
import { displayNumberWhitelist } from "./utils";
import { toast } from "./utils/toast";
import Swal from "sweetalert2";

// main
(async () => {
  let isHasCart: string | null = localStorage.getItem("cart");
  let isHasWhiteList: string | null = localStorage.getItem("whitelist");
  let cart: Carts[] = [];
  let whitelist: WhiteLists[] = [];
  if (typeof isHasCart === "string") {
    cart = JSON.parse(isHasCart);
  }
  if (typeof isHasWhiteList === "string") {
    whitelist = JSON.parse(isHasWhiteList);
  }
  displayNumberWhitelist("whitelist-order", whitelist);
  await renderSidebar("#sidebar-category");
  await renderListProductInCart(paramsCart, cart);
  const tableCart = document.getElementById("table-cart") as HTMLFormElement;
  const modal = document.getElementById("modal-view") as HTMLDivElement;
  let productID: string;
  if (tableCart) {
    tableCart.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement;
      productID = <string>target.dataset.id;
      if (target.closest("button#btn-trash")) {
        modal && modal.classList.add("show");
      }
    });
  }
  modal.addEventListener("click", (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("modal")) {
      modal && modal.classList.remove("show");
    } else if (target.classList.contains("btn-close")) {
      modal && modal.classList.remove("show");
    } else if (target.classList.contains("btn-close-footer")) {
      modal && modal.classList.remove("show");
    } else if (target.classList.contains("btn-confirm")) {
      const index: number = cart.findIndex((x) => x.productID === productID);
      const element = tableCart.querySelector(`tr[data-id='${productID}']`);
      if (index >= 0) {
        cart.splice(index, 1);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Xoá sản phẩm thành công",
          showConfirmButton: false,
          timer: 1500,
        });
        element && element.remove();
        setTimeout(() => {
          modal && modal.classList.remove("show");
        }, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    }
  });
})();
