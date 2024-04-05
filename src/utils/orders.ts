import { formatCurrencyNumber, hideSpinner, showSpinner } from ".";
import { AccessTokenData } from "../constants";
import { OrderDetail, OrderDetailProps } from "../models/Detail";
import { Order, OrderProps } from "../models/Order";
import { ProductProps } from "../models/Product";

export async function displayListOrder(token: string, selector: string) {
  const decodeToken: AccessTokenData = JSON.parse(token);
  const table = document.getElementById(selector) as HTMLTableElement;
  const tableBody = table.querySelector("tbody") as HTMLTableSectionElement;
  try {
    showSpinner();
    const orders = await Order.loadAll();
    hideSpinner();
    tableBody.textContent = "";
    if (Array.isArray(orders) && orders.length > 0) {
      orders.forEach((item, index) => {
        const tableRow = document.createElement("tr");
        tableRow.innerHTML = `<th scope="row">${index + 1}</th>
        <td>${item.fullname}</td>
        <td>${item.phone}</td>
        <td>${item.address}</td>
        <td>
          <button class="btn btn-primary btn-sm" id="detail" data-id=${
            item._id
          }>Detail</button>
          <button class="btn btn-danger btn-sm" id="cancel" data-id=${
            item._id
          }>Cancel</button>
        </td>`;
        tableBody.appendChild(tableRow);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

function getProductName(item: ProductProps): string {
  let name: string = "";
  Object.entries(item).forEach(([key, value]) => {
    if (key === "name" && typeof key === "string") {
      name = value;
      return name;
    }
  });
  return name;
}
function getImage(item: ProductProps): string {
  let imageUrl: string = "";
  Object.entries(item).forEach(([key, value]) => {
    if (key === "thumb" && typeof key === "string") {
      imageUrl = value.fileName;
      return imageUrl;
    }
  });
  return imageUrl;
}
function getStatusOrder(item: OrderProps): string {
  let status: string = "";
  switch (item.status) {
    case 1:
      status = "Chờ xác nhận";
      break;
    case 2:
      status = "Đã xác nhận + vận chuyển";
      break;
    case 3:
      status = "Đã nhận hàng";
      break;
    case 4:
      status = "Đã nhận hàng";
      break;
    default:
      break;
  }
  return status;
}
const modalDetail = document.getElementById(
  "order-detail-modal"
) as HTMLDivElement;

window.addEventListener("load", () => {
  const buttonDetail = document.querySelectorAll(
    "button#detail"
  ) as NodeListOf<HTMLButtonElement>;
  const table = modalDetail.querySelector("table") as HTMLTableElement;
  const tableBody = table.querySelector("tbody") as HTMLTableSectionElement;
  const bill = modalDetail.querySelector("#bill") as HTMLDivElement;
  buttonDetail.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const orderID = btn.dataset.id as string;
      if (orderID) {
        modalDetail && modalDetail.classList.add("is-show");
        const orders = (await OrderDetail.loadOne(
          orderID
        )) as unknown as OrderDetailProps[];
        tableBody.textContent = "";
        let total: number = 0;
        if (Array.isArray(orders) && orders.length > 0) {
          orders.forEach((item) => {
            total += item.quantity * item.price;
            const name: string = getProductName(item.productID as ProductProps);
            const image: string = getImage(item.productID as ProductProps);
            const status: string = getStatusOrder(item.orderID as OrderProps);
            const tableRow = document.createElement("tr");
            tableRow.innerHTML = `
            <th scope="col">${name}</th>
            <th scope="col">
              <img src="${image}" class="img-thumbnail" style="width: 120px;" alt="${name}">
            </th>
            <th scope="col">${item.quantity}</th>
            <th scope="col">${formatCurrencyNumber(item.price)}</th>
            <th scope="col">${formatCurrencyNumber(
              item.price * item.quantity
            )}</th> 
          `;
            tableBody.appendChild(tableRow);
            bill.innerHTML = `<h6 id="total-bill">Tổng hoá đơn: ${formatCurrencyNumber(
              total
            )}</h6>
            <h6 class="status-bill">Trạng thái: ${status}</h6>`;
          });
        }
      }
    });
  });
});

window.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if (target.closest("button.btn-close")) {
    modalDetail && modalDetail.classList.remove("is-show");
  } else if (target.closest("div#order-detail-modal")) {
    modalDetail && modalDetail.classList.remove("is-show");
  }
});
