import { AccessTokenData, Carts, WhiteLists } from "./constants";
import { User } from "./models/User";
import {
  deleteCookie,
  displayNumberWhitelist,
  hideSpinner,
  removeLocalStorageCustomer,
  setBackgroundImage,
  setFieldValue,
  showSpinner,
} from "./utils";
import { renderAccountInfo, renderSidebarAccount } from "./utils/account";
import { displayNumOrder } from "./utils/cart";
import { toast } from "./utils/toast";

// functions
async function displayInfoAccount(token: string, formSelector: string) {
  try {
    const formElement = document.getElementById(
      formSelector
    ) as HTMLFormElement;
    if (!token || !formElement) return;
    const accessToken: AccessTokenData = JSON.parse(token);
    showSpinner();
    const user = await User.loadOne(accessToken.id);
    hideSpinner();
    if (user) {
      setFieldValue(formElement, "[name='fullname']", user?.fullname);
      setFieldValue(formElement, "[name='username']", user?.username);
      setFieldValue(formElement, "[name='email']", user?.email);
      setFieldValue(formElement, "[name='role']", user?.role);
      setBackgroundImage(
        formElement,
        ".img-thumbnail",
        user?.imageUrl.fileName
      );
    }
    const modal = document.getElementById("modal-account") as HTMLDivElement;
    window.addEventListener("click", async (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.matches(`a.logout`)) {
        e.preventDefault();
        modal && modal.classList.add("is-show");
      } else if (target.classList.contains("modal")) {
        modal.classList.remove("is-show");
      } else if (target.closest("button.btn-denide")) {
        modal.classList.remove("is-show");
      } else if (target.closest("button.btn-close")) {
        modal.classList.remove("is-show");
      } else if (target.closest("button.btn-confirm")) {
        const res = await User.logout(accessToken.id);
        if (res.refreshToken === "") {
          toast.info("Logout success");
          removeLocalStorageCustomer();
          deleteCookie("refreshToken");
          setTimeout(() => {
            window.location.assign("login.html");
          }, 1000);
        }
      }
    });
  } catch (error) {
    toast.error(Error.name);
  }
}

// main
(async () => {
  let isHasCart: string | null = localStorage.getItem("cart");
  let isHasWhiteList: string | null = localStorage.getItem("whitelist");
  let accessToken: string | null = localStorage.getItem("accessToken");
  let accessTokenAdmin: string | null =
    localStorage.getItem("accessTokenAdmin");
  let cart: Carts[] = [];
  let whitelist: WhiteLists[] = [];
  if (typeof isHasCart === "string") {
    cart = JSON.parse(isHasCart);
  }
  if (typeof isHasWhiteList === "string") {
    whitelist = JSON.parse(isHasWhiteList);
  }
  displayNumOrder("num-order", cart);
  displayNumberWhitelist("whitelist-order", whitelist);
  // Account
  renderAccountInfo("account");
  renderSidebarAccount("sidebar-info");
  if (accessToken !== null && accessTokenAdmin !== null) {
    console.log("Chi hien thi user");
  } else {
    if (typeof accessToken === "string") {
      await displayInfoAccount(accessToken, "form-account");
    } else {
      console.log("hien thi admin");
    }
  }
})();
