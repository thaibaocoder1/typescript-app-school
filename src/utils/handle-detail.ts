import { toast } from "./toast";

export async function handleAddCartDetail(
  type: string,
  selector: string,
  count: number
) {
  const inputQuantity = document.querySelector(
    `input[name='${selector}']`
  ) as HTMLInputElement;
  let currentValue: number = parseInt(inputQuantity.value as string);
  switch (type) {
    case "plus":
      if (inputQuantity.value === count.toString()) {
        toast.error("Sản phẩm đạt tối đa số lượng");
        inputQuantity.value = count.toString();
      } else {
        inputQuantity.value = (currentValue + 1).toString();
      }
      break;
    case "minus":
      inputQuantity.value = Math.max(currentValue - 1, 1).toString();
      break;
    default:
      break;
  }
  inputQuantity.addEventListener("input", () => {
    validateInput(inputQuantity);
  });
  inputQuantity.dataset.value = inputQuantity.value;
}
function validateInput(element: HTMLInputElement): void {
  let currentValue = parseInt(element.value);
  if (isNaN(currentValue) || currentValue < 1) {
    element.value = "1";
  }
}
