import { Catalog, CatalogProps } from "../models/Catalog";
import dayjs from "dayjs";
import { initLogout, toast } from "../utils";
import debounce from "debounce";

// functions
async function renderListCategory(selector: string, catalogs: CatalogProps[]) {
  const table = document.querySelector(selector) as HTMLTableElement;
  if (!table) return;
  const tableBody = table.getElementsByTagName(
    "tbody"
  )[0] as HTMLTableSectionElement;
  if (!tableBody) return;
  tableBody.textContent = "";
  try {
    catalogs.forEach((item: CatalogProps, index: number) => {
      const tableRow = document.createElement("tr") as HTMLTableRowElement;
      tableRow.innerHTML = `<th scope="row">${index + 1}</th>
      <td>${item.title}</td>
      <td>${item._id}</td>
      <td>${dayjs(item.createdAt).format("DD/MM/YYYY HH:mm:ss")}</td>
      <td>${dayjs(item.updatedAt).format("DD/MM/YYYY HH:mm:ss")}</td>
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
async function initSearchInput(selector: string, catalogs: CatalogProps[]) {
  const inputSearch = document.getElementById(selector) as HTMLInputElement;
  if (inputSearch) {
    const debounceFn = debounce(async (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target) {
        const couponApply = catalogs.filter((item) =>
          item.title.toLowerCase().includes(target.value.toLowerCase())
        );
        if (couponApply.length > 0) {
          await renderListCategory("#table-category", couponApply);
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
  const catalogs = (await Catalog.loadAll()) as CatalogProps[];
  await renderListCategory("#table-category", catalogs);
  const buttonEditCatalog = document.querySelectorAll(
    "#btn-edit"
  ) as NodeListOf<HTMLButtonElement>;
  buttonEditCatalog.forEach((btn) => {
    btn.addEventListener("click", () => {
      const catalogID = btn.dataset.id;
      catalogID &&
        window.location.assign("add-edit-category.html?id=" + catalogID);
    });
  });
  await initSearchInput("searchInput", catalogs);
  initLogout("logout-btn");
})();
