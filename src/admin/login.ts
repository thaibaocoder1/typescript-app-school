import { ApiResponse } from "../constants";
import { User } from "../models/User";
import { setCookie } from "../utils";
import { toast } from "../utils/toast";
import { Validator } from "../utils/validator";

// functions
async function handleOnSubmitFormAdmin(
  data: Record<string, any>
): Promise<void> {
  try {
    const res = await User.check(data);
    const user: ApiResponse = await res.json();
    if (res.ok && res.status === 201) {
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
