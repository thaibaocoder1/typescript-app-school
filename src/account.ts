import { AccessTokenData, Carts, WhiteLists } from "./constants";
import { User, UserProps } from "./models/User";
import {
  displayNumberWhitelist,
  hideSpinner,
  removeLocalStorageAdmin,
  removeLocalStorageCustomer,
  setBackgroundImage,
  setFieldValue,
  showSpinner,
} from "./utils";
import {
  initChangeForm,
  initUpdateForm,
  renderAccountInfo,
  renderSidebarAccount,
} from "./utils/account";
import { displayNumOrder } from "./utils/cart";
import { toast } from "./utils/toast";

// types
export type UserData = {
  data: Partial<UserProps>;
  selector: string;
};
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
        showSpinner();
        const res = await User.logout(accessToken.id);
        hideSpinner();
        if (res.refreshToken === "") {
          toast.info("Logout success");
          if (res.role.toLowerCase() === "user") {
            removeLocalStorageCustomer();
          } else {
            removeLocalStorageAdmin();
          }
          setTimeout(() => {
            window.location.assign("login.html");
          }, 500);
        }
      }
    });
  } catch (error) {
    console.log(error);
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
  // Account
  if (accessToken !== null && accessTokenAdmin !== null) {
    renderAccountInfo("account");
    displayNumberWhitelist("whitelist-order", whitelist);
  } else {
    if (typeof accessToken === "string") {
      renderAccountInfo("account");
      displayNumberWhitelist("whitelist-order", whitelist);
    } else if (typeof accessTokenAdmin === "string") {
      renderAccountInfo("account");
      displayNumberWhitelist("whitelist-order", whitelist);
    }
  }
  renderSidebarAccount("sidebar-info");
  if (accessToken !== null && accessTokenAdmin !== null) {
    await displayInfoAccount(accessToken, "form-account");
  } else {
    if (typeof accessToken === "string") {
      await displayInfoAccount(accessToken, "form-account");
    } else {
      await displayInfoAccount(accessTokenAdmin as string, "form-account");
    }
  }

  // Actions
  let user: UserProps;
  window.addEventListener("click", async (e: Event) => {
    const target = e.target as HTMLElement;
    const updateModal = document.getElementById(
      "update-modal"
    ) as HTMLDivElement;
    const changeModal = document.getElementById(
      "change-modal"
    ) as HTMLDivElement;
    const formUpdate = document.getElementById(
      "form-update"
    ) as HTMLFormElement;
    if (target.matches("a.change-infomation")) {
      e.preventDefault();
      updateModal && updateModal.classList.add("is-show");
      if (accessToken !== null && accessTokenAdmin !== null) {
        const token: AccessTokenData = JSON.parse(accessToken);
        showSpinner();
        user = await User.loadOne(token.id);
        hideSpinner();
      } else {
        if (typeof accessToken === "string") {
          const token: AccessTokenData = JSON.parse(accessToken);
          showSpinner();
          user = await User.loadOne(token.id);
          hideSpinner();
        } else {
          const token: AccessTokenData = JSON.parse(<string>accessTokenAdmin);
          showSpinner();
          user = await User.loadOne(token.id);
          hideSpinner();
        }
      }
      if (user) {
        setFieldValue(formUpdate, "[name='fullname']", user?.fullname);
        setFieldValue(formUpdate, "[name='username']", user?.username);
        setFieldValue(formUpdate, "[name='email']", user?.email);
        setFieldValue(formUpdate, "[name='phone']", user?.phone);
        setBackgroundImage(
          formUpdate,
          ".img-thumbnail",
          user?.imageUrl.fileName
        );
        const params: UserData = {
          data: user,
          selector: "form-update",
        };
        initUpdateForm(params);
      }
    } else if (target.matches("a.update-password")) {
      e.preventDefault();
      changeModal && changeModal.classList.add("is-show");
      if (accessToken !== null && accessTokenAdmin !== null) {
        const token: AccessTokenData = JSON.parse(accessToken);
        showSpinner();
        user = await User.loadOne(token.id);
        hideSpinner();
      } else {
        if (typeof accessToken === "string") {
          const token: AccessTokenData = JSON.parse(accessToken);
          showSpinner();
          user = await User.loadOne(token.id);
          hideSpinner();
        } else {
          const token: AccessTokenData = JSON.parse(<string>accessTokenAdmin);
          showSpinner();
          user = await User.loadOne(token.id);
          hideSpinner();
        }
      }
      if (user) {
        initChangeForm("form-change", user);
      }
    } else if (target.matches("a.orders")) {
      e.preventDefault();
      window.location.assign("/orders.html");
    } else if (target.matches(".modal")) {
      updateModal && updateModal.classList.remove("is-show");
      changeModal && changeModal.classList.remove("is-show");
    } else if (target.matches("button.btn-close")) {
      updateModal && updateModal.classList.remove("is-show");
      changeModal && changeModal.classList.remove("is-show");
    }
  });
})();
