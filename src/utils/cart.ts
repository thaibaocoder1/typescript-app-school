import { calcPrice, formatCurrencyNumber } from ".";
import { Params, Carts } from "../main";
import { Product } from "../models/Product";

type ParamsCart = {
  [k: string]: string;
};
export const paramsCart: ParamsCart = {
  tableElement: "#table-cart",
  subtotalElement: "subtotal-cart",
  totalElement: "total-cart",
  numOrderElement: "num-order",
};

export async function renderListProductInCart(
  params: ParamsCart,
  cart: Carts[]
) {
  const table = document.querySelector(params.tableElement) as HTMLTableElement;
  if (!table) return;
  const tableBody = table.getElementsByTagName(
    "tbody"
  )[0] as HTMLTableSectionElement;
  tableBody.textContent = "";
  const subTotalCart = document.getElementById(
    params.subtotalElement
  ) as HTMLElement;
  const totalCart = document.getElementById(params.totalElement) as HTMLElement;
  const numOrderCart = document.getElementById(
    params.numOrderElement
  ) as HTMLElement;
  let totalQuantity: number = 0;
  let subtotal: number = 0;
  let total: number = 0;
  try {
    cart.forEach(async (item) => {
      subtotal += item.price * item.quantity;
      totalQuantity += item.quantity;
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
      numOrderCart.innerText = `${totalQuantity}`;
    });
  } catch (error) {
    console.log("Error", error);
  }
}

export async function addProductToCart(params: Params) {
  let { cart, productID } = params;
  let cartItemIndex: number = cart.findIndex((x) => x.productID === productID);
  const product = await Product.loadOne(productID);
  const price = calcPrice(product.price, product.discount);
  if (cart.length <= 0) {
    cart = [
      {
        productID,
        quantity: params.quantity,
        price,
      },
    ];
  } else if (cartItemIndex < 0) {
    cart.push({
      productID,
      quantity: params.quantity,
      price,
    });
  } else {
    cart[cartItemIndex].quantity += params.quantity;
  }
  await renderListProductInCart(paramsCart, cart);
  addCartToStorage(cart);
  displayNumOrder("num-order", cart);
  return cart;
}
export function displayNumOrder(selector: string, cart: Carts[]): void {
  const numOrderElement = document.getElementById(selector) as HTMLElement;
  const totalQuantity: number = cart.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);
  numOrderElement.innerText = `${totalQuantity}`;
}
export function addCartToStorage(cartCopy: Carts[]): void {
  return localStorage.setItem("cart", JSON.stringify(cartCopy));
}
