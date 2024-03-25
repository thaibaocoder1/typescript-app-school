import { toast } from "../utils/toast";
import { AccessTokenData } from "../constants";
import { User } from "../models/User";
import { getCookie, initLogout, setCookie } from "../utils";
// functions

// functions
async function checkAccessToken() {
  const accessTokenAdmin: string | null =
    localStorage.getItem("accessTokenAdmin");
  const refreshTokenClient: string = getCookie("refreshTokenAdmin");
  if (accessTokenAdmin === null) return;
  let infoUser: AccessTokenData = JSON.parse(accessTokenAdmin);
  const now = new Date().getTime();
  console.log(`NOW: ${now} - EXPIRE: ${infoUser.expireIns}`);
  if (infoUser.expireIns < now && refreshTokenClient) {
    console.log("Token het han, phai lay cai moi");
    try {
      const refreshToken = (await User.refresh(
        refreshTokenClient
      )) as unknown as AccessTokenData;
      if (refreshToken) {
        setCookie("refreshTokenAdmin", refreshToken.refreshToken, 365);
        localStorage.setItem("accessTokenAdmin", JSON.stringify(refreshToken));
      }
    } catch (error) {
      console.log("Error", error);
    }
  }
}
// main
(async () => {
  let accessTokenAdmin: string | null =
    localStorage.getItem("accessTokenAdmin");
  if (accessTokenAdmin === null) {
    window.location.assign("login.html");
  } else {
    if (window.location.pathname === "/admin/index.html") {
      toast.info("Chào mừng admin đăng nhập");
    }
    await checkAccessToken();
    initLogout("logout-btn");
  }
})();
