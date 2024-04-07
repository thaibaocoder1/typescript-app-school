import { UserData } from "./account";
import { AccessTokenData, Carts, WhiteLists } from "./constants";
import { User, UserProps } from "./models/User";
import {
  displayNumOrder,
  displayNumberWhitelist,
  hideSpinner,
  initChangeForm,
  initUpdateForm,
  removeLocalStorageAdmin,
  removeLocalStorageCustomer,
  renderAccountInfo,
  renderSidebarAccount,
  setBackgroundImage,
  setFieldValue,
  showSpinner,
  toast,
} from "./utils";
import { getUserLogin } from "./utils/get-user";
import { displayListOrder } from "./utils/orders";

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
  // Account
  renderSidebarAccount("sidebar-info");
  // Orders
  if (accessToken !== null && accessTokenAdmin !== null) {
    await displayListOrder(accessToken, "table-order");
  } else {
    if (typeof accessToken === "string") {
      await displayListOrder(accessToken, "table-order");
    } else {
      await displayListOrder(accessTokenAdmin as string, "table-order");
    }
  }
  // Actions
  let user: UserProps;
  const modal = document.getElementById("modal-account") as HTMLDivElement;

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
    } else if (target.matches("a.logout")) {
      e.preventDefault();
      const info = getUserLogin();
      modal && modal.classList.add("is-show");
      modal.dataset.id = info.id;
    } else if (target.matches("a.orders")) {
      e.preventDefault();
      window.location.assign("/orders.html");
    } else if (target.matches(".modal")) {
      updateModal && updateModal.classList.remove("is-show");
      changeModal && changeModal.classList.remove("is-show");
      modal && modal.classList.remove("is-show");
    } else if (target.matches("button.btn-close")) {
      updateModal && updateModal.classList.remove("is-show");
      changeModal && changeModal.classList.remove("is-show");
    } else if (target.matches("button.btn-denide")) {
      modal && modal.classList.remove("is-show");
    } else if (target.closest("button.btn-confirm")) {
      showSpinner();
      const res = await User.logout(modal.dataset.id as string);
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
})();
