import {
  calcPrice,
  formatCurrencyNumber,
  showSpinner,
  hideSpinner,
  sweetAlert,
} from "./utils";
import { CatalogProps } from "./models/Catalog";
import { ProductProps, Product } from "./models/Product";
import { addProductToCart, displayNumOrder } from "./utils/cart";
import { Carts, Params } from "./main";
import { handleAddCartDetail } from "./utils/handle-detail";
import { renderSidebar } from "./utils/sidebar";

// interfaces
interface RenderInfoProductParams {
  infoIDElement: string;
  infoIDThumbnail: string;
  infoIDContent: string;
  productInfo: ProductProps;
}
interface RenderInfoProductRelated {
  infoIDElement: string;
  categoryID: string | number;
  productID: string;
}
// functions
async function renderInfoProduct(params: RenderInfoProductParams) {
  const infoProduct = document.querySelector(
    params.infoIDElement
  ) as HTMLElement;
  const thumbnailProduct = document.querySelector(
    params.infoIDThumbnail
  ) as HTMLElement;
  const contentProduct = document.querySelector(
    params.infoIDContent
  ) as HTMLElement;
  if (!infoProduct || !thumbnailProduct || !contentProduct) return;
  infoProduct.innerHTML = `<h3 class="font-weight-semi-bold">${
    params.productInfo.name
  }</h3>
  <div class="d-flex mb-3">
    <div class="text-primary mr-2">
      <small class="fas fa-star"></small>
      <small class="fas fa-star"></small>
      <small class="fas fa-star"></small>
      <small class="fas fa-star-half-alt"></small>
      <small class="far fa-star"></small>
    </div>
    <small class="pt-1">(50 Reviews)</small>
  </div>
  <h3 class="font-weight-semi-bold mb-4">${formatCurrencyNumber(
    calcPrice(params.productInfo.price, params.productInfo.discount)
  )}</h3>
  <h4 class="font-weight-semi-bold mb-4" style="color: var(--red)">Sale ${
    params.productInfo.discount
  }%</h4>
  <p class="mb-4">
    ${params.productInfo.description}
  </p>
  <div class="d-flex mb-3">
  <p class="text-dark font-weight-medium mb-0 mr-3">Quantity:</p>
  <span class="text-dark font-weight-normal mb-0 mr-3">${
    params.productInfo.quantity
  } sản phẩm</span>
  </div>
  <div class="d-flex align-items-center mb-4 pt-2">
    <div class="input-group quantity mr-3" style="width: 130px">
      <div class="input-group-btn">
        <button class="btn btn-primary btn-minus" id="btn-minus">
          <i class="fa fa-minus"></i>
        </button>
      </div>
      <input
        type="text"
        class="form-control bg-secondary text-center"
        value="1"
        name="order"
      />
      <div class="input-group-btn">
        <button class="btn btn-primary btn-plus" id="btn-plus">
          <i class="fa fa-plus"></i>
        </button>
      </div>
    </div>
    <button class="btn btn-primary px-3" id="btn-add-cart">
      <i class="fa fa-shopping-cart mr-1"></i> Add To Cart
    </button>
  </div>
  <div class="d-flex pt-2">
    <p class="text-dark font-weight-medium mb-0 mr-2">Share on:</p>
    <div class="d-inline-flex">
      <a class="text-dark px-2" href="">
        <i class="fab fa-facebook-f"></i>
      </a>
      <a class="text-dark px-2" href="">
        <i class="fab fa-twitter"></i>
      </a>
      <a class="text-dark px-2" href="">
        <i class="fab fa-linkedin-in"></i>
      </a>
      <a class="text-dark px-2" href="">
        <i class="fab fa-pinterest"></i>
      </a>
    </div>
  </div>`;
  thumbnailProduct.innerHTML = `<div class="carousel-item active">
  <img class="w-100 h-100" src="img/${params.productInfo.thumb.fileName}" alt="${params.productInfo.name}" />
  </div>`;
  contentProduct.innerHTML = `<p>${params.productInfo.content}</p>`;
}
async function renderRelatedProduct(params: RenderInfoProductRelated) {
  const relatedElement = document.querySelector(params.infoIDElement);
  if (!relatedElement) return;
  relatedElement.textContent = "";
  try {
    const data = await Product.loadAll();
    const relatedProducts = data
      .filter(
        (item) =>
          item.categoryID === params.categoryID && item._id !== params.productID
      )
      .slice(0, 4);
    relatedProducts.forEach((item) => {
      const productItem = document.createElement("div");
      productItem.className = "card product-item border-0";
      productItem.innerHTML = `<div
      class="card-header product-img position-relative overflow-hidden bg-transparent border p-0"
    >
      <a href="detail.html?id=${item._id}">
        <img class="img-fluid w-100" src="img/${item.thumb.fileName}" alt="${
        item.name
      }" />
      </a>
    </div>
    <div
      class="card-body border-left border-right text-center p-0 pt-4 pb-3"
    >
      <a href="detail.html?id=${
        item._id
      }" class="text-decoration-none"><h6 class="text-truncate mb-3">${
        item.name
      }</h6></a>
      <div class="d-flex justify-content-center" id="related-product-price">
        <h6>${formatCurrencyNumber(calcPrice(item.price, item.discount))}</h6>
        <h6 class="text-muted ml-2"><del>${formatCurrencyNumber(
          item.price
        )}</del></h6>
      </div>
    </div>
    <div
      class="card-footer d-flex justify-content-between bg-light border"
    >
      <a href="detail.html?id=${item._id}" class="btn btn-sm text-dark p-0"
        ><i class="fas fa-eye text-primary mr-1"></i>View Detail</a
      >
      <a href="" class="btn btn-sm text-dark p-0" id="btn-cart" data-id=${
        item._id
      }
        ><i class="fas fa-shopping-cart text-primary mr-1"></i>Add To
        Cart</a
      >
    </div>`;
      relatedElement.appendChild(productItem);
    });
  } catch (error) {
    console.log("Error", error);
  }
}
// main
(async () => {
  let isHasCart: string | null = localStorage.getItem("cart");
  let cart: Carts[] = [];
  if (typeof isHasCart === "string") {
    cart = JSON.parse(isHasCart);
  }
  displayNumOrder("num-order", cart);
  const searchParams = new URLSearchParams(location.search);
  const productID = searchParams.get("id");
  if (!productID) return;
  showSpinner();
  const productInfo = await Product.loadOne(productID);
  hideSpinner();
  const catalogObj = productInfo.categoryID as unknown as CatalogProps;
  const categoryID = catalogObj?._id;
  await renderSidebar("#sidebar-category");
  const renderParams: RenderInfoProductParams = {
    infoIDElement: "#info-product",
    infoIDThumbnail: "#thumbnail-product",
    infoIDContent: "#content-product",
    productInfo,
  };
  await renderInfoProduct(renderParams);
  const relatedParams: RenderInfoProductRelated = {
    infoIDElement: "#related-product",
    categoryID,
    productID,
  };
  await renderRelatedProduct(relatedParams);
  // Handle cart
  const buttonCart = document.querySelectorAll(
    "#btn-cart"
  ) as NodeListOf<Element>;
  const buttonMinus = document.getElementById("btn-minus") as HTMLButtonElement;
  const buttonPlus = document.getElementById("btn-plus") as HTMLButtonElement;
  // const buttonAddCart = document.getElementById(
  //   "btn-add-cart"
  // ) as HTMLButtonElement;
  buttonCart.forEach((btn) => {
    btn.addEventListener("click", async (e: Event) => {
      e.preventDefault();
      const buttonElement = e.target as HTMLAnchorElement;
      const productID: string | undefined = buttonElement.dataset.id;
      if (productID) {
        sweetAlert.success("Tuyệt vời!");
        const params: Params = {
          productID,
          cart,
          quantity: 1,
        };
        cart = await addProductToCart(params);
      }
    });
  });
  buttonMinus.addEventListener("click", async () => {
    await handleAddCartDetail("minus", "order");
  });
  buttonPlus.addEventListener("click", async () => {
    await handleAddCartDetail("minus", "order");
  });
})();
