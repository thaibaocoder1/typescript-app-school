import debounce from "debounce";
import { ApiResponseAuth } from "../active";
import { User, UserProps } from "../models/User";
import { initLogout, toast } from "../utils";

// functions
async function renderListUsers(selector: string, users: UserProps[]) {
  const table = document.querySelector(selector) as HTMLTableElement;
  if (!table) return;
  const tableBody = table.getElementsByTagName(
    "tbody"
  )[0] as HTMLTableSectionElement;
  if (!tableBody) return;
  tableBody.textContent = "";
  try {
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
async function initSearchInput(selector: string, users: UserProps[]) {
  const inputSearch = document.getElementById(selector) as HTMLInputElement;
  if (inputSearch) {
    const debounceFn = debounce(async (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target) {
        const userApply = users.filter((item) =>
          item.fullname.toLowerCase().includes(target.value.toLowerCase())
        );
        if (userApply.length > 0) {
          await renderListUsers("#table-user", userApply);
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
  const users = await User.loadAll();
  await renderListUsers("#table-user", users);
  const buttonEdit = document.querySelectorAll(
    "#btn-edit"
  ) as NodeListOf<HTMLButtonElement>;
  const buttonDelete = document.querySelectorAll(
    "#btn-delete"
  ) as NodeListOf<HTMLButtonElement>;
  const modalDelete = document.getElementById("deleteModal") as HTMLElement;
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
        modalDelete.dataset.id = userID;
      }
    });
  });
  modalDelete.addEventListener("click", async (e: Event) => {
    const target = e.target as Element;
    if (target.closest("a#delete-btn")) {
      e.preventDefault();
      const userID = modalDelete.dataset.id as string;
      try {
        if (userID) {
          const res = await User.softDelete(userID);
          const remove: ApiResponseAuth = await res.json();
          if (remove.success) {
            toast.success(remove.message);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            toast.error(remove.message);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
  await initSearchInput("searchInput", users);
  initLogout("logout-btn");
})();
