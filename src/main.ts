import {
  calcPrice,
  formatCurrencyNumber,
  showSpinner,
  hideSpinner,
  sweetAlert,
  displayNumberWhitelist,
  handleWhitelist,
  handleViewModal,
  renderAccountInfo,
  displayNumOrder,
  renderSidebar,
  addProductToCart,
} from "./utils";
import { Carts, Params, WhiteLists } from "./constants";
import { ProductProps, Product } from "./models/Product";

// functions
async function renderLatestProduct(idElement: string) {
  const container = document.querySelector(idElement);
  if (!container) return;
  container.textContent = "";
  try {
    showSpinner();
    const data = await Product.loadAll();
    hideSpinner();
    const productClone = [...data].slice(0, 8);
    productClone.forEach((item: ProductProps) => {
      const productItem = document.createElement("div");
      productItem.className = "col-lg-3 col-md-6 col-sm-12 pb-1";
      productItem.innerHTML = `<div class="card product-item border-0 mb-4" id="card-custom">
      <div class="card-sale">
        <span>${item.discount > 0 ? item.discount + "%" : ""}</span>
      </div>
      <div class="card-whitelist" data-id=${item._id}>
      <span>
        <i class="fas fa-heart" style="color: inherit;"></i>
        </span>
      </div>
      <div class="card-modal" data-id=${item._id}>
      <span>
        <i class="fas fa-eye" style="color: inherit;"></i>
        </span>
      </div>
      <div
        class="card-header product-img position-relative overflow-hidden bg-transparent border p-0"
      >
      <a href="detail.html?id=${
        item._id
      }"><img class="img-fluid w-100" style="height: 220px; object-fit: contain; margin: 0 auto;" src="${
        item.thumb.fileName
      }" alt="${item.name}" /></a>
      </div>
      <div
        class="card-body border-left border-right text-center p-0 pt-4 pb-3"
      >
        <a href="detail.html?id=${
          item._id
        }" class='text-decoration-none'><h6 class="text-truncate mb-3">${
        item.name
      }</h6></a>
        <div class="d-flex justify-content-center">
          <h6>${formatCurrencyNumber(calcPrice(item.price, item.discount))}</h6>
          <h6 class="text-muted ml-2"><del>${formatCurrencyNumber(
            item.price
          )}</del></h6>
        </div>
      </div>
      <div
        class="card-footer d-flex justify-content-between bg-light border"
      >
        <a href="detail.html?id=${item._id}" class="btn btn-sm text-dark p-0"
          ><i class="fas fa-eye text-primary mr-1"></i>View Detail</a
        >
        <a href="" class="btn btn-sm text-dark p-0" id="btn-cart" 
        data-id=${item._id}
          ><i class="fas fa-shopping-cart text-primary mr-1"></i>Add To
          Cart</a
        >
      </div>
    </div>`;
      container.appendChild(productItem);
    });
  } catch (error) {
    console.log(error);
  }
}
async function renderArrivedProduct(idElement: string) {
  const container = document.querySelector(idElement);
  if (!container) return;
  container.textContent = "";
  try {
    showSpinner();
    const data = await Product.loadAll();
    hideSpinner();
    const productClone = [...data].slice(8, 16);
    productClone.forEach((item: ProductProps) => {
      const productItem = document.createElement("div");
      productItem.className = "col-lg-3 col-md-6 col-sm-12 pb-1";
      productItem.innerHTML = `<div class="card product-item border-0 mb-4" id="card-custom">
      <div class="card-sale">
        <span>${item.discount > 0 ? item.discount + "%" : ""}</span>
      </div>
      <div class="card-whitelist" data-id=${item._id}>
        <span>
          <i class="fas fa-heart" style="color: inherit;"></i>
        </span>
      </div>
      <div class="card-modal" data-id=${item._id}>
      <span>
        <i class="fas fa-eye" style="color: inherit;"></i>
        </span>
      </div>
      <div
        class="card-header product-img position-relative overflow-hidden bg-transparent border p-0"
      >
        <a href="detail.html?id=${
          item._id
        }"><img class="img-fluid w-100" style="height: 220px; object-fit: contain; margin: 0 auto;" src="${
        item.thumb.fileName
      }" alt="${item.name}" /></a>
      </div>
      <div
        class="card-body border-left border-right text-center p-0 pt-4 pb-3"
      >
        <a href="detail.html?id=${
          item._id
        }" class='text-decoration-none'><h6 class="text-truncate mb-3">${
        item.name
      }</h6></a>
        <div class="d-flex justify-content-center">
          <h6>${formatCurrencyNumber(calcPrice(item.price, item.discount))}</h6>
          <h6 class="text-muted ml-2"><del>${formatCurrencyNumber(
            item.price
          )}</del></h6>
        </div>
      </div>
      <div
        class="card-footer d-flex justify-content-between bg-light border"
      >
        <a href="detail.html?id=${item._id}" class="btn btn-sm text-dark p-0"
          ><i class="fas fa-eye text-primary mr-1"></i>View Detail</a
        >
        <a href="" class="btn btn-sm text-dark p-0" id="btn-cart" data-id=${
          item._id
        }
          ><i class="fas fa-shopping-cart text-primary mr-1"></i>Add To
          Cart</a
        >
      </div>
    </div>`;
      container.appendChild(productItem);
    });
  } catch (error) {
    console.log(error);
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
  displayNumOrder("num-order", cart);
  displayNumberWhitelist("whitelist-order", whitelist);
  await renderSidebar("#sidebar-category");
  await renderLatestProduct("#latest-product");
  await renderArrivedProduct("#arrived-product");
  if (accessToken !== null && accessTokenAdmin !== null) {
    renderAccountInfo("account");
  } else {
    if (typeof accessToken === "string") {
      renderAccountInfo("account");
    } else if (typeof accessTokenAdmin === "string") {
      renderAccountInfo("account");
    }
  }
  // Handle cart
  const buttonCart = document.querySelectorAll(
    "#btn-cart"
  ) as NodeListOf<Element>;
  buttonCart.forEach((btn) => {
    btn.addEventListener("click", async (e: Event) => {
      e.preventDefault();
      const buttonElement = e.target as HTMLAnchorElement;
      const productID: string | undefined = buttonElement.dataset.id;
      if (productID) {
        sweetAlert.success();
        const params: Params = {
          productID,
          cart,
          quantity: 1,
        };
        cart = await addProductToCart(params);
      }
    });
  });
  // Handle whitelist
  handleWhitelist(".card-whitelist");
  handleViewModal(".card-modal");
})();
