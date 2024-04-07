import {
  calcPrice,
  formatCurrencyNumber,
  showSpinner,
  hideSpinner,
  sweetAlert,
  displayNumberWhitelist,
  renderAccountInfo,
  addProductToCart,
  displayNumOrder,
  handleViewModal,
  toast,
  handleWhitelist,
} from "./utils";
import { CatalogProps, Catalog } from "./models/Catalog";
import { ProductProps, Product, ApiResponseProducts } from "./models/Product";
import { Carts, Params, ParamsProudct, WhiteLists } from "./constants";
import debounce from "debounce";
import { handleOrderBuyNow } from "./utils/order-buy-now";

// types
type Pagination = {
  page: number;
  limit: number;
  totalRows: number;
};
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
async function renderListProduct(params: ParamsProudct, data: ProductProps[]) {
  const listProductEl = document.querySelector(params.idElement) as HTMLElement;
  if (!listProductEl) return;
  listProductEl.textContent = "";
  const ulPagination = document.getElementById("pagination") as HTMLElement;
  try {
    let products = [...data];
    if (params.slug) {
      showSpinner();
      const dataWithSlug = (await Product.loadWithParams(
        <URLSearchParams>params.slug
      )) as ApiResponseProducts<ProductProps>;
      hideSpinner();
      if (dataWithSlug.status === "success") {
        products = <ProductProps[]>dataWithSlug.data;
      }
    }

    if (products && products.length > 0) {
      if (ulPagination.hidden) ulPagination.hidden = false;
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
            <img class="img-fluid w-100" style="height: 220px; object-fit: contain;" src="${
              item.thumb.fileName
            }" alt="${item.name}" />
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
      const ulPagination = document.getElementById("pagination") as HTMLElement;
      ulPagination.hidden = true;
      toast.info("Sản phẩm đang được phát triển.");
    }
  } catch (error) {
    console.log(error);
  }
}
function initSearch(selector: string, params: URLSearchParams, cart: Carts[]) {
  const inputSearch = document.getElementById(selector) as HTMLInputElement;
  if (params.has("searchTerm")) {
    inputSearch.value = params.get("searchTerm") as string;
  }
  if (inputSearch) {
    const debounceSearch = debounce(async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const value = target.value;
      await handleFilterChange("searchTerm", value, cart);
    }, 500);
    inputSearch.addEventListener("input", debounceSearch);
  }
}
function renderPagination(
  selector: string,
  data: Pagination,
  params: URLSearchParams
) {
  const paramsClone = new URLSearchParams(params);
  if (paramsClone.has("page")) paramsClone.delete("page");
  const ulPagination = document.getElementById(selector) as HTMLElement;
  const { page, totalRows, limit } = data;
  const totalPages = Math.ceil(totalRows / limit);
  ulPagination.dataset.totalPages = totalPages.toString();
  ulPagination.innerHTML = ""; // Clear previous pagination

  // Previous link
  const prevLink = document.createElement("li");
  prevLink.className = "page-item";
  if (page === 1) {
    prevLink.classList.add("disabled");
    prevLink.innerHTML = `<span class="page-link">&laquo;</span>`;
  } else {
    prevLink.innerHTML = `<a class="page-link" data-page=${Math.max(
      page - 1,
      1
    )} href="?page=${Math.max(page - 1, 1)}&${paramsClone}">&laquo;</a>`;
  }
  ulPagination.appendChild(prevLink);

  // Page links
  for (let i = 1; i <= totalPages; ++i) {
    const liElement = document.createElement("li");
    liElement.className = "page-item";
    liElement.innerHTML = `<a class="page-link" data-page=${i} href="?page=${i}&${paramsClone}">${i}</a>`;
    if (i === page) {
      liElement.classList.add("active");
    }
    ulPagination.appendChild(liElement);
  }

  // Next link
  const nextLink = document.createElement("li");
  nextLink.className = "page-item";
  if (page === totalPages) {
    nextLink.classList.add("disabled");
    nextLink.innerHTML = `<span class="page-link">&raquo;</span>`;
  } else {
    nextLink.innerHTML = `<a class="page-link" data-page=${Math.min(
      page + 1,
      totalPages
    )} href="?page=${Math.min(
      page + 1,
      totalPages
    )}&${paramsClone}">&raquo;</a>`;
  }
  ulPagination.appendChild(nextLink);
}
async function handleFilterChange(
  filterName: string,
  filterValue: string | number,
  cart?: Carts[]
) {
  const url = new URL(window.location.href);
  if (filterName === "searchTerm") {
    url.searchParams.set("page", "1");
  }
  url.searchParams.set(filterName, filterValue as string);
  history.pushState({}, "", url);
  showSpinner();
  const res = (await Product.loadWithParams(
    url.searchParams
  )) as ApiResponseProducts<ProductProps>;
  hideSpinner();
  const paramsFn: ParamsProudct = {
    idElement: "#list-product",
    slug: url.searchParams,
  };
  if (res.status === "success") {
    const { data, pagination } = res;
    const paramsPagination = pagination as Pagination;
    await renderListProduct(paramsFn, <ProductProps[]>data);
    renderPagination("pagination", paramsPagination, url.searchParams);
    // Handle whitelist
    handleWhitelist(".card-whitelist");
    handleViewModal(".card-modal");
    if (cart) {
      handleOrderBuyNow("#modal-view", cart);
    }
  }
}
function initURL(): URLSearchParams {
  const url: URL = new URL(window.location.href);
  if (!url.searchParams.get("page")) url.searchParams.set("page", "1");
  if (!url.searchParams.get("limit")) url.searchParams.set("limit", "3");
  history.pushState({}, "", url);
  return url.searchParams;
}

// main
(async () => {
  // init pagination
  const queryParams = initURL();
  showSpinner();
  const res = (await Product.loadWithParams(
    queryParams
  )) as ApiResponseProducts<ProductProps>;
  hideSpinner();

  const paramsFn: ParamsProudct = {
    idElement: "#list-product",
    slug: queryParams,
  };

  if (res.status === "success") {
    const { data, pagination } = res;
    const paramsPagination = pagination as Pagination;
    await renderListProduct(paramsFn, <ProductProps[]>data);
    renderPagination("pagination", paramsPagination, queryParams);
  }

  // end init pagination
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
  // Search
  initSearch("search", queryParams, cart);
  displayNumOrder("num-order", cart);
  if (accessToken !== null && accessTokenAdmin !== null) {
    renderAccountInfo("account");
    displayNumberWhitelist("whitelist-order", whitelist);
  } else {
    if (typeof accessToken === "string") {
      renderAccountInfo("account");
      displayNumberWhitelist("whitelist-order", whitelist);
    } else if (typeof accessTokenAdmin === "string") {
      renderAccountInfo("account");
      displayNumberWhitelist("whitelist-order", whitelist);
    }
  }
  await renderSidebar("#sidebar-category");
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
  handleOrderBuyNow("#modal-view", cart);
  // Hash
  let productApply: ProductProps[] = [];
  window.addEventListener("hashchange", async (e: HashChangeEvent) => {
    const newURL = e.newURL;
    console.log(newURL);
    showSpinner();
    const res = (await Product.loadWithParams(
      queryParams
    )) as ApiResponseProducts<ProductProps>;
    hideSpinner();
    console.log(res);
    toast.info("Filter success!");
    if (newURL.indexOf("increase") >= 0) {
      productApply = (res.data as ProductProps[]).sort(
        (a, b) => a.price - b.price
      );
    } else if (newURL.indexOf("decrease") >= 0) {
      productApply = (res.data as ProductProps[]).sort(
        (a, b) => b.price - a.price
      );
    } else {
      productApply = (res.data as ProductProps[]).sort(
        (a, b) => b.discount - a.discount
      );
    }
    await renderListProduct(paramsFn, productApply);
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
    handleOrderBuyNow("#modal-view", cart);
  });
})();
