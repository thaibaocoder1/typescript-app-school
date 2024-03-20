import { z } from "zod";
import { User, UserProps } from "../models/User";
import { setFieldValue } from "../utils";
import { toast } from "../utils/toast";

// type
type ParamsSubmit = {
  selector: string;
  id?: string | null;
  values: UserProps;
};
type FormValues = {
  [key in string]: string | number | File;
};
// functions
const imageUrlSchema = z.object({
  name: z.string(),
  type: z.string(),
  size: z.number(),
});
function getSchema() {
  return z
    .object({
      username: z.string().trim().min(5),
      fullname: z.string(),
      email: z.string().email(),
      phone: z.string(),
      roleID: z.literal("1").or(z.literal("2")),
      imageUrl: imageUrlSchema,
    })
    .required();
}
async function handleLoadItem(id: string) {
  if (!id) return;
  try {
    const info = await User.loadOne(id);
    return info;
  } catch (error) {
    console.log("Error", error);
  }
}
function setFormValues(element: HTMLFormElement, defaultValues: UserProps) {
  setFieldValue(element, "[name='username']", defaultValues?.username);
  setFieldValue(element, "[name='fullname']", defaultValues?.fullname);
  setFieldValue(element, "[name='email']", defaultValues?.email);
  setFieldValue(element, "[name='phone']", defaultValues?.phone);
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
    const schema = getSchema();
    const validUser = schema.parse(formValues);
    return validUser;
  } catch (error) {
    toast.error("Có lỗi. Vui lòng kiểm tra lại!");
    return;
  }
}
async function initForm(params: ParamsSubmit) {
  const form = document.getElementById(params.selector) as HTMLFormElement;
  if (!form) return;
  setFormValues(form, params.values);
  form.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();
    const formValues = getFormValues(form);
    const isValid = await validateForm(form, formValues);
    if (!isValid) return;
    const formData = jsonToFormData(formValues);
    try {
      if (params.id) {
        console.log("Edit");
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
// main
(async () => {
  const heading = document.getElementById("heading") as HTMLHeadingElement;
  const params: URLSearchParams = new URLSearchParams(location.search);
  const userID: string | null = params.get("id");

  let emptyUser: UserProps;
  if (typeof userID === "string") {
    heading.textContent = "Trang sửa khách hàng";
    emptyUser = (await handleLoadItem(userID)) as UserProps;
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
      imageUrl: "",
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
})();
