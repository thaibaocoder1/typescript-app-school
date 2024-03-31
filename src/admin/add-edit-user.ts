import { z } from "zod";
import { User, UserProps } from "../models/User";
import {
  initLogout,
  setBackgroundImage,
  setFieldError,
  setFieldValue,
  toast,
} from "../utils";
import { Buffer } from "buffer";
import { FormValues } from "../constants";

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
function getSchema() {
  return z
    .object({
      username: z.string().trim().min(2),
      fullname: z.string().trim().min(2),
      email: z.string().email(),
      phone: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, {
        message: "Phone is invalid",
      }),
      role: z.literal("User").or(z.literal("Admin")),
    })
    .required();
}
export function setFormValues(
  element: HTMLFormElement,
  defaultValues: UserProps
) {
  setFieldValue(element, "[name='username']", defaultValues?.username);
  setFieldValue(element, "[name='fullname']", defaultValues?.fullname);
  setFieldValue(element, "[name='email']", defaultValues?.email);
  setFieldValue(element, "[name='phone']", defaultValues?.phone);
  setBackgroundImage(
    element,
    "img#imageUrl",
    `${defaultValues.imageUrl.fileName || "https://placehold.co/250x250"}`
  );
}
function getFormValues(form: HTMLFormElement): FormValues {
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
async function validateForm(form: HTMLFormElement, formValues: FormValues) {
  try {
    ["fullname", "email", "phone", "username", "role"].forEach((name) =>
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
          setBackgroundImage(form, "img#imageUrl", `${imageUrl}`);
        }
      } else {
        console.log("Error");
      }
    });
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
    try {
      if (params.id) {
        const res = await User.updateFormData(formData);
        if (res.ok && res.status === 201) {
          toast.success("Update thành công");
          setTimeout(() => {
            window.location.assign("/admin/list-user.html");
          }, 500);
        } else {
          toast.error("Có lỗi trong khi xử lý. Thử lại");
        }
      } else {
        const res = await User.saveFormData(formData);
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
      selectElement.appendChild(optionEl);
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
