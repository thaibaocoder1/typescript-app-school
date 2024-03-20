import { deleteCookie } from ".";
import { AccessTokenData } from "../constants";
import { User } from "../models/User";
import { toast } from "./toast";

export async function handleLogout() {
  try {
    const accessTokenAdmin: string | null =
      localStorage.getItem("accessTokenAdmin");
    let infoUser: AccessTokenData;
    if (typeof accessTokenAdmin === "string") {
      infoUser = JSON.parse(accessTokenAdmin);
      const info = await User.logout(infoUser.id);
      if (info) {
        localStorage.removeItem("accessTokenAdmin");
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
