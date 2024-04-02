import { CounponProps, Coupon } from "../models/Coupon";
import dayjs from "dayjs";
import { initLogout } from "../utils";
import { initRemoveCoupon } from "../utils/form-coupon";

// functions
async function renderListCoupon(selector: string) {
  const table = document.querySelector(selector) as HTMLTableElement;
  if (!table) return;
  const tableBody = table.getElementsByTagName(
    "tbody"
  )[0] as HTMLTableSectionElement;
  if (!tableBody) return;
  tableBody.textContent = "";
  try {
    const coupons = await Coupon.loadAll();
    coupons.forEach((item: CounponProps, index: number) => {
      const tableRow = document.createElement("tr") as HTMLTableRowElement;
      tableRow.innerHTML = `<th scope="row">${index + 1}</th>
      <td>${item.name}</td>
      <td>${item.value}</td>
      <td>${dayjs(item.expireIns).format("DD/MM/YYYY HH:mm:ss")}</td>
      <td>${dayjs(item.createdAt).format("DD/MM/YYYY HH:mm:ss")}</td>
      <td>${dayjs(item.updatedAt).format("DD/MM/YYYY HH:mm:ss")}</td>
      <td>
        <button class="btn btn-primary btn-sm" data-id=${
          item._id
        } id="btn-edit">Chỉnh sửa</button>
        <button class="btn btn-danger btn-sm" data-id=${
          item._id
        } data-toggle="modal" data-target="#removeModal" id="btn-remove">Xoá</button>
      </td>`;
      tableBody.appendChild(tableRow);
    });
  } catch (error) {
    console.log("Error", error);
  }
}
// main
(async () => {
  await renderListCoupon("#table-coupon");
  const buttonEditCoupon = document.querySelectorAll(
    "#btn-edit"
  ) as NodeListOf<HTMLButtonElement>;
  const buttonRemoveCoupon = document.querySelectorAll(
    "#btn-remove"
  ) as NodeListOf<HTMLButtonElement>;
  buttonEditCoupon.forEach((btn) => {
    btn.addEventListener("click", () => {
      const counponID = btn.dataset.id;
      counponID &&
        window.location.assign("add-edit-coupon.html?id=" + counponID);
    });
  });
  buttonRemoveCoupon.forEach((btn) => {
    btn.addEventListener("click", (e: Event) => {
      const counponID = (e.target as HTMLElement).dataset.id;
      if (counponID) {
        initRemoveCoupon(counponID, "removeModal");
      }
    });
  });
  initLogout("logout-btn");
})();
