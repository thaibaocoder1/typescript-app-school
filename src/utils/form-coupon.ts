import { z } from "zod";
import { setFieldError, setFieldValue, toast } from ".";
import { FormValues } from "../constants";
import { CounponProps, Coupon } from "../models/Coupon";
import dayjs from "dayjs";

// types
export type CouponUpdate = {
  selector: string;
  defaultValues: CounponProps;
};
export function setFormValues(
  element: HTMLFormElement,
  defaultValues: CounponProps
) {
  const expireIns = dayjs(defaultValues?.expireIns).format("YYYY-MM-DD");
  setFieldValue(element, "[name='name']", defaultValues?.name);
  setFieldValue(element, "[name='value']", defaultValues?.value);
  setFieldValue(element, "[name='expireIns']", expireIns);
}
function getFormValues(form: HTMLFormElement) {
  const formValues: FormValues = {};
  const data = new FormData(form);
  for (const [key, value] of data) {
    if (key === "expireIns") {
      const timer = new Date(value as string).getTime();
      formValues[key] = timer;
    } else {
      formValues[key] = value;
    }
  }
  return formValues;
}
function getSchema() {
  return z
    .object({
      name: z.string().trim().min(5).startsWith("SALE#"),
      value: z.string().trim().min(1).regex(/^\d+$/),
      expireIns: z.number(),
    })
    .required();
}
async function validateForm(form: HTMLFormElement, formValues: FormValues) {
  try {
    ["name", "value", "expireIns"].forEach((name) =>
      setFieldError(form, name, "")
    );
    const schema = getSchema();
    const isValid = schema.safeParse(formValues);
    if (!isValid.success) {
      const formatted = isValid.error.issues;
      for (const item of formatted) {
        setFieldError(form, item.path[0] as string, item.message);
      }
    }
  } catch (error) {
    toast.error("Có lỗi. Vui lòng kiểm tra lại!");
    return;
  }
  const isValid = form.checkValidity();
  if (!isValid) form.classList.add("was-validated");
  return isValid;
}
export function initFormCoupon(params: CouponUpdate) {
  const form = document.getElementById(params.selector) as HTMLFormElement;
  setFormValues(form, params.defaultValues);
  form.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();
    const formValues = getFormValues(form);
    formValues.id = params.defaultValues._id;
    const isValid = await validateForm(form, formValues);
    if (!isValid) return;
    try {
      if (formValues.id === "") {
        const add = await Coupon.save(formValues);
        if (add.ok && add.status === 201) {
          toast.success("Thêm mới thành công");
          setTimeout(() => {
            window.location.assign("/admin/list-coupon.html");
          }, 500);
        } else {
          toast.error("Thêm mới thất bại");
          return;
        }
      } else {
        const update = await Coupon.update(
          params.defaultValues._id,
          formValues
        );
        if (update.ok && update.status === 201) {
          toast.success("Cập nhật thành công");
          setTimeout(() => {
            window.location.assign("/admin/list-coupon.html");
          }, 500);
        } else {
          toast.error("Cập nhật thất bại");
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
}
export function initRemoveCoupon(counponID: string, selector: string) {
  const modal = document.getElementById(selector) as HTMLDivElement;
  modal.addEventListener("click", async (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.matches("a#remove-btn")) {
      e.preventDefault();
      try {
        const res = await Coupon.delete(counponID);
        if (res.ok && res.status === 201) {
          toast.success("Xoá thành công coupon");
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          toast.error("Có lỗi trong khi xử lý!");
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
}
