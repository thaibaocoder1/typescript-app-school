import { calcPrice, formatCurrencyNumber } from "./format";
import { Product, ProductProps } from "../models/Product";

export function handleViewModal(selecotor: string) {
  const buttonModal = document.querySelectorAll(
    selecotor
  ) as NodeListOf<HTMLButtonElement>;
  if (!buttonModal) return;
  const modal = document.getElementById("modal-view") as HTMLDivElement;
  buttonModal.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const productID = btn.closest("div")?.dataset.id as string;
      if (productID) {
        modal.classList.add("is-show");
        const product = (await Product.loadOne(productID)) as ProductProps;
        const modalBodyEl = modal.querySelector(
          ".modal-body"
        ) as HTMLDivElement;
        modalBodyEl.innerHTML = `<div class="d-flex flex-column">
        <img src="${product.thumb.fileName}" class="img-fluid" alt="${
          product.name
        }" />
        <div class="modal-body-inner">
          <h4 class="font-weight-semi-bold">${product.name}</h4>
          <h4 class="font-weight-semi-bold">${formatCurrencyNumber(
            calcPrice(product.price, product.discount)
          )}</h4>
          <h4 class="font-weight-semi-bold" style="color: var(--red)">
            Sale ${product.discount}%
          </h4>
          <a href="" class="btn btn-primary" data-id=${
            product._id
          } id="btn-buy-now">Mua ngay</a>
        </div>
      </div>`;
      }
    });
  });
  window.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("modal")) {
      modal.classList.remove("is-show");
    } else if (target.closest("button")) {
      modal.classList.remove("is-show");
    }
  });
}
