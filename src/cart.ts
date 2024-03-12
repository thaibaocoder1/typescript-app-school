import { Carts } from "./main";
import { formatCurrencyNumber, showSpinner } from "./utils";
import { renderSidebar } from "./utils/sidebar";
import { Product } from "./models/Product";

// functions
async function renderListProductInCart(element: string, cart: Carts[]) {
  const table = document.querySelector(element) as HTMLTableElement;
  if (!table) return;
  const tableBody = table.getElementsByTagName(
    "tbody"
  )[0] as HTMLTableSectionElement;
  tableBody.textContent = "";
  const subTotalCart = document.getElementById("subtotal-cart") as HTMLElement;
  const totalCart = document.getElementById("total-cart") as HTMLElement;
  let totalQuantity: number = 0;
  let subtotal: number = 0;
  let total: number = 0;
  try {
    cart.forEach(async (item) => {
      subtotal += item.price * item.quantity;
      const product = await Product.loadOne(item.productID);
      const tableRow = document.createElement("tr") as HTMLTableRowElement;
      tableRow.innerHTML = `
      <td class="align-middle" style="text-align: left;">
        <img src="img/${product.thumb}" alt="${
        product.name
      }" style="width: 50px" />
      ${product.name}
      </td>
      <td class="align-middle">${formatCurrencyNumber(item.price)}</td>
      <td class="align-middle">
        <div
          class="input-group quantity mx-auto"
          style="width: 100px"
        >
          <div class="input-group-btn">
            <button class="btn btn-sm btn-primary btn-minus">
              <i class="fa fa-minus"></i>
            </button>
          </div>
          <input
            type="text"
            class="form-control form-control-sm bg-secondary text-center"
            value="${item.quantity}"
          />
          <div class="input-group-btn">
            <button class="btn btn-sm btn-primary btn-plus">
              <i class="fa fa-plus"></i>
            </button>
          </div>
        </div>
      </td>
      <td class="align-middle">${formatCurrencyNumber(
        item.price * item.quantity
      )}</td>
      <td class="align-middle">
        <button class="btn btn-sm btn-primary">
          <i class="fa fa-times"></i>
        </button>
      </td>
    `;
      tableBody.appendChild(tableRow);
      subTotalCart.innerText = formatCurrencyNumber(subtotal);
    });
  } catch (error) {
    console.log("Error", error);
  }
}
// main
(async () => {
  let isHasCart: string | null = localStorage.getItem("cart");
  let cart: Carts[] = [];
  if (typeof isHasCart === "string") {
    cart = JSON.parse(isHasCart);
  }
  await renderSidebar("#sidebar-category");
  await renderListProductInCart("#table-cart", cart);
})();
