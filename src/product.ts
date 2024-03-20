import {
  calcPrice,
  formatCurrencyNumber,
  showSpinner,
  hideSpinner,
  sweetAlert,
  displayNumberWhitelist,
} from "./utils";
import { CatalogProps, Catalog } from "./models/Catalog";
import { ProductProps, Product } from "./models/Product";
import { addProductToCart, displayNumOrder } from "./utils/cart";
import { toast } from "./utils/toast";
import { handleWhitelist } from "./utils/whitelist";
import { Carts, Params, ParamsProudct, WhiteLists } from "./constants";
import { handleViewModal } from "./utils/modal";

// functions
async function renderSidebar(idElement: string) {
  const sidebar = document.querySelector(idElement) as HTMLElement;
  if (!sidebar) return;
  sidebar.textContent = "";
  try {
    showSpinner();
    const data = await Catalog.loadAll();
    hideSpinner();
    data.forEach((item: CatalogProps) => {
      const linkElement = document.createElement("a");
      linkElement.className = "nav-item nav-link";
      linkElement.href = `/shop.html?slug=${item.slug}`;
      linkElement.textContent = item.title;
      sidebar.appendChild(linkElement);
    });
  } catch (error) {
    console.log(error);
  }
}
async function renderListProduct(params: ParamsProudct) {
  const listProductEl = document.querySelector(params.idElement) as HTMLElement;
  if (!listProductEl) return;
  listProductEl.textContent = "";
  try {
    showSpinner();
    const data = await Product.loadAll();
    hideSpinner();
    let products = [...data];
    if (params.slug) {
      showSpinner();
      const dataWithSlug = await Product.loadWithSlug(params.slug);
      hideSpinner();
      if (dataWithSlug) {
        products = dataWithSlug;
      }
    }
    if (products && products.length > 0) {
      products.forEach((item: ProductProps) => {
        const productItem = document.createElement("div");
        productItem.className = "col-lg-4 col-md-6 col-sm-12 pb-1";
        productItem.innerHTML = `
        <div class="card product-item border-0 mb-4" id="card-custom">
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
            <a href="detail.html?id=${item._id}">
            <img class="img-fluid w-100" src="img/${
              item.thumb.fileName
            }" alt="/${item.name}" />
            </a>
          </div>
          <div
            class="card-body border-left border-right text-center p-0 pt-4 pb-3"
          >
            <a href="detail.html?id=${item._id}" class="text-decoration-none">
            <h6 class="text-truncate mb-3">${item.name}</h6>
            </a>
            <div class="d-flex justify-content-center">
            <h6>${formatCurrencyNumber(
              calcPrice(item.price, item.discount)
            )}</h6>
            <h6 class="text-muted ml-2"><del>${formatCurrencyNumber(
              item.price
            )}</del></h6>
          </div>
          </div>
          <div
            class="card-footer d-flex justify-content-between bg-light border"
          >
            <a href="detail.html?id=${
              item._id
            }" class="btn btn-sm text-dark p-0"
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
        listProductEl.appendChild(productItem);
      });
    } else {
      toast.info("Sản phẩm đang được phát triển.");
    }
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
  const searchParamsURL: URLSearchParams = new URLSearchParams(location.search);
  const slug: string | null = searchParamsURL.get("slug");
  const paramsFn: ParamsProudct = {
    idElement: "#list-product",
    slug: slug,
  };
  renderSidebar("#sidebar-category");
  await renderListProduct(paramsFn);
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
