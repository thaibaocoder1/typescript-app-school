import { Order, OrderProps } from "../models/Order";
import dayjs from "dayjs";
import { formatCurrencyNumber, initLogout } from "../utils";
import { OrderDetail, OrderDetailProps } from "../models/Detail";
import { ProductProps } from "../models/Product";

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
      tableRow.innerHTML = `<td>${index + 1}</td>
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
function getProductName(item: ProductProps): string {
  let name: string = "";
  Object.entries(item).forEach(([key, value]) => {
    if (key === "name" && typeof key === "string") {
      name = value;
      return name;
    }
  });
  return name;
}
function getImage(item: ProductProps): string {
  let imageUrl: string = "";
  Object.entries(item).forEach(([key, value]) => {
    if (key === "thumb" && typeof key === "string") {
      imageUrl = value.fileName;
      return imageUrl;
    }
  });
  return imageUrl;
}
function getInfoUserOrder(orders: Array<OrderDetailProps>, orderID: string) {
  const infoUserOrder = orders.find(
    (item) => (item.orderID as OrderProps)._id.toString() === orderID
  );
  return infoUserOrder ? infoUserOrder.orderID : undefined;
}
function getStatusOrder(value: number): string {
  let status: string = "";
  switch (value) {
    case 1:
      status = "Chờ xác nhận";
      break;
    case 2:
      status = "Đã xác nhận + vận chuyển";
      break;
    case 3:
      status = "Đã nhận hàng";
      break;
    case 4:
      status = "Đã huỷ";
      break;
    default:
      break;
  }
  return status;
}

// main
(async () => {
  await renderListOrder("#table-order");
  const buttonEditCatalog = document.querySelectorAll(
    "#btn-edit"
  ) as NodeListOf<HTMLButtonElement>;
  const modalDetail = document.getElementById("detailModal") as HTMLDivElement;
  const tableDetail = modalDetail.querySelector(
    "#table-detail"
  ) as HTMLTableElement;
  const tableBody = tableDetail.querySelector(
    "tbody"
  ) as HTMLTableSectionElement;
  const totalElement = tableDetail.querySelector(
    "#total"
  ) as HTMLTableRowElement;
  const infoUserElement = modalDetail.querySelector(
    ".modal-info-user"
  ) as HTMLDivElement;
  buttonEditCatalog.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const orderID = btn.dataset.id;
      try {
        if (orderID) {
          const orders = (await OrderDetail.loadOne(
            orderID
          )) as unknown as OrderDetailProps[];
          const infoUserOrder = <OrderProps>getInfoUserOrder(orders, orderID);
          let total: number = 0;
          tableBody.textContent = "";
          if (Array.isArray(orders) && orders.length > 0) {
            infoUserElement.innerHTML = `<li class="modal-info-item">
              Họ và tên: ${infoUserOrder.fullname}
            </li>
            <li class="modal-info-item">
              Email: ${infoUserOrder.email}
            </li>
            <li class="modal-info-item">
              Số điện thoại: ${infoUserOrder.phone}
            </li>
            <li class="modal-info-item">
              Trạng thái: ${getStatusOrder(infoUserOrder.status)}
            </li>
            <li class="modal-info-item">
              Địa chỉ: ${infoUserOrder.address}
            </li>
            `;
            orders.forEach((item, index) => {
              const tableRow = document.createElement("tr");
              total += item.quantity * item.price;
              const name: string = getProductName(
                item.productID as ProductProps
              );
              const image: string = getImage(item.productID as ProductProps);
              tableRow.innerHTML = `<th scope="col">${index + 1}</th>
              <th scope="col">${name}</th>
              <th scope="col">
                <img src="${image}" class="img-thumbnail" style="width: 120px;" alt="${name}">
              </th>
              <th scope="col">${item.quantity}</th>
              <th scope="col">${formatCurrencyNumber(item.price)}</th>
              <th scope="col">${formatCurrencyNumber(
                item.price * item.quantity
              )}</th> `;
              tableBody.appendChild(tableRow);
              totalElement.innerHTML = `Tổng thanh toán: ${formatCurrencyNumber(
                total
              )}`;
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    });
  });
  initLogout("logout-btn");
})();
