export function formatCurrencyNumber(number: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
}
export function calcPrice(price: number, discount: number): number {
  return (price * (100 - discount)) / 100;
}
