import {
  calcPrice,
  formatCurrencyNumber,
  showSpinner,
  hideSpinner,
} from "./utils";
import { Catalogs, Catalog } from "./models/Catalog";
import { ProductProps, Product } from "./models/Product";

// interface
interface ParamsProudct {
  idElement: string;
  slug?: string | null;
}
// functions
async function renderSidebar(idElement: string) {
  const sidebar = document.querySelector(idElement) as HTMLElement;
  if (!sidebar) return;
  sidebar.textContent = "";
  try {
    showSpinner();
    const data = await Catalog.loadAll();
    hideSpinner();
    data.forEach((item: Catalogs) => {
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
  try {
    showSpinner();
    const data = await Product.loadAll();
    hideSpinner();
    let products = [...data];
    if (params.slug) {
      products = products.filter((item) => item.type === params.slug);
    }
    products.forEach((item: ProductProps) => {
      const productItem = document.createElement("div");
      productItem.className = "col-lg-4 col-md-6 col-sm-12 pb-1";
      productItem.innerHTML = `
      <div class="card product-item border-0 mb-4">
        <div
          class="card-header product-img position-relative overflow-hidden bg-transparent border p-0"
        >
          <a href="detail.html?id=${item._id}">
          <img class="img-fluid w-100" src="img/${item.thumb}" alt="/${
        item.name
      }" />
          </a>
        </div>
        <div
          class="card-body border-left border-right text-center p-0 pt-4 pb-3"
        >
          <a href="detail.html?id=${item._id}" class="text-decoration-none">
          <h6 class="text-truncate mb-3">${item.name}</h6>
          </a>
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
          <a href="" class="btn btn-sm text-dark p-0"
            ><i class="fas fa-shopping-cart text-primary mr-1"></i>Add
            To Cart</a
          >
        </div>
      </div>`;
      listProductEl.appendChild(productItem);
    });
  } catch (error) {
    console.log(error);
  }
}
// main
(async () => {
  const searchParamsURL: URLSearchParams = new URLSearchParams(location.search);
  const slug: string | null = searchParamsURL.get("slug");
  const paramsFn: ParamsProudct = {
    idElement: "#list-product",
    slug: slug,
  };
  renderListProduct(paramsFn);
  renderSidebar("#sidebar-category");
})();
