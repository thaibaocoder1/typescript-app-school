import { calcPrice, formatCurrencyNumber } from "./format";
import { Params, Carts } from "../constants";
import { Product } from "../models/Product";
import Swal from "sweetalert2";
import { toast } from ".";

export type ParamsCart = {
  [k: string]: string;
};
export const paramsQuantity: ParamsCart = {
  subTotal: "subtotal-cart",
  total: "total-cart",
  ship: "ship-cost",
};
export const paramsCart: ParamsCart = {
  tableElement: "#table-cart",
  subtotalElement: "subtotal-cart",
  shipElement: "#ship-cost",
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
  const shipCostElement = document.querySelector(
    params.shipElement
  ) as HTMLElement;
  const numOrderCart = document.getElementById(
    params.numOrderElement
  ) as HTMLElement;
  let totalQuantity: number = 0;
  let subtotal: number = 0;
  let total: number = 0;
  let shipping: number = 0;
  try {
    if (cart.length > 0) {
      cart.forEach(async (item) => {
        subtotal += item.price * item.quantity;
        shipping += item.quantity * 5000;
        total = subtotal + shipping;
        totalQuantity += item.quantity;
        const product = await Product.loadOne(item.productID);
        const tableRow = document.createElement("tr") as HTMLTableRowElement;
        tableRow.dataset.id = item.productID;
        tableRow.innerHTML = `
        <td class="align-middle" style="text-align: left;">
          <img src="${product.thumb.fileName}" alt="${
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
              value="${item.quantity}" name="quantity" data-id=${item.productID}
            />
            <div class="input-group-btn">
              <button class="btn btn-sm btn-primary btn-plus">
                <i class="fa fa-plus"></i>
              </button>
            </div>
          </div>
        </td>
        <td class="align-middle" id="subtotal-product">${formatCurrencyNumber(
          item.price * item.quantity
        )}</td>
        <td class="align-middle">
          <button class="btn btn-sm btn-primary btn-trash" data-id=${
            item.productID
          } id="btn-trash">
            <i class="fa fa-times"></i>
          </button>
        </td>
      `;
        tableBody.appendChild(tableRow);
        subTotalCart.innerText = formatCurrencyNumber(subtotal);
        shipCostElement.innerText = formatCurrencyNumber(shipping);
        totalCart.innerText = formatCurrencyNumber(total);
        numOrderCart.innerText = `${totalQuantity}`;
      });
    } else {
      const tableRow = document.createElement("tr") as HTMLTableRowElement;
      tableRow.setAttribute("colspan", "5");
      tableRow.innerHTML = `Không có sản phẩm nào trong giỏ hàng. <a href="shop.html">Đi đến shop ngay</a>`;
      tableBody.appendChild(tableRow);
    }
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
export function calcTotalCart(params: ParamsCart, cart: Carts[]): void {
  const subtotalElement = document.getElementById(
    params.subTotal
  ) as HTMLElement;
  const totalElement = document.getElementById(params.total) as HTMLElement;
  const shippingElement = document.getElementById(params.ship) as HTMLElement;
  if (!subtotalElement) return;
  const subtotal: number = cart.reduce((sum, item) => {
    return sum + item.quantity * item.price;
  }, 0);
  const shipCost: number = cart.reduce((total, item) => {
    return total + item.quantity * 5000;
  }, 0);
  const sum: number = subtotal + shipCost;
  subtotalElement.innerText = `${formatCurrencyNumber(subtotal)}`;
  shippingElement.innerText = `${formatCurrencyNumber(shipCost)}`;
  totalElement.innerText = `${formatCurrencyNumber(sum)}`;
}
export async function handleChangeQuantity(
  type: string,
  inputElement: HTMLInputElement,
  cart: Carts[]
) {
  const productID = <string>inputElement.dataset.id;
  const index: number = cart.findIndex((x) => x.productID === productID);
  let currentValue = Number.parseInt(inputElement.value, 10);
  switch (type) {
    case "plus":
      if (index >= 0) {
        inputElement.value = (currentValue + 1).toString();
        cart[index].quantity = Number(inputElement.value);
      }
      break;
    case "minus":
      if (index >= 0) {
        let minValue = currentValue - 1;
        if (minValue === 0) {
          Swal.fire({
            title: "Xoá sản phẩm này?",
            text: "Sản phẩm sẽ bị xoá khỏi giỏ hàng!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Huỷ bỏ",
          }).then(function (result) {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Xoá thành công sản phẩm!",
                text: "Vào shop để chọn lại sản phẩm khác!",
                icon: "success",
              }).then(async function () {
                cart.splice(index, 1);
                const item =
                  inputElement.parentElement?.parentElement?.parentElement;
                item && item.remove();
                toast.success("Xoá thành công sản phẩm");
                addCartToStorage(cart);
                calcTotalCart(paramsQuantity, cart);
                if (cart.length === 0) {
                  toast.info("Giỏ hàng trống");
                  setTimeout(() => {
                    window.location.reload();
                  }, 500);
                }
              });
            } else {
              inputElement.value = "1";
            }
          });
        } else {
          inputElement.value = minValue.toString();
          cart[index].quantity = minValue;
        }
      }
      break;
    default:
      break;
  }
  addCartToStorage(cart);
  return cart;
}
