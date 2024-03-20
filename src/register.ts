import { User } from "./models/User";
import { getRandomImage } from "./utils";
import { toast } from "./utils/toast";
import { Validator } from "./utils/validator";

async function handleOnSubmitForm(data: Record<string, any>): Promise<void> {
  if (data) {
    data["role"] = "User";
    data["imageUrl"] = getRandomImage();
  }
  try {
    const users = await User.loadAll();
    if (Array.isArray(users) && users.length > 0) {
      users.forEach(async (user) => {
        if (user.email === data.email) {
          toast.error("Duplicate user. Please check again");
        } else {
          const infoUser = await User.save(data);
          if (infoUser) {
            toast.success("Register successfully");
            setTimeout(() => {
              window.location.assign("/login.html");
            }, 2000);
          } else {
            toast.error("Register failed");
          }
        }
      });
    } else {
      const infoUser = await User.save(data);
      if (infoUser.ok && infoUser.status === 201) {
        toast.success("Register successfully");
        setTimeout(() => {
          window.location.assign("/login.html");
        }, 500);
      } else {
        toast.error("Register failed");
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
      Validator.isRequired("#fullname", "Vui lòng nhập tên đầy đủ"),
      Validator.isRequired("#username", "Vui lòng nhập tên đăng nhập"),
      Validator.isRequired("#email"),
      Validator.isEmail("#email"),
      Validator.isRequired("#phone"),
      Validator.isPhone("#phone"),
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
    onSubmit: handleOnSubmitForm,
  });
})();
