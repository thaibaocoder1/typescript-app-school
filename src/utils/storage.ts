import { ApiResponse } from "../constants";

export function getLocalStorageCustomer(): void {
  window.localStorage.getItem("accessToken");
}
export function setLocalStorageCustomer(data: ApiResponse): void {
  window.localStorage.setItem("accessToken", JSON.stringify(data));
}
export function removeLocalStorageCustomer(): void {
  window.localStorage.removeItem("accessToken");
}
export function getLocalStorageAdmin(): string | null {
  return window.localStorage.getItem("accessTokenAdmin") || null;
}
export function setLocalStorageAdmin(data: ApiResponse): void {
  window.localStorage.setItem("accessTokenAdmin", JSON.stringify(data));
}
export function removeLocalStorageAdmin(): void {
  window.localStorage.removeItem("accessTokenAdmin");
}
