import {
  deleteCookie,
  hideSpinner,
  setBackgroundImage,
  setFieldError,
  showSpinner,
  toast,
} from ".";
import { UserData } from "../account";
import z from "zod";
import { User, UserProps } from "../models/User";
import { FormValues } from "../constants";
import Swal from "sweetalert2";
import { ApiResponseAuth } from "../active";

export function renderAccountInfo(selector: string) {
  const accountInfo = document.getElementById(selector) as HTMLDivElement;
  if (!accountInfo) return;
  const child = accountInfo.children as HTMLCollection;
  if (child) {
    const [login, register] = child;
    const loginAnchor = login as HTMLAnchorElement;
    const registerAnchor = register as HTMLAnchorElement;
    loginAnchor.href = "account.html";
    loginAnchor.textContent = "Account";
    registerAnchor.remove();
  }
}
export function renderSidebarAccount(idElement: string) {
  const sidebar = document.getElementById(idElement);
  if (!sidebar) return;
  sidebar.textContent = "";
  try {
    ["Change infomation", "Update password", "Orders", "Logout"].forEach(
      (name) => {
        const linkElement = document.createElement("a");
        linkElement.className = `nav-item nav-link ${name
          .toLowerCase()
          .replace(/\s/g, "-")}`;
        linkElement.href = "#";
        linkElement.textContent = name;
        sidebar.appendChild(linkElement);
      }
    );
  } catch (error) {
    console.log(error);
  }
}
function getSchema() {
  return z
    .object({
      username: z.string().trim().min(2),
      fullname: z.string().trim().min(2),
      phone: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, {
        message: "Phone is invalid",
      }),
    })
    .required();
}
async function validateForm(form: HTMLFormElement, formValues: FormValues) {
  try {
    ["fullname", "phone", "username"].forEach((name) =>
      setFieldError(form, name, "")
    );
    const schema = getSchema();
    const isValid = schema.safeParse(formValues);
    if (!isValid.success) {
      const formatted = isValid.error.issues;
      formatted.forEach((item) => {
        setFieldError(form, item.path[0] as string, item.message);
      });
    }
  } catch (error) {
    toast.error("Có lỗi. Vui lòng kiểm tra lại!");
    return;
  }
  const isValid = form.checkValidity();
  if (!isValid) form.classList.add("was-validated");
  return isValid;
}
function initPostImage(form: HTMLFormElement, selector: string) {
  const inputFile = document.querySelector(
    `input[name='${selector}']`
  ) as HTMLInputElement;
  if (inputFile) {
    inputFile.addEventListener("change", () => {
      if (inputFile && inputFile.files && inputFile.files.length > 0) {
        const files = inputFile.files[0];
        if (files) {
          const imageUrl = URL.createObjectURL(files);
          setBackgroundImage(form, "img.img-thumbnail", `${imageUrl}`);
        }
      } else {
        console.log("Error");
      }
    });
  }
}
function getFormValues(form: HTMLFormElement) {
  const formValues: FormValues = {};
  const data = new FormData(form);
  for (const [key, value] of data) {
    formValues[key] = value;
  }
  return formValues;
}
function jsonToFormData(values: FormValues): FormData {
  const formData = new FormData();
  for (const key in values) {
    if (key === "imageUrl" && typeof values[key] === "object") {
      const file = values[key] as File;
      formData.append(key, file);
    } else {
      formData.append(key, String(values[key]));
    }
  }
  return formData;
}
export function schemaUpdatePassword() {
  return z
    .object({
      old_password: z
        .string()
        .trim()
        .min(1, { message: "Please enter this field" }),
      password: z
        .string()
        .trim()
        .min(1, { message: "Please enter this field" }),
      confirm_password: z
        .string()
        .trim()
        .min(1, { message: "Please enter this field" }),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Confirm password must match password",
      path: ["confirm_password"],
    });
}
export async function validateFormPassword(
  form: HTMLFormElement,
  formValues: FormValues
) {
  try {
    ["old_password", "password", "confirm_password"].forEach((name) =>
      setFieldError(form, name, "")
    );
    const schema = schemaUpdatePassword();
    const isValid = schema.safeParse(formValues);
    if (!isValid.success) {
      const formatted = isValid.error.issues;
      formatted.forEach((item) => {
        setFieldError(form, item.path[0] as string, item.message);
      });
    }
  } catch (error) {
    toast.error("Có lỗi. Vui lòng kiểm tra lại!");
    return;
  }
  const isValid = form.checkValidity();
  if (!isValid) form.classList.add("was-validated");
  return isValid;
}
export function initUpdateForm(params: UserData) {
  const form = document.getElementById(params.selector) as HTMLFormElement;
  initPostImage(form, "imageUrl");
  form.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();
    const formValues = getFormValues(form);
    formValues.id = params.data._id as string;
    const isValid = await validateForm(form, formValues);
    if (!isValid) return;
    const formData = jsonToFormData(formValues);
    if (formData) {
      showSpinner();
      const res = await User.updateFormData(formData);
      hideSpinner();
      if (res.ok && res.status === 201) {
        toast.success("Update thành công");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        toast.error("Có lỗi trong khi xử lý. Thử lại");
      }
    }
  });
}
export function initChangeForm(selector: string, user: UserProps) {
  const form = document.getElementById(selector) as HTMLFormElement;
  form.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();
    const formValues = getFormValues(form);
    const isValid = await validateFormPassword(form, formValues);
    if (!isValid) return;
    try {
      const res = await User.updateField(user._id, formValues);
      const change: ApiResponseAuth = await res.json();
      if (change.success) {
        toast.success("Change password success!!");
        Swal.fire({
          title: "Đăng xuất trên thiết bị này?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Xác nhận",
          cancelButtonText: "Huỷ bỏ",
        }).then(function (result) {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Đăng xuất thành công!",
              icon: "success",
            }).then(async function () {
              if (user.role.toLowerCase() === "user") {
                localStorage.removeItem("accessToken");
                deleteCookie("refreshToken");
              } else {
                localStorage.removeItem("accessTokenAdmin");
                deleteCookie("refreshTokenAdmin");
              }
              setTimeout(() => {
                window.location.assign("/login.html");
              }, 500);
            });
          }
        });
      } else {
        toast.error(change.message);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  });
}
