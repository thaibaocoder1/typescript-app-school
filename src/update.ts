import { ApiResponseAuth } from "./active";
import { User } from "./models/User";
import { hideSpinner, showSpinner } from "./utils";
import { toast } from "./utils/toast";
import { Validator } from "./utils/validator";

async function handleOnSubmitForm1(data: Record<string, any>): Promise<void> {
  const searchParams = new URLSearchParams(location.search);
  const id: string | null = searchParams.get("id");
  if (id !== null) {
    data.id = id;
  }
  try {
    showSpinner();
    const res = await User.change(data);
    hideSpinner();
    const user: ApiResponseAuth = await res.json();
    if (user.success) {
      toast.success(user.message);
      setTimeout(() => {
        window.location.assign("/login.html");
      }, 500);
    } else {
      toast.error(user.message);
      hideSpinner();
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
  const searchParams = new URLSearchParams(location.search);
  const id: string | null = searchParams.get("id");
  if (id === null) {
    window.location.assign("/login");
  } else {
    if (typeof accessToken === "string") {
      window.location.assign("login.html");
    }
  }
  new Validator({
    formID: "#form-1",
    formGroupSelector: ".form-group",
    errorSelector: ".form-message",
    rules: [
      Validator.isRequired("#password"),
      Validator.minLength("#password", 6),
      Validator.isRequired("#password_confirmation"),
      Validator.isConfirmed(
        "#password_confirmation",
        function () {
          const passwordElement =
            document.querySelector<HTMLInputElement>("#form-1 #password");
          return passwordElement ? passwordElement.value : "";
        },
        "Mật khẩu nhập lại không khớp"
      ),
    ],
    onSubmit: handleOnSubmitForm1,
  });
})();
