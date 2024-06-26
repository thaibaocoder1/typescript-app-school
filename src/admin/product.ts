// main
import dayjs from "dayjs";
import { Product, ProductProps } from "../models/Product";
import {
  calcPrice,
  formatCurrencyNumber,
  initLogout,
  showSpinner,
  toast,
} from "../utils";
import debounce from "debounce";

// functions
async function renderListProduct(selector: string, products: ProductProps[]) {
  const table = document.querySelector(selector) as HTMLTableElement;
  if (!table) return;
  const tableBody = table.getElementsByTagName(
    "tbody"
  )[0] as HTMLTableSectionElement;
  if (!tableBody) return;
  tableBody.textContent = "";
  try {
    products.forEach((item: ProductProps, index: number) => {
      const tableRow = document.createElement("tr") as HTMLTableRowElement;
      tableRow.innerHTML = `<th scope="row">${index + 1}</th>
      <td>${item.name}</td>
      <td>${formatCurrencyNumber(calcPrice(item.price, item.discount))}</td>
      <td>${item.discount}%</td>
      <td>${item.quantity}</td>
      <td>
        <img src="${item.thumb.fileName}" alt="${item.name}" height="80">
      </td>
      <td>${dayjs(item.createdAt).format("DD/MM/YYYY")}</td>
      <td>${dayjs(item.updatedAt).format("DD/MM/YYYY")}</td>
      <td>
        <button class="btn btn-primary btn-sm" data-id=${
          item._id
        } id="btn-edit">Chỉnh sửa</button>
      </td>`;
      tableBody.appendChild(tableRow);
    });
  } catch (error) {
    console.log("Error", error);
  }
}
async function initSearchInput(selector: string, products: ProductProps[]) {
  const inputSearch = document.getElementById(selector) as HTMLInputElement;
  if (inputSearch) {
    const debounceFn = debounce(async (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target) {
        const productApply = products.filter((item) =>
          item.name.toLowerCase().includes(target.value.toLowerCase())
        );
        if (productApply.length > 0) {
          await renderListProduct("#table-product", productApply);
        } else {
          toast.info("Not found apply value");
        }
      }
    }, 700);
    inputSearch.addEventListener("input", debounceFn);
  }
}
// main
(async () => {
  const products = (await Product.loadAll()) as ProductProps[];
  await renderListProduct("#table-product", products);
  const buttonEditProduct = document.querySelectorAll(
    "#btn-edit"
  ) as NodeListOf<HTMLButtonElement>;
  buttonEditProduct.forEach((btn) => {
    btn.addEventListener("click", () => {
      const productID = btn.dataset.id;
      productID &&
        window.location.assign("add-edit-product.html?id=" + productID);
    });
  });
  await initSearchInput("searchInput", products);
  initLogout("logout-btn");
})();
