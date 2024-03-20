import { ApiResponse } from "./constants";
import { User } from "./models/User";
import { toast } from "./utils/toast";

function setCookie(cname: string, cvalue: string, exdays: number): void {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
async function handleOnSubmitForm1(data: Record<string, any>): Promise<void> {
  try {
    const res = await User.check(data);
    const user: ApiResponse = await res.json();
    if (res.ok && res.status === 200) {
      toast.success("Đăng nhập thành công");
      if (user.data.role === "User") {
        localStorage.setItem("accessToken", JSON.stringify(user.data));
        setCookie("refreshToken", user.data.refreshToken, 365);
        setTimeout(() => {
          window.location.assign("/index.html");
        }, 500);
      } else {
        localStorage.setItem("accessTokenAdmin", JSON.stringify(user.data));
        setCookie("refreshTokenAdmin", user.data.refreshToken, 365);
        setTimeout(() => {
          window.location.assign("/admin/index.html");
        }, 500);
      }
    }
  } catch (error) {
    console.log("Error", error);
  }
}
// Main
(() => {
  const accessToken: string | null = localStorage.getItem("accessToken");
  const accessTokenAdmin: string | null =
    localStorage.getItem("accessTokenAdmin");
  if (typeof accessToken === "string") {
    window.location.assign("index.html");
  }
  if (typeof accessTokenAdmin === "string") {
    window.location.assign("admin/index.html");
  }
  new Validator({
    formID: "#form-1",
    formGroupSelector: ".form-group",
    errorSelector: ".form-message",
    rules: [
      Validator.isRequired("#email"),
      Validator.isEmail("#email"),
      Validator.isRequired("#password"),
      Validator.minLength("#password", 6),
    ],
    onSubmit: handleOnSubmitForm1,
  });
})();
