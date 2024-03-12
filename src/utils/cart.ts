import { calcPrice } from ".";
import { Params, Carts } from "../main";
import { Product } from "../models/Product";

export async function addProductToCart(params: Params) {
  let { cart, productID } = params;
  let cartItemIndex: number = cart.findIndex((x) => x.productID === productID);
  const product = await Product.loadOne(productID);
  const price = calcPrice(product.price, product.discount);
  if (cart.length <= 0) {
    cart = [
      {
        productID,
        quantity: params.quantity,
        price,
      },
    ];
  } else if (cartItemIndex < 0) {
    cart.push({
      productID,
      quantity: params.quantity,
      price,
    });
  } else {
    cart[cartItemIndex].quantity += params.quantity;
  }
  addCartToStorage(cart);
  return cart;
}
export function addCartToStorage(cartCopy: Carts[]): void {
  return localStorage.setItem("cart", JSON.stringify(cartCopy));
}
