import { deleteCookie } from "./cookie";
import { AccessTokenData } from "../constants";
import { User } from "../models/User";
import { toast } from "./toast";
import { getLocalStorageAdmin, removeLocalStorageAdmin } from "./storage";

export function initLogout(selector: string) {
  const buttonLogout = document.getElementById(selector) as HTMLButtonElement;
  if (!buttonLogout) return;
  buttonLogout.addEventListener("click", async (e: Event) => {
    e.preventDefault();
    await handleLogout();
  });
}

export async function handleLogout() {
  try {
    const accessTokenAdmin: string | null = getLocalStorageAdmin();
    let infoUser: AccessTokenData;
    if (typeof accessTokenAdmin === "string") {
      infoUser = JSON.parse(accessTokenAdmin);
      const info = await User.logout(infoUser.id);
      if (info.refreshToken === "") {
        removeLocalStorageAdmin();
        deleteCookie("refreshTokenAdmin");
        setTimeout(() => {
          window.location.assign("login.html");
        }, 500);
      }
    }
  } catch (error) {
    toast.error("Có lỗi trong khi xử lý");
  }
}
