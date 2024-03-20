import { ParamsSubmit } from "../constants";
import { Catalog } from "../models/Catalog";
import { toast } from "../utils/toast";
import slugify from "slugify";

// functions
async function handleItemCatalog(id: string) {
  if (!id) return;
  try {
    const infoCatalog = await Catalog.loadOne(id);
    return infoCatalog;
  } catch (error) {
    console.log("Error", error);
  }
}
async function handleOnSubmit(params: ParamsSubmit) {
  const form = document.getElementById(params.selector) as HTMLFormElement;
  if (!form) return;
  const inputElement = form.querySelector("[name='title']") as HTMLInputElement;
  if (params.id) {
    const info = await handleItemCatalog(params.id);
    if (info) {
      inputElement.value = info.title;
    }
  }
  inputElement.addEventListener("blur", () => {
    if (inputElement.value === "") {
      toast.error("Không được để trống nội dung");
      return;
    }
  });
  form.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();
    if (inputElement.value === "") {
      toast.error("Không được để trống nội dung");
      return;
    }
    try {
      if (params.id) {
        const res = await Catalog.update(params.id, {
          title: inputElement.value,
          slug: slugify(inputElement.value, {
            trim: true,
            lower: true,
            locale: "vi",
          }),
        });
        const data = await res.json();
        if (data.status === "success") {
          toast.success("Cập nhật thành công");
          setTimeout(() => {
            window.location.assign("list-category.html");
          }, 500);
        }
      } else {
        const res = await Catalog.save({
          title: inputElement.value,
          slug: slugify(inputElement.value, {
            trim: true,
            lower: true,
            locale: "vi",
          }),
        });
        const data = await res.json();
        if (data.status === "success") {
          toast.success("Thêm mới thành công");
          setTimeout(() => {
            window.location.assign("list-category.html");
          }, 500);
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
  const catalogID: string | null = params.get("id");
  const paramsFn: ParamsSubmit = {
    selector: "form-category",
    id: catalogID,
  };
  if (typeof catalogID === "string") {
    heading.textContent = "Trang sửa danh mục";
    await handleOnSubmit(paramsFn);
  } else {
    await handleOnSubmit(paramsFn);
  }
})();
