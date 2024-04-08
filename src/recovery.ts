import { ApiResponseAuth } from "./active";
import { User } from "./models/User";
import { hideSpinner, showSpinner } from "./utils";
import { toast } from "./utils/toast";
import { Validator } from "./utils/validator";

async function handleOnSubmitForm1(data: Record<string, any>): Promise<void> {
  try {
    showSpinner();
    const res = await User.recover(data);
    hideSpinner();
    const user: ApiResponseAuth = await res.json();
    if (user.success) {
      toast.success(user.message);
      setTimeout(() => {
        window.location.assign("/login.html");
      }, 500);
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
    rules: [Validator.isRequired("#email"), Validator.isEmail("#email")],
    onSubmit: handleOnSubmitForm1,
  });
})();
