import { z } from "zod";
import {
  hideSpinner,
  setFieldError,
  setFieldValue,
  showSpinner,
  toast,
} from ".";
import { AccessTokenData, Carts, FormValues } from "../constants";
import { User, UserProps } from "../models/User";
import { getAllProvinces } from "./api-address";
import { Order, OrderProps } from "../models/Order";
import { OrderDetail, OrderDetailProps } from "../models/Detail";
import { Product, ProductProps } from "../models/Product";

let infoUser: AccessTokenData;
let accessToken: string | null = localStorage.getItem("accessToken");
let accessTokenAdmin: string | null = localStorage.getItem("accessTokenAdmin");

type ApiOrderResponse = {
  status: string;
  message: string;
  data?: any;
};

function getSchema() {
  return z
    .object({
      fullname: z.string().trim().min(1),
      email: z.string().trim().email("Please enter a valid email"),
      phone: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, {
        message: "Phone is invalid",
      }),
      address: z.string().min(1),
      province: z.string().refine(
        (value) => {
          return value.trim() === "" ? false : true;
        },
        { message: "Province must have a value" }
      ),
      district: z.string().refine(
        (value) => {
          return value.trim() === "" ? false : true;
        },
        { message: "District must have a value" }
      ),
      ward: z.string().refine(
        (value) => {
          return value.trim() === "" ? false : true;
        },
        { message: "Ward must have a value" }
      ),
    })
    .required();
}

function setFormValues(form: HTMLFormElement, user: UserProps) {
  if (!user) return;
  setFieldValue(form, "[name='fullname']", user.fullname);
  setFieldValue(form, "[name='email']", user.email);
  setFieldValue(form, "[name='phone']", user.phone);
}
async function validateFormCheckout(
  form: HTMLFormElement,
  formValues: FormValues
) {
  try {
    [
      "fullname",
      "email",
      "phone",
      "address",
      "district",
      "ward",
      "province",
    ].forEach((name) => setFieldError(form, name, ""));
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
function removeUnusedFiedls(values: FormValues) {
  const formValues: FormValues = { ...values };
  formValues.address = `${formValues.province}, ${formValues.district}, ${formValues.ward}, ${formValues.address}`;
  formValues.status = 1;
  delete formValues.province;
  delete formValues.district;
  delete formValues.ward;
  return formValues;
}
function getFormValues(form: HTMLFormElement): FormValues {
  const formValues: FormValues = {};
  const data = new FormData(form);
  for (const [key, value] of data) {
    if (key === "province" || key === "district" || key === "ward") {
      const selectedOption = document.getElementById(key) as HTMLFormElement;
      const selectedValue =
        selectedOption.options[selectedOption.selectedIndex].getAttribute(
          "data-value"
        );
      formValues[key] = selectedValue;
    } else {
      formValues[key] = value;
    }
  }
  return formValues;
}
function findCommonElements(arr1: Carts[], arr2: Carts[]) {
  const idSet = new Set(arr1.map((item) => item.productID));
  const commonElements = arr2.filter((item) => !idSet.has(item.productID));
  return commonElements;
}
async function handleAddOrderDetail(
  orderID: string,
  userID: string,
  cart: Array<Carts>
) {
  let isSuccess: Boolean = true;
  try {
    for (const item of cart) {
      const product = (await Product.loadOne(item.productID)) as ProductProps;
      const totalQuantity = product.quantity;
      const payload: Partial<OrderDetailProps> = {
        orderID,
        userID,
        productID: item.productID,
        price: item.price,
        quantity: item.quantity,
      };
      const payloadProduct: Partial<ProductProps> = {
        quantity: totalQuantity - item.quantity,
      };
      const saveOrderDetailPromise = OrderDetail.save(payload);
      const updateProduct = Product.updateField(item.productID, payloadProduct);
      const [orderDetailResult, productUpdateResult] = await Promise.all([
        saveOrderDetailPromise,
        updateProduct,
      ]);
      const data: ApiOrderResponse = await orderDetailResult.json();
      if (data.status === "success") {
        isSuccess = true;
      } else {
        isSuccess = false;
      }
    }
    if (isSuccess) {
      toast.success("Checkout successfully!");
      const cartFull = JSON.parse(localStorage.getItem("cart") as string);
      const saveCart = findCommonElements(cart, cartFull);
      localStorage && localStorage.setItem("cart", JSON.stringify(saveCart));
      setTimeout(() => {
        window.location.assign("/orders.html");
      }, 500);
    } else {
      toast.error("Checkout failed");
    }
  } catch (error) {
    console.log(error);
  }
}
export async function initFormCheckout(selector: string, cart: Carts[]) {
  const form = document.getElementById(selector) as HTMLFormElement;
  if (accessToken !== null && accessTokenAdmin !== null) {
    infoUser = JSON.parse(accessToken);
  } else {
    if (typeof accessToken === "string") {
      infoUser = JSON.parse(accessToken);
    } else if (typeof accessTokenAdmin === "string") {
      infoUser = JSON.parse(accessTokenAdmin);
    } else {
      window.location.assign("/login.html");
    }
  }
  try {
    showSpinner();
    const user = await User.loadOne(infoUser.id);
    hideSpinner();
    setFormValues(form, user);
    await getAllProvinces("province");
    form.addEventListener("submit", async (e: SubmitEvent) => {
      e.preventDefault();
      const formValues = getFormValues(form);
      const isValid = await validateFormCheckout(form, formValues);
      if (!isValid) return;
      const formValuesFinal: OrderProps = removeUnusedFiedls(
        formValues
      ) as unknown as OrderProps;
      let orderID: string = "";
      try {
        showSpinner();
        const res = await Order.save(formValuesFinal);
        hideSpinner();
        const data: ApiOrderResponse = await res.json();
        if (data.status === "success") {
          const order: OrderProps = data.data;
          if (order) {
            orderID = order._id;
            await handleAddOrderDetail(orderID, user._id, cart);
          }
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log("Error", error);
  }
}
