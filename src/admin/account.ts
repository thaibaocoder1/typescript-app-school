import { AccessTokenData } from "../constants";
import { User } from "../models/User";
import {
  setBackgroundImage,
  setFieldValue,
  initLogout,
  toast,
  showSpinner,
  hideSpinner,
} from "../utils";
import { setFormValues } from "./add-edit-user";

// functions
async function initFormAccount(info: AccessTokenData) {
  if (!info) return;
  try {
    const user = await User.loadOne(info.id);
    if (user) {
      const formEl = document.getElementById("form-account") as HTMLFormElement;
      if (!formEl) return;
      setFieldValue(formEl, "[name='username']", user?.username);
      setFieldValue(formEl, "[name='fullname']", user?.fullname);
      setFieldValue(formEl, "[name='email']", user?.email);
      setFieldValue(formEl, "[name='phone']", user?.phone);
      setFieldValue(formEl, "[name='role']", user?.role);
      setBackgroundImage(formEl, ".img-fluid", `${user?.imageUrl.fileName}`);
    }
  } catch (error) {
    toast.error("Có lỗi trong khi truy vấn");
  }
}
async function initFormUpdate(selector: string, infoUser: AccessTokenData) {
  const form = document.getElementById(selector) as HTMLFormElement;
  if (!infoUser || !form) return;
  try {
    const info = await User.loadOne(infoUser.id);
    if (info) {
      setFormValues(form, info);
    }
  } catch (error) {
    toast.error("Có lỗi trong khi xử lý");
  }
}
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
