import { WhiteLists } from "../constants";

export function calcPrice(price: number, discount: number): number {
  return (price * (100 - discount)) / 100;
}
export function setFieldValue(
  parentElement: HTMLElement,
  selector: string,
  value: string | number
) {
  if (!parentElement) return;
  const element = parentElement.querySelector(selector) as HTMLInputElement;
  if (element) element.value = value.toString();
  return element;
}
export function setTextContent(
  parentElement: HTMLElement,
  selector: string,
  text: string
) {
  if (!parentElement) return;
  const element = parentElement.querySelector(selector);
  if (element) element.textContent = text;
  return element;
}
export function setBackgroundImage(
  parentElement: HTMLElement,
  selector: string,
  src: string
) {
  if (!parentElement) return;
  const element = parentElement.querySelector(selector) as HTMLImageElement;
  if (element) element.src = src;
  return element;
}
export function getRandomNumber(n: number) {
  if (n <= 0) return -1;
  const random = Math.random() * n;
  return Math.round(random);
}
export function getRandomImage() {
  let sourceImage: string;
  sourceImage = `https://picsum.photos/id/${getRandomNumber(1000)}/400/400`;
  return sourceImage;
}
export function displayNumberWhitelist(
  selector: string,
  arr: WhiteLists[]
): void {
  const numOrderElement = document.getElementById(selector) as HTMLElement;
  if (!numOrderElement) return;
  let quantity: number = 0;
  for (const [index, item] of arr.entries()) {
    quantity++;
  }
  numOrderElement.innerText = `${quantity}`;
}
