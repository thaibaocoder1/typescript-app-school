import { Order, OrderProps } from "../models/Order";
import dayjs from "dayjs";
import { initLogout } from "../utils";

// functions
async function renderListOrder(selector: string) {
  const table = document.querySelector(selector) as HTMLTableElement;
  if (!table) return;
  const tableBody = table.getElementsByTagName(
    "tbody"
  )[0] as HTMLTableSectionElement;
  if (!tableBody) return;
  tableBody.textContent = "";
  try {
    const orders = await Order.loadAll();
    orders.forEach((item: OrderProps, index: number) => {
      const tableRow = document.createElement("tr") as HTMLTableRowElement;
      tableRow.innerHTML = `<th scope="row">${index + 1}</th>
      <td>${item.fullname}</td>
      <td>${item.email}</td>
      <td>${item.phone}</td>
      <td>${item.address}</td>
      <td>
        <button class="btn btn-primary btn-sm" data-id=${
          item._id
        } data-toggle="modal" data-target="#detailModal" id="btn-edit">Chi tiết</button>
        <button class="btn btn-secondary btn-sm" data-id=${
          item._id
        } id="btn-status">Chỉnh sửa</button>
      </td>`;
      tableBody.appendChild(tableRow);
    });
  } catch (error) {
    console.log("Error", error);
  }
}
// main
(async () => {
  await renderListOrder("#table-order");
  const buttonEditCatalog = document.querySelectorAll(
    "#btn-edit"
  ) as NodeListOf<HTMLButtonElement>;
  buttonEditCatalog.forEach((btn) => {
    btn.addEventListener("click", () => {
      const catalogID = btn.dataset.id;
      console.log(catalogID);
    });
  });
  initLogout("logout-btn");
})();
