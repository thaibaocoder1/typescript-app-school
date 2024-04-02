import { Carts, CouponsStorage, WhiteLists } from "./constants";
import { renderSidebar } from "./utils/sidebar";
import {
  ParamsCart,
  addCartToStorage,
  calcTotalCart,
  handleChangeQuantity,
  paramsCart,
  paramsQuantity,
  renderListProductInCart,
} from "./utils/cart";
import {
  displayNumberWhitelist,
  formatCurrencyNumber,
  hideSpinner,
  renderAccountInfo,
  showSpinner,
} from "./utils";
import { toast } from "./utils/toast";
import Swal from "sweetalert2";
import { Coupon } from "./models/Coupon";

type ApiResponse = {
  status: string;
  message: string;
  data?: any;
};
interface ErrorPayload {
  isExpire: boolean;
  id: string;
}

function handleChangeTextPrice(target: HTMLElement, cartReturn: Carts[]) {
  const parentElement = target.parentElement?.parentElement?.parentElement
    ?.parentElement as HTMLElement;
  const productID = <string>parentElement.dataset.id;
  const subtotalProduct = <HTMLElement>(
    parentElement.querySelector("#subtotal-product")
  );
  const index = cartReturn.findIndex((x) => x.productID === productID);
  if (index >= 0) {
    const subtotal = cartReturn[index].quantity * cartReturn[index].price;
    subtotalProduct.textContent = formatCurrencyNumber(subtotal);
  }
}
function updateTotalCart(
  params: ParamsCart,
  cart: Carts[],
  data?: Array<CouponsStorage>
) {
  const subtotalElement = document.getElementById(
    params.subTotal
  ) as HTMLElement;
  const totalElement = document.getElementById(params.total) as HTMLElement;
  const shippingElement = document.getElementById(params.ship) as HTMLElement;
  if (!subtotalElement) return;
  const subtotal: number = cart.reduce((sum, item) => {
    return sum + item.quantity * item.price;
  }, 0);
  let shipCost: number = 0;
  if (Array.isArray(data) && data.length > 0) {
    let percentCoupon: number = data.reduce((total, item) => {
      return total + item.coupon.value;
    }, 0);
    shipCost =
      cart.reduce((total, item) => {
        return total + item.quantity * 5000;
      }, 0) *
      ((100 - percentCoupon) / 100);
  }
  const sum: number = subtotal + shipCost;
  subtotalElement.innerText = `${formatCurrencyNumber(subtotal)}`;
  shippingElement.innerText = `${formatCurrencyNumber(shipCost)}`;
  totalElement.innerText = `${formatCurrencyNumber(sum)}`;
}
function initFormCoupon(selector: string, cart: Carts[]): void {
  const form = document.getElementById(selector) as HTMLFormElement;
  form.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();
    const inputElement = form.querySelector("input") as HTMLInputElement;
    if (!inputElement.value || inputElement.value === "") {
      toast.error("Vui lòng nhập vào 1 mã giảm giá!");
      return;
    }
    const counpon: string = inputElement.value;
    try {
      showSpinner();
      const check = await Coupon.checkCoupon({ name: counpon });
      hideSpinner();
      const data: ApiResponse = await check.json();
      if (data.status === "success") {
        const { data: coupon } = data;
        toast.success("Áp dụng mã giảm thành công!");
        let list: CouponsStorage[] =
          JSON.parse(localStorage.getItem("list-coupon") as string) || [];
        if (Array.isArray(list) && list.length > 0) {
          list.push({ coupon });
        } else {
          const counponStorage: CouponsStorage = {
            coupon,
          };
          list = [counponStorage];
        }
        list && localStorage.setItem("list-coupon", JSON.stringify(list));
        updateTotalCart(paramsQuantity, cart, list);
        renderListCoupon("coupon-list");
        form.reset();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  });
}
function renderListCoupon(selector: string) {
  const listCoupon = document.getElementById(selector) as HTMLDivElement;
  const counponStorage: string | null = localStorage.getItem("list-coupon");
  if (counponStorage !== null) {
    const list: CouponsStorage[] = JSON.parse(counponStorage);
    listCoupon.textContent = "";
    if (Array.isArray(list) && list.length > 0) {
      list.forEach((item) => {
        const { coupon } = item;
        const counponItem = document.createElement("div");
        counponItem.className = "coupon-item w-100 border-bottom py-2";
        counponItem.id = coupon._id;
        counponItem.innerHTML = `
        <h6 class="coupon-name">${coupon.name}</h6>
        <div class="coupon-content">
          <span class="coupon-value">${coupon.value}%</span>
          <button class="coupon-remove" data-id=${coupon._id}>
            <i class="fa fa-times"></i>
          </button>
        </div>`;
        listCoupon.appendChild(counponItem);
      });
    }
  }
}
// main
(async () => {
  let isHasCart: string | null = localStorage.getItem("cart");
  let isHasWhiteList: string | null = localStorage.getItem("whitelist");
  let cart: Carts[] = [];
  let whitelist: WhiteLists[] = [];
  let accessToken: string | null = localStorage.getItem("accessToken");
  let accessTokenAdmin: string | null =
    localStorage.getItem("accessTokenAdmin");
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
  displayNumberWhitelist("whitelist-order", whitelist);
  await renderSidebar("#sidebar-category");
  await renderListProductInCart(paramsCart, cart);
  const tableCart = document.getElementById("table-cart") as HTMLFormElement;
  const modal = document.getElementById("modal-view") as HTMLDivElement;
  let productID: string;
  document.addEventListener("click", async (e: Event) => {
    const target = e.target as HTMLElement;
    productID = <string>target.dataset.id;
    if (target.closest("button#btn-trash")) {
      modal && modal.classList.add("is-show");
    } else if (target.closest("button.btn-minus")) {
      const inputElement = target.parentElement?.parentElement?.querySelector(
        "input"
      ) as HTMLInputElement;
      const cartReturn = await handleChangeQuantity(
        "minus",
        inputElement,
        cart
      );
      handleChangeTextPrice(target, cartReturn);
      calcTotalCart(paramsQuantity, cartReturn);
    } else if (target.closest("button.btn-plus")) {
      const inputElement = target.parentElement?.parentElement?.querySelector(
        "input"
      ) as HTMLInputElement;
      const cartReturn = await handleChangeQuantity("plus", inputElement, cart);
      handleChangeTextPrice(target, cartReturn);
      calcTotalCart(paramsQuantity, cartReturn);
    } else if (target.closest("button.coupon-remove")) {
      const counponID: string = <string>target.dataset.id;
      if (counponID) {
        let counponStorage: CouponsStorage[] = JSON.parse(
          localStorage.getItem("list-coupon") as string
        );
        const index: number = counponStorage.findIndex(
          (item) => item.coupon._id === counponID
        );
        if (index >= 0) {
          counponStorage.splice(index, 1);
          target.parentElement?.parentElement?.remove();
          toast.info("Xoá thành công coupon");
          localStorage.setItem("list-coupon", JSON.stringify(counponStorage));
          calcTotalCart(paramsQuantity, cart);
        }
      }
    }
  });
  modal.addEventListener("click", (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("modal")) {
      modal && modal.classList.remove("is-show");
    } else if (target.classList.contains("btn-close")) {
      modal && modal.classList.remove("is-show");
    } else if (target.classList.contains("btn-close-footer")) {
      modal && modal.classList.remove("is-show");
    } else if (target.closest("button.btn-confirm")) {
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
        addCartToStorage(cart);
        if (cart.length === 0) {
          toast.info("Giỏ hàng trống");
          setTimeout(() => {
            window.location.assign("cart.html");
          }, 500);
        }
        calcTotalCart(paramsQuantity, cart);
      }
    }
  });
  const checkoutButton = document.getElementById(
    "checkout-btn"
  ) as HTMLButtonElement;
  checkoutButton.addEventListener("click", async () => {
    if (checkoutButton && cart.length > 0) {
      try {
        const counponStorage: CouponsStorage[] | [] =
          JSON.parse(localStorage.getItem("list-coupon") as string) || [];
        if (counponStorage !== null && counponStorage.length > 0) {
          const listID = counponStorage.map((item) => item.coupon._id);
          showSpinner();
          const res = await Coupon.validate(listID);
          hideSpinner();
          const isValid: ApiResponse = await res.json();
          if (isValid.status === "success") {
            window.location.assign("/checkout.html");
          } else {
            toast.error(isValid.message);
            const data: ErrorPayload[] = isValid.data;
            const listCoupon = document.querySelector("#coupon-list")
              ?.children as HTMLCollection;
            if (listCoupon) {
              [...listCoupon].forEach((item) => {
                const couponID: string = item.id;
                const isExpire = data.find((x) => x.id.toString() === couponID);
                if (isExpire) {
                  item && item.classList.add("is-expire");
                }
              });
            }
          }
        } else {
          window.location.assign("/checkout.html");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.info("Không có sản phẩm nào trong giỏ hàng");
    }
  });
  // Apply counpon for cart
  initFormCoupon("form-coupon", cart);
  renderListCoupon("coupon-list");
})();
