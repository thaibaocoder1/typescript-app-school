import { User } from "./models/User";
import { toast } from "./utils/toast";
interface AccessTokenData {
  role: string;
  id: string;
  accessToken: string;
  expireIns: number;
}
interface ApiResponse {
  success: boolean | string;
  data: AccessTokenData;
}
async function handleOnSubmitForm1(data: Record<string, any>): Promise<void> {
  try {
    const res = await User.check(data);
    const user: ApiResponse = await res.json();
    if (res.ok && res.status === 200) {
      toast.success("Đăng nhập thành công");
      if (user.data.role === "User") {
        localStorage.setItem("accessToken", JSON.stringify(user.data));
        setTimeout(() => {
          window.location.assign("/index.html");
        }, 500);
      } else {
        localStorage.setItem("accessToken", JSON.stringify(user.data));
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
