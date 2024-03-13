import { Product, ProductProps } from "../models/Product";
import {
  hideSpinner,
  setFieldValue,
  setTextContent,
  showSpinner,
} from "../utils";
import { toast } from "../utils/toast";

// type
type ParamsSubmit = {
  selector: string;
  id?: string | null;
};

// functions
async function handleItemProduct(id: string) {
  if (!id) return;
  try {
    showSpinner();
    const infoProduct = await Product.loadOne(id);
    hideSpinner();
    return infoProduct;
  } catch (error) {
    console.log("Error", error);
  }
}
function setFormValues(element: HTMLFormElement, info: ProductProps) {
  setFieldValue(element, "[name='name']", info?.name);
  setFieldValue(element, "[name='code']", info?.code);
  setFieldValue(element, "[name='price']", info?.price);
  setFieldValue(element, "[name='quantity']", info?.quantity);
  setTextContent(element, "[name='description']", info?.description);
  setTextContent(element, "[name='content']", info?.content);
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
    try {
      if (params.id) {
        console.log("Edit");
      } else {
        const res = await Product.save({
          categoryID: 1,
          name: "string",
          description: "string",
          content: "abc",
          code: "string",
          thumb: "thumb",
          price: 1,
          discount: 1,
          status: 1,
          quantity: 10,
        });
        const data = await res.json();
        if (data.status === "success") {
          toast.success("Thêm mới thành công");
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
  const productID: string | null = params.get("id");
  const paramsFn: ParamsSubmit = {
    selector: "form-product",
    id: productID,
  };
  if (typeof productID === "string") {
    heading.textContent = "Trang sửa sản phẩm";
    await handleOnSubmit(paramsFn);
  } else {
    await handleOnSubmit(paramsFn);
  }
})();
