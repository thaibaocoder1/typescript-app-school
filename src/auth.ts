import { ApiResponseAuth } from "./active";
import { AccessTokenData } from "./constants";
import { User } from "./models/User";
import { initSearchProduct } from "./utils/search";

// functions

async function checkAccessToken() {
  const accessToken: string | null = localStorage.getItem("accessToken");
  if (accessToken === null) return;
  let infoUser: AccessTokenData = JSON.parse(accessToken);
  const now = new Date().getTime();
  if (infoUser.expireIns < now) {
    try {
      const res = await User.refresh();
      const refreshToken: ApiResponseAuth = await res.json();
      if (refreshToken.success) {
        localStorage.setItem("accessToken", JSON.stringify(refreshToken.data));
      }
    } catch (error) {
      console.log("Error", error);
    }
  }
}
// main
(async () => {
  await checkAccessToken();
  await initSearchProduct();
})();
