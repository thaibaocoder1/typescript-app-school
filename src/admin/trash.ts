import { ApiResponseAuth } from "../active";
import { User, UserProps } from "../models/User";
import { initLogout, toast } from "../utils";

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
    const users = await User.loadRemove();
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
          } id="btn-recover">Khôi phục</button>
          <button class="btn btn-secondary btn-sm" data-id=${
            item._id
          }  data-toggle="modal"
          data-target="#deleteModal" id="btn-delete">Xoá</button>
        </td>`;
        tableBody.appendChild(tableRow);
      });
    } else {
      const tableRow = document.createElement("tr") as HTMLTableRowElement;
      tableRow.innerHTML = `<th scope="row" colspan="9">Thùng rác trống!!</th>`;
      tableBody.appendChild(tableRow);
    }
  } catch (error) {
    console.log("Error", error);
  }
}
// main
(async () => {
  await renderListCategory("#table-user");
  const buttonRecover = document.querySelectorAll(
    "#btn-recover"
  ) as NodeListOf<HTMLButtonElement>;
  const buttonDelete = document.querySelectorAll(
    "#btn-delete"
  ) as NodeListOf<HTMLButtonElement>;
  const modalDelete = document.getElementById("deleteModal") as HTMLElement;
  buttonRecover.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const userID = btn.dataset.id;
      if (userID) {
        const res = await User.restore(userID);
        const restore: ApiResponseAuth = await res.json();
        if (restore.success) {
          toast.success(restore.message);
          setTimeout(() => {
            window.location.assign("/admin/list-user.html");
          }, 1000);
        } else {
          toast.error(restore.message);
        }
      }
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
          const res = await User.delete(userID);
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
  initLogout("logout-btn");
})();
