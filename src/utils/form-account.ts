import { setBackgroundImage, setFieldValue, toast } from ".";
import { AccessTokenData } from "../constants";
import { User } from "../models/User";
import {
  getFormValues,
  initPostImage,
  jsonToFormData,
  setFormValues,
  validateForm,
} from "./admin-account";

type ApiResponse = {
  status: string;
  message?: string;
};

export async function initFormAccount(info: AccessTokenData) {
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
      setBackgroundImage(formEl, ".img-fluid", `${user?.imageUrl.fileName}`);
    }
  } catch (error) {
    toast.error("Có lỗi trong khi truy vấn");
  }
}

export async function initFormUpdate(
  selector: string,
  infoUser: AccessTokenData
) {
  const form = document.getElementById(selector) as HTMLFormElement;
  if (!infoUser || !form) return;
  try {
    const info = await User.loadOne(infoUser.id);
    info && setFormValues(form, info);
    initPostImage(form, "imageUrl");
    form.addEventListener("submit", async (e: SubmitEvent) => {
      e.preventDefault();
      const formValues = getFormValues(form);
      const isValid = await validateForm(form, formValues);
      if (!isValid) return;
      const formData = jsonToFormData(formValues);
      if (formData) {
        formData.append("id", infoUser.id);
        const res = await User.updateFormData(formData);
        const data: ApiResponse = await res.json();
        if (data.status === "success") {
          toast.success(<string>data.message);
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          toast.error(<string>data.message);
        }
      }
    });
  } catch (error) {
    toast.error("Có lỗi trong khi xử lý");
  }
}
