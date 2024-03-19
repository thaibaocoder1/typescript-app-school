import { User, UserProps } from "../models/User";

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
    const users = await User.loadAll();
    if (users.length > 0 && Array.isArray(users)) {
      users.forEach((item: UserProps, index: number) => {
        const tableRow = document.createElement("tr") as HTMLTableRowElement;
        tableRow.innerHTML = `<th scope="row">${index + 1}</th>
        <td>${item._id}</td>
        <td>${item.fullname}</td>
        <td>${item.username}</td>
        <td>${item.email}</td>
        <td>0${item.phone}</td>
        <td>${item.roleID}</td>
        <td>
          <button class="btn btn-primary" data-id=${
            item._id
          } id="btn-edit">Chỉnh sửa</button>
        </td>`;
        tableBody.appendChild(tableRow);
      });
    } else {
      const tableRow = document.createElement("tr") as HTMLTableRowElement;
      tableRow.innerHTML = `<th scope="row" colspan="8">Chưa có khách hàng nào. <a href="/admin/add-edit-user.html">Thêm ngay</a></th>`;
      tableBody.appendChild(tableRow);
    }
  } catch (error) {
    console.log("Error", error);
  }
}
// main
(async () => {
  await renderListCategory("#table-user");
  const buttonEditCatalog = document.querySelectorAll(
    "#btn-edit"
  ) as NodeListOf<HTMLButtonElement>;
  buttonEditCatalog.forEach((btn) => {
    btn.addEventListener("click", () => {
      const userID = btn.dataset.id;
      userID && window.location.assign("add-edit-user.html?id=" + userID);
    });
  });
})();
