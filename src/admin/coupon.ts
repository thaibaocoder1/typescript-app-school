import { CounponProps, Coupon } from "../models/Coupon";
import dayjs from "dayjs";
import { initLogout, toast } from "../utils";
import { initRemoveCoupon } from "../utils/form-coupon";
import debounce from "debounce";

// functions
async function renderListCoupon(selector: string, coupons: CounponProps[]) {
  const table = document.querySelector(selector) as HTMLTableElement;
  if (!table) return;
  const tableBody = table.getElementsByTagName(
    "tbody"
  )[0] as HTMLTableSectionElement;
  if (!tableBody) return;
  tableBody.textContent = "";
  try {
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
async function initSearchInput(selector: string, coupons: CounponProps[]) {
  const inputSearch = document.getElementById(selector) as HTMLInputElement;
  if (inputSearch) {
    const debounceFn = debounce(async (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target) {
        const couponApply = coupons.filter((item) =>
          item.name.toLowerCase().includes(target.value.toLowerCase())
        );
        if (couponApply.length > 0) {
          await renderListCoupon("#table-coupon", couponApply);
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
  const coupons = (await Coupon.loadAll()) as CounponProps[];
  await renderListCoupon("#table-coupon", coupons);
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
  await initSearchInput("searchInput", coupons);
  initLogout("logout-btn");
})();
