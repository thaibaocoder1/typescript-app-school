import { z } from "zod";
import { FormValues } from "../constants";
import { setBackgroundImage, setFieldError, setFieldValue, toast } from ".";
import { UserProps } from "../models/User";

export function getSchema() {
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
export function jsonToFormData(values: FormValues): FormData {
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
export function initPostImage(form: HTMLFormElement, selector: string) {
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
export function setFormValues(form: HTMLFormElement, info: UserProps) {
  setFieldValue(form, "[name='fullname']", info?.fullname);
  setFieldValue(form, "[name='username']", info.username);
  setFieldValue(form, "[name='email']", info.email);
  setFieldValue(form, "[name='phone']", info.phone);
  setBackgroundImage(
    form,
    ".img-thumbnail",
    `${info.imageUrl.fileName || "https://placehold.co/250x250"} `
  );
}
export function getFormValues(form: HTMLFormElement): FormValues {
  const formValues: FormValues = {};
  const data = new FormData(form);
  for (const [key, value] of data) {
    formValues[key] = value;
  }
  return formValues;
}
export async function validateForm(
  form: HTMLFormElement,
  formValues: FormValues
) {
  try {
    ["fullname", "email", "phone", "username"].forEach((name) =>
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
