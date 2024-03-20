import { AccessTokenData } from "./constants";
import { User } from "./models/User";

// functions
function setCookie(cname: string, cvalue: string, exdays: number) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname: string) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
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
