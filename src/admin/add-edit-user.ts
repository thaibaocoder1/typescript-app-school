import { User, UserProps } from "../models/User";
import { hideSpinner, initLogout, showSpinner, toast } from "../utils";
import { Buffer } from "buffer";
import {
  getFormValues,
  initPostImage,
  jsonToFormData,
  setFormValues,
  validateForm,
} from "../utils/admin-account";

// type
type ParamsSubmit = {
  selector: string;
  id?: string | null;
  values: UserProps;
};
// functions
async function getOneUser(id: string) {
  if (!id) return;
  try {
    const info = await User.loadOne(id);
    return info;
  } catch (error) {
    console.log("Error", error);
  }
}

async function initForm(params: ParamsSubmit) {
  const form = document.getElementById(params.selector) as HTMLFormElement;
  if (!form) return;
  initPostImage(form, "imageUrl");
  setFormValues(form, params.values);
  await initSelectRole("role", params.values);
  form.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();
    const formValues = getFormValues(form);
    const isValid = await validateForm(form, formValues);
    if (!isValid) return;
    const formData = jsonToFormData(formValues);
    formData.append("id", params.values._id);
    formData.append("admin", "true");
    try {
      if (params.id) {
        showSpinner();
        const res = await User.updateFormData(formData);
        hideSpinner();
        if (res.ok && res.status === 201) {
          toast.success("Update thành công");
          setTimeout(() => {
            window.location.assign("/admin/list-user.html");
          }, 500);
        } else {
          toast.error("Có lỗi trong khi xử lý. Thử lại");
        }
      } else {
        showSpinner();
        const res = await User.saveFormData(formData);
        hideSpinner();
        if (res.ok && res.status === 201) {
          toast.success("Tạo mới thành công");
          setTimeout(() => {
            window.location.assign("/admin/list-user.html");
          }, 500);
        } else {
          toast.error("Email đã được đăng ký. Thử lại");
        }
      }
    } catch (error) {
      console.log("Error", error);
    }
  });
}
async function initSelectRole(selector: string, values: UserProps) {
  const selectElement = document.getElementById(selector) as HTMLSelectElement;
  if (!selectElement) return;
  try {
    const { role } = values;
    ["User", "Admin"].forEach((name) => {
      const optionEl = document.createElement("option") as HTMLOptionElement;
      optionEl.value = name;
      if (role.toLowerCase() === name.toLowerCase()) {
        optionEl.selected = true;
      }
      optionEl.textContent = name;
      selectElement.add(optionEl);
    });
  } catch (error) {
    console.log("Error", error);
  }
}

// main
(async () => {
  const heading = document.getElementById("heading") as HTMLHeadingElement;
  const params: URLSearchParams = new URLSearchParams(location.search);
  const userID: string | null = params.get("id");

  let emptyUser: UserProps;
  if (typeof userID === "string") {
    heading.textContent = "Trang sửa khách hàng";
    emptyUser = (await getOneUser(userID)) as UserProps;
  } else {
    emptyUser = {
      _id: "",
      fullname: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
      role: "User",
      isActive: true,
      imageUrl: {
        data: Buffer.from(""),
        contentType: "",
        fileName: "",
      },
      refreshToken: "",
      createdAt: "",
      updatedAt: "",
    };
  }
  const paramsFn: ParamsSubmit = {
    selector: "form-product",
    id: userID,
    values: emptyUser,
  };
  await initForm(paramsFn);
  initLogout("logout-btn");
})();
