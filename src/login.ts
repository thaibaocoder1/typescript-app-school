import { ApiResponseAuth } from "./active";
import { User } from "./models/User";
import { hideSpinner, showSpinner } from "./utils";
import { toast } from "./utils/toast";
import { Validator } from "./utils/validator";

async function handleOnSubmitForm1(data: Record<string, any>): Promise<void> {
  try {
    showSpinner();
    const res = await User.check(data);
    hideSpinner();
    const user: ApiResponseAuth = await res.json();
    if (user.success) {
      toast.success("Đăng nhập thành công");
      if (user.data.role === "User") {
        localStorage.setItem("accessToken", JSON.stringify(user.data));
        setTimeout(() => {
          window.location.assign("/index.html");
        }, 500);
      } else {
        localStorage.setItem("accessTokenAdmin", JSON.stringify(user.data));
        setTimeout(() => {
          window.location.assign("/admin/index.html");
        }, 500);
      }
    } else {
      toast.error(user.message);
      return;
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
