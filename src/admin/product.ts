// main
import { Product, ProductProps } from "../models/Product";
import { calcPrice, formatCurrencyNumber } from "../utils";

// functions
async function renderListProduct(selector: string) {
  const table = document.querySelector(selector) as HTMLTableElement;
  if (!table) return;
  const tableBody = table.getElementsByTagName(
    "tbody"
  )[0] as HTMLTableSectionElement;
  if (!tableBody) return;
  tableBody.textContent = "";
  try {
    const products = await Product.loadAll();
    products.forEach((item: ProductProps, index: number) => {
      const tableRow = document.createElement("tr") as HTMLTableRowElement;
      tableRow.innerHTML = `<th scope="row">${index + 1}</th>
      <td>${item.name}</td>
      <td>${item._id}</td>
      <td>${formatCurrencyNumber(calcPrice(item.price, item.discount))}</td>
      <td>${item.discount}%</td>
      <td>${item.quantity}</td>
      <td>
        <img src="/img/${item.thumb.fileName}" alt="${item.name}" height="80">
      </td>
      <td>
        <button class="btn btn-primary" data-id=${
          item._id
        } id="btn-edit">Chỉnh sửa</button>
      </td>`;
      tableBody.appendChild(tableRow);
    });
  } catch (error) {
    console.log("Error", error);
  }
}
// main
(async () => {
  await renderListProduct("#table-product");
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
})();
