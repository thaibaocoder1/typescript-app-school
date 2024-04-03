import { hideSpinner, showSpinner } from ".";
import { AccessTokenData } from "../constants";
import { Order } from "../models/Order";

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

window.addEventListener("load", () => {
  const modalDetail = document.getElementById(
    "order-detail-modal"
  ) as HTMLDivElement;
  const buttonDetail = document.querySelectorAll(
    "button#detail"
  ) as NodeListOf<HTMLButtonElement>;
  buttonDetail.forEach((btn) => {
    btn.addEventListener("click", () => {
      const orderID = btn.dataset.id as string;
      if (orderID) {
        modalDetail && modalDetail.classList.add("is-show");
      }
    });
  });
});
