export function hideSpinner(): void {
  document.querySelector(".spinner")!.classList.remove("show");
}
export function showSpinner(): void {
  document.querySelector(".spinner")!.classList.add("show");
}
