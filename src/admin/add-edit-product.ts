import { Product, ProductProps } from "../models/Product";
import {
  initLogout,
  setBackgroundImage,
  setFieldValue,
  setTextContent,
  toast,
} from "../utils";
import { z } from "zod";
import { Buffer } from "buffer";
import { Catalog, CatalogProps } from "../models/Catalog";

// type
type ParamsSubmit = {
  selector: string;
  id?: string | null;
};
type FormValues = {
  [key in string]: string | number | File;
};
// functions
function getSchema() {
  return z.object({
    name: z.string().trim().min(5),
    code: z.string().trim().startsWith("BAODEV"),
    price: z.number().positive(),
    discount: z.number().positive(),
    quantity: z.number().positive(),
    description: z.string(),
    content: z.string(),
  });
}
async function handleItemProduct(id: string) {
  if (!id) return;
  try {
    const infoProduct = await Product.loadOne(id);
    return infoProduct;
  } catch (error) {
    console.log("Error", error);
  }
}
function setFormValues(element: HTMLFormElement, info: ProductProps) {
  setFieldValue(element, "[name='name']", info?.name);
  setFieldValue(element, "[name='code']", info?.code);
  setFieldValue(element, "[name='price']", info?.price);
  setFieldValue(element, "[name='discount']", info?.discount);
  setFieldValue(element, "[name='quantity']", info?.quantity);
  setTextContent(element, "[name='description']", info?.description);
  setTextContent(element, "[name='content']", info?.content);
  setBackgroundImage(element, "img#imageUrl", info?.thumb.fileName);
}
function getFormValues(form: HTMLFormElement) {
  if (!form) return;
  const formValues: FormValues = {};
  const data = new FormData(form);
  for (const [key, value] of data) {
    if (key === "discount" || key === "price" || key === "quantity") {
      formValues[key] = Number(value);
    } else {
      formValues[key] = value;
    }
  }
  return formValues;
}
function jsonToFormData(values: FormValues) {
  if (!values) return;
  const formData = new FormData();
  for (const key in values) {
    if (key === "thumb" && typeof values[key] === "object") {
      const file = values[key] as File;
      formData.append(key, file);
    } else {
      formData.append(key, String(values[key]));
    }
  }
  return formData;
}
export function setFieldError(
  form: HTMLFormElement,
  name: string,
  error: string
) {
  const element = form.querySelector(
    `input[name='${name}']`
  ) as HTMLInputElement;
  if (element) {
    element.setCustomValidity(error);
    setTextContent(element.parentElement!, ".invalid-feedback", error);
  }
}
async function validateForm(form: HTMLFormElement, formValues: FormValues) {
  try {
    ["name", "code", "price", "discount", "quantity"].forEach((name) =>
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
    if (error instanceof z.ZodError) {
      console.log(error.issues);
    }
  }
  const isValid = form.checkValidity();
  if (!isValid) form.classList.add("was-validated");
  return isValid;
}
function initUploadImage(form: HTMLFormElement) {
  const inputFile = form.querySelector(
    'input[name="thumb"]'
  ) as HTMLInputElement;
  if (inputFile) {
    inputFile.addEventListener("change", () => {
      const files = inputFile.files![0];
      if (files) {
        const imageUrl = URL.createObjectURL(files);
        setBackgroundImage(form, "img#imageUrl", imageUrl);
      }
    });
  }
}
async function handleOnSubmit(params: ParamsSubmit) {
  const form = document.getElementById(params.selector) as HTMLFormElement;
  if (!form) return;
  if (params.id) {
    const info = (await handleItemProduct(params.id)) as ProductProps;
    setFormValues(form, info);
  }
  initUploadImage(form);
  form.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();
    const formValues: FormValues = <FormValues>getFormValues(form);
    const isValid = await validateForm(form, formValues);
    if (!isValid) return;
    const formData = <FormData>jsonToFormData(formValues);
    try {
      if (params.id) {
        formData.append("id", params.id);
        const res = await Product.updateFormData(formData);
        if (res.ok && res.status === 201) {
          toast.success("Chỉnh sửa sản phẩm thành công");
          setTimeout(() => {
            window.location.assign("/admin/list-product.html");
          }, 2000);
        }
      } else {
        const res = await Product.saveFormData(formData);
        if (res.ok && res.status === 201) {
          toast.success("Thêm mới sản phẩm thành công");
          setTimeout(() => {
            window.location.assign("/admin/list-product.html");
          }, 2000);
        }
      }
    } catch (error) {
      console.log("Error", error);
    }
  });
}
async function renderListCategory(
  selector: string,
  emptyProduct: ProductProps
) {
  const selectElement = document.querySelector(selector) as HTMLSelectElement;
  if (!selectElement) return;
  const catalogs = await Catalog.loadAll();
  if (catalogs) {
    catalogs.forEach((item) => {
      const optionElement = document.createElement("option");
      optionElement.value = item._id.toString();
      const catalogObj = emptyProduct.categoryID as unknown as CatalogProps;
      const categoryID = catalogObj?._id;
      if (categoryID !== null && item._id.toString() === categoryID) {
        optionElement.selected = true;
      }
      optionElement.innerText = item.title;
      selectElement.appendChild(optionElement);
    });
  }
}
// main
(async () => {
  const heading = document.getElementById("heading") as HTMLHeadingElement;
  const params: URLSearchParams = new URLSearchParams(location.search);
  const productID: string | null = params.get("id");
  let emptyProduct: ProductProps;
  if (typeof productID === "string") {
    heading.textContent = "Trang sửa sản phẩm";
    emptyProduct = (await handleItemProduct(productID)) as ProductProps;
  } else {
    emptyProduct = {
      _id: "",
      categoryID: "",
      name: "",
      slug: "",
      description: "",
      code: "",
      price: 0,
      discount: 0,
      thumb: {
        data: Buffer.from(""),
        contentType: "",
        fileName: "",
      },
      content: "",
      status: 1,
      quantity: 0,
      createdAt: "",
      updatedAt: "",
    };
  }
  await renderListCategory("#categoryID", emptyProduct);
  const paramsFn: ParamsSubmit = {
    selector: "form-product",
    id: productID,
  };
  await handleOnSubmit(paramsFn);
  initLogout("logout-btn");
})();
