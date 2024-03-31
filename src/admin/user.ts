import { User, UserProps } from "../models/User";
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
    const users = await User.loadAll();
    if (users.length > 0 && Array.isArray(users)) {
      users.forEach((item: UserProps, index: number) => {
        const tableRow = document.createElement("tr") as HTMLTableRowElement;
        tableRow.innerHTML = `<th scope="row">${index + 1}</th>
        <td>${item.fullname}</td>
        <td>${item.username}</td>
        <td>${item.email}</td>
        <td>${item.phone}</td>
        <td>${item.role}</td>
        <td>
          <button class="btn btn-primary btn-sm" data-id=${
            item._id
          } id="btn-edit">Chỉnh sửa</button>
          <button class="btn btn-secondary btn-sm" data-id=${
            item._id
          }  data-toggle="modal"
          data-target="#deleteModal" id="btn-delete">Xoá</button>
        </td>`;
        tableBody.appendChild(tableRow);
      });
    } else {
      const tableRow = document.createElement("tr") as HTMLTableRowElement;
      tableRow.innerHTML = `<th scope="row" colspan="9">Chưa có khách hàng nào. <a href="/admin/add-edit-user.html">Thêm ngay</a></th>`;
      tableBody.appendChild(tableRow);
    }
  } catch (error) {
    console.log("Error", error);
  }
}
// main
(async () => {
  await renderListCategory("#table-user");
  const buttonEdit = document.querySelectorAll(
    "#btn-edit"
  ) as NodeListOf<HTMLButtonElement>;
  const buttonDelete = document.querySelectorAll(
    "#btn-delete"
  ) as NodeListOf<HTMLButtonElement>;
  buttonEdit.forEach((btn) => {
    btn.addEventListener("click", () => {
      const userID = btn.dataset.id;
      userID && window.location.assign("add-edit-user.html?id=" + userID);
    });
  });
  buttonDelete.forEach((btn) => {
    btn.addEventListener("click", () => {
      const userID = btn.dataset.id;
      if (userID) {
        console.log(userID);
      }
    });
  });
  initLogout("logout-btn");
})();
