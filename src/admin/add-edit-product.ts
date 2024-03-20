import { Product, ProductProps } from "../models/Product";
import {
  hideSpinner,
  setFieldValue,
  setTextContent,
  showSpinner,
} from "../utils";
import { toast } from "../utils/toast";
import { z } from "zod";
import { Buffer } from "buffer";
import { Catalog, CatalogProps } from "../models/Catalog";

// type
type ParamsSubmit = {
  selector: string;
  id?: string | null;
  values: ProductProps;
};
type FormValues = {
  [key in string]: string | number | File;
};
// functions
function getSchema() {
  return z.object({
    name: z.string().trim().min(5),
    code: z.string(),
    price: z.number(),
    discount: z.number(),
    quantity: z.number(),
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
}
function getFormValues(form: HTMLFormElement) {
  if (!form) return;
  const formValues: FormValues = {};
  const data = new FormData(form);
  for (const [key, value] of data) {
    formValues[key] = value;
  }
  return formValues;
}
function jsonToFormData(values: FormValues) {
  if (!values) return;
  const formData = new FormData();
  for (const key in values) {
    formData.append(key, String(values[key]));
  }
  return formData;
}
async function handleOnSubmit(params: ParamsSubmit) {
  const form = document.getElementById(params.selector) as HTMLFormElement;
  if (!form) return;
  if (params.id) {
    const info = (await handleItemProduct(params.id)) as ProductProps;
    setFormValues(form, info);
  }
  form.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();
    const formValues: FormValues = <FormValues>getFormValues(form);
    const formData = <FormData>jsonToFormData(formValues);
    try {
      if (params.id) {
        console.log("Edit");
      } else {
        console.log("Add");
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
    values: emptyProduct,
  };
  await handleOnSubmit(paramsFn);
})();
