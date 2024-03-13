export async function handleAddCartDetail(type: string, selector: string) {
  const inputQuantity = document.querySelector(
    `input[name='${selector}']`
  ) as HTMLInputElement;
  if (!inputQuantity) return;
  let currentValue: number = parseInt(inputQuantity.value as string);
  switch (type) {
    case "plus":
      inputQuantity.value = (currentValue + 1).toString();
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
}
function validateInput(element: HTMLInputElement): void {
  let currentValue = parseInt(element.value);
  if (isNaN(currentValue) || currentValue < 1) {
    element.value = "1";
  }
}
