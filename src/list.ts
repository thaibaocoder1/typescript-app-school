import Swal from "sweetalert2";
import { AccessTokenData, Carts, WhiteLists } from "./constants";
import { Product } from "./models/Product";
import {
  calcPrice,
  displayNumberWhitelist,
  formatCurrencyNumber,
  hideSpinner,
  renderAccountInfo,
  showSpinner,
} from "./utils";
import { displayNumOrder } from "./utils/cart";
import { renderSidebar } from "./utils/sidebar";
import { toast } from "./utils/toast";

// functions
async function renderWhitelistProduct(
  whitelist: WhiteLists[],
  selector: string
) {
  const whitelistWrapper = document.getElementById(selector) as HTMLDivElement;
  if (!whitelistWrapper) return;
  whitelistWrapper.textContent = "";
  whitelist.forEach(async (item) => {
    showSpinner();
    const product = await Product.loadOne(item.productID as string);
    hideSpinner();
    const productItem = document.createElement("div");
    productItem.className = "col-lg-3 col-md-6 col-sm-12 pb-1";
    productItem.innerHTML = `<div class="card product-item border-0 mb-4" id="card-custom">
      <div class="card-sale">
        <span>${product.discount > 0 ? product.discount + "%" : ""}</span>
      </div>
      <div class="card-delete-whitelist" data-id=${product._id}>
      <span>
        <i class="fas fa-trash" style="color: inherit;"></i>
        </span>
      </div>
      <div
        class="card-header product-img position-relative overflow-hidden bg-transparent border p-0"
      >
      <a href="detail.html?id=${
        product._id
      }"><img class="img-fluid w-100" src="img/${
      product.thumb.fileName
    }" alt="${product.name}" /></a>
      </div>
      <div
        class="card-body border-left border-right text-center p-0 pt-4 pb-3"
      >
        <a href="detail.html?id=${
          product._id
        }" class='text-decoration-none'><h6 class="text-truncate mb-3">${
      product.name
    }</h6></a>
        <div class="d-flex justify-content-center">
          <h6>${formatCurrencyNumber(
            calcPrice(product.price, product.discount)
          )}</h6>
          <h6 class="text-muted ml-2"><del>${formatCurrencyNumber(
            product.price
          )}</del></h6>
        </div>
      </div>
      <div
        class="card-footer d-flex justify-content-between bg-light border"
      >
        <a href="detail.html?id=${product._id}" class="btn btn-sm text-dark p-0"
          ><i class="fas fa-eye text-primary mr-1"></i>View Detail</a
        >
        <a href="" class="btn btn-sm text-dark p-0" id="btn-cart" 
        data-id=${product._id}
          ><i class="fas fa-shopping-cart text-primary mr-1"></i>Add To
          Cart</a
        >
      </div>
    </div>`;
    whitelistWrapper.appendChild(productItem);
  });
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
  await renderWhitelistProduct(whitelist, "whitelist-product");
  await renderSidebar("#sidebar-category");
  // Handle whitelist
  window.addEventListener("load", () => {
    const buttonDeleteWhiteList = document.querySelectorAll(
      ".card-delete-whitelist"
    ) as NodeListOf<HTMLDivElement>;
    let infoUser: AccessTokenData;
    buttonDeleteWhiteList.forEach((btn) => {
      btn.addEventListener("click", () => {
        const productID = btn.closest("div")?.dataset.id;
        if (accessToken !== null && accessTokenAdmin !== null) {
          infoUser = JSON.parse(accessToken);
        } else if (accessToken !== null && accessTokenAdmin === null) {
          infoUser = JSON.parse(accessToken);
        } else if (accessToken === null && accessTokenAdmin !== null) {
          infoUser = JSON.parse(accessTokenAdmin);
        } else {
          toast.info("Please login to add whitelist");
          setTimeout(() => {
            window.location.assign("login.html");
          }, 3000);
        }
        const { id } = infoUser;
        const item: WhiteLists = {
          productID,
          userID: id,
        };
        if (item) {
          Swal.fire({
            title: "Xoá sản phẩm yêu thích?",
            text: "Sản phẩm sẽ mất khỏi phần yêu thích!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Huỷ bỏ",
          }).then((result) => {
            if (result.isConfirmed) {
              const index: number = whitelist.findIndex(
                (x) => x.productID === item.productID
              );
              btn.parentElement?.parentElement?.remove();
              if (index >= 0) whitelist.splice(index, 1);
              Swal.fire({
                title: "Xoá thành công!",
                text: "Sản phẩm đã được xoá",
                icon: "success",
              });
              localStorage.setItem("whitelist", JSON.stringify(whitelist));
              displayNumberWhitelist("whitelist-order", whitelist);
            }
          });
        }
      });
    });
  });
})();
