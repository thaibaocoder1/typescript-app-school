import { AccessTokenData } from "../constants";
import { initLogout } from "../utils";
import { initFormAccount, initFormUpdate } from "../utils/form-account";

// functions

// main
(async () => {
  const accessTokenAdmin: string | null =
    localStorage.getItem("accessTokenAdmin");
  let infoUser: AccessTokenData;
  if (typeof accessTokenAdmin === "string") {
    infoUser = JSON.parse(accessTokenAdmin);
    await initFormAccount(infoUser);
    initLogout("logout-btn");
  }
  document.addEventListener("click", async (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.matches(".btn-update")) {
      await initFormUpdate("form-user", infoUser);
    }
  });
})();
