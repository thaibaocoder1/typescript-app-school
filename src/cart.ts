import { Carts, WhiteLists } from "./constants";
import { renderSidebar } from "./utils/sidebar";
import {
  calcTotalCart,
  handleChangeQuantity,
  paramsCart,
  renderListProductInCart,
} from "./utils/cart";
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
    tableCart.addEventListener("click", async (e: Event) => {
      const target = e.target as HTMLElement;
      productID = <string>target.dataset.id;
      if (target.closest("button#btn-trash")) {
        modal && modal.classList.add("is-show");
      } else if (target.closest("button.btn-minus")) {
        await handleChangeQuantity("minus", cart);
      } else if (target.closest("button.btn-plus")) {
        await handleChangeQuantity("plus", cart);
      }
    });
  }
  modal.addEventListener("click", (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("modal")) {
      modal && modal.classList.remove("is-show");
    } else if (target.classList.contains("btn-close")) {
      modal && modal.classList.remove("is-show");
    } else if (target.classList.contains("btn-close-footer")) {
      modal && modal.classList.remove("is-show");
    } else if (target.closest("button")!.classList.contains("btn-confirm")) {
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
          modal && modal.classList.remove("is-show");
        }, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        if (cart.length === 0) {
          toast.info("Giỏ hàng trống");
          setTimeout(() => {
            window.location.assign("cart.html");
          }, 500);
        }
        calcTotalCart("subtotal-cart", cart);
      }
    }
  });
  const checkoutButton = document.getElementById(
    "checkout-btn"
  ) as HTMLButtonElement;
  checkoutButton.addEventListener("click", () => {
    if (checkoutButton && cart.length > 0) {
      window.location.assign("checkout.html");
    } else {
      toast.info("Không có sản phẩm nào trong giỏ hàng");
    }
  });
})();
