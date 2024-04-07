import debounce from "debounce";
import { ApiResponseProducts, Product, ProductProps } from "../models/Product";
import { hideSpinner, showSpinner } from "./spinner";
import { calcPrice, formatCurrencyNumber } from "./format";

function renderListProduct(selector: string, products: ProductProps[]) {
  const searchWrapper = document.querySelector(selector) as HTMLDivElement;
  searchWrapper.innerHTML = "";
  if (Array.isArray(products) && products.length > 0) {
    searchWrapper.classList.add("is-show");
    products.forEach((item) => {
      const productItem = document.createElement("div");
      productItem.className = "search-item";
      productItem.innerHTML = `<a href="/detail.html?id=${item._id}">
      <img
      src="${item.thumb.fileName}"
      class="img-thumbnail search-img"
      alt="${item.name}"
      />
      </a>
      <div class="search-content">
        <a href="/detail.html?id=${item._id}"><p class="search-name">${
        item.name
      }</p></a>
        <div class="search-price">
          <span class="search-price-discount">${formatCurrencyNumber(
            calcPrice(item.price, item.discount)
          )}</span>
          <span class="search-price-original">Sale ${item.discount}%</span>
        </div>
      </div>`;
      searchWrapper.appendChild(productItem);
    });
  }
}
async function handleFilterChange(
  filterName: string,
  filterValue: string | number
) {
  const url = new URL(window.location.href);
  url.searchParams.set(filterName, filterValue as string);
  if (filterValue !== "") {
    history.pushState({}, "", url);
    showSpinner();
    const res = (await Product.loadWithParams(
      url.searchParams
    )) as ApiResponseProducts<ProductProps>;
    hideSpinner();
    if (res.status === "success") {
      const { data } = res;
      renderListProduct(".search-list", data as ProductProps[]);
    }
  } else {
    const searchWrapper = document.querySelector(
      ".search-list"
    ) as HTMLDivElement;
    searchWrapper && searchWrapper.classList.remove("is-show");
    history.pushState({}, "", url);
  }
}
export async function initSearchProduct() {
  const searchForm = document.getElementById("searchForm") as HTMLFormElement;
  const searchInput = searchForm.querySelector(
    "#searchInput"
  ) as HTMLInputElement;
  const url = new URL(window.location.href);
  if (searchInput) {
    const debounceChange = debounce(async (e: Event) => {
      const target = e.target as HTMLInputElement;
      url.searchParams.set("searchTerm", target.value);
      await handleFilterChange("searchTerm", target.value);
    }, 500);
    searchInput.addEventListener("input", debounceChange);
  }
}
