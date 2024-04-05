import { ApiResponseAuth } from "../active";
import { User } from "../models/User";
import { hideSpinner, setCookie, showSpinner } from "../utils";
import { toast } from "../utils/toast";
import { Validator } from "../utils/validator";

// functions
async function handleOnSubmitFormAdmin(
  data: Record<string, any>
): Promise<void> {
  try {
    showSpinner();
    const res = await User.check(data);
    hideSpinner();
    const user: ApiResponseAuth = await res.json();
    if (user.success) {
      if (user.data.role.toLowerCase() === "admin") {
        toast.success("Đăng nhập thành công");
        localStorage.setItem("accessTokenAdmin", JSON.stringify(user.data));
        setCookie("refreshTokenAdmin", user.data.refreshToken, 365);
        setTimeout(() => {
          window.location.assign("/admin/index.html");
        }, 500);
      } else {
        toast.error("Tài khoản không có quyền truy cập!");
        return;
      }
    } else {
      toast.error(user.message);
      hideSpinner();
      return;
    }
  } catch (error) {
    console.log("Error", error);
  }
}
// main
(async () => {
  new Validator({
    formID: "#form-admin",
    formGroupSelector: ".form-group",
    errorSelector: ".form-message",
    rules: [
      Validator.isRequired("#email"),
      Validator.isEmail("#email"),
      Validator.isRequired("#password"),
      Validator.minLength("#password", 6),
    ],
    onSubmit: handleOnSubmitFormAdmin,
  });
})();
