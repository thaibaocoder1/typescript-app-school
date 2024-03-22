import { Catalog, CatalogProps } from "../models/Catalog";
import dayjs from "dayjs";
import { initLogout } from "../utils";

// functions
async function renderListCategory(selector: string) {
  const table = document.querySelector(selector) as HTMLTableElement;
  if (!table) return;
  const tableBody = table.getElementsByTagName(
    "tbody"
  )[0] as HTMLTableSectionElement;
  if (!tableBody) return;
  tableBody.textContent = "";
  try {
    const catalogs = await Catalog.loadAll();
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
// main
(async () => {
  await renderListCategory("#table-category");
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
  initLogout("logout-btn");
})();
