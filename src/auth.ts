import { AccessTokenData } from "./constants";
import { User } from "./models/User";
import { getCookie, setCookie } from "./utils/cookie";

// functions

async function checkAccessToken() {
  const accessToken: string | null = localStorage.getItem("accessToken");
  const refreshTokenClient: string = getCookie("refreshToken");
  if (accessToken === null) return;
  let infoUser: AccessTokenData = JSON.parse(accessToken);
  const now = new Date().getTime();
  if (infoUser.expireIns < now && refreshTokenClient) {
    try {
      const refreshToken = (await User.refresh(
        refreshTokenClient
      )) as unknown as AccessTokenData;
      if (refreshToken) {
        setCookie("refreshToken", refreshToken.refreshToken, 365);
        localStorage.setItem("accessToken", JSON.stringify(refreshToken));
      }
    } catch (error) {
      console.log("Error", error);
    }
  }
}
// main
(async () => {
  await checkAccessToken();
})();
