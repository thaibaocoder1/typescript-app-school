export interface Carts {
  productID: string;
  price: number;
  quantity: number;
  isBuyNow?: boolean;
  isCheckout?: boolean;
}
export interface WhiteLists {
  productID: string | undefined;
  userID: string;
}
export interface Params {
  productID: string;
  cart: Carts[];
  quantity: number;
}
