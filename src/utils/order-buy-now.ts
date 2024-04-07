import { Carts } from "../constants";
import { Product, ProductProps } from "../models/Product";
import { sweetAlert } from "./alert";
import { calcPrice } from "./format";

export function handleOrderBuyNow(selecotor: string, cart: Carts[]) {
  const modal = document.querySelector(selecotor) as HTMLDivElement;
  modal.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;
    // Handle buy now
    if (target.closest("a#btn-buy-now")) {
      e.preventDefault();
      const productID = target.dataset.id as string;
      if (productID) {
        const product = (await Product.loadOne(productID)) as ProductProps;
        const newItem: Carts = {
          productID: productID,
          price: calcPrice(product.price, product.discount),
          quantity: 1,
          isBuyNow: true,
        };
        if (cart.length === 0) {
          cart.push(newItem);
          localStorage.setItem("cart", JSON.stringify(cart));
        } else {
          const cartItem = cart.find((item) => item.productID === productID);
          if (cartItem) {
            cartItem.quantity += 1;
          } else {
            cart.push(newItem);
          }
          localStorage.setItem("cart", JSON.stringify(cart));
        }
        sweetAlert.dialog();
        setTimeout(() => {
          window.location.assign("/checkout.html");
        }, 1000);
      }
    }
  });
}
