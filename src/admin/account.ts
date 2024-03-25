import { AccessTokenData } from "../constants";
import { User } from "../models/User";
import { setBackgroundImage, setFieldValue, initLogout, toast } from "../utils";

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
      setBackgroundImage(
        formEl,
        ".img-fluid",
        `${
          user?.imageUrl.fileName.includes("https")
            ? user?.imageUrl.fileName
            : `/img/${user?.imageUrl.fileName}`
        }`
      );
    }
  } catch (error) {
    toast.error("Có lỗi trong khi truy vấn");
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
})();
