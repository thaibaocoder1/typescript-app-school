import { hideSpinner, setFieldValue, showSpinner } from ".";
import { AccessTokenData } from "../constants";
import { User, UserProps } from "../models/User";

let infoUser: AccessTokenData;
let accessToken: string | null = localStorage.getItem("accessToken");
let accessTokenAdmin: string | null = localStorage.getItem("accessTokenAdmin");

function setFormValues(form: HTMLFormElement, user: UserProps) {
  if (!user) return;
  setFieldValue(form, "[name='fullname']", user.fullname);
  setFieldValue(form, "[name='email']", user.email);
  setFieldValue(form, "[name='phone']", user.phone);
}
export async function initFormCheckout(selector: string) {
  const form = document.getElementById(selector) as HTMLFormElement;
  if (accessToken !== null && accessTokenAdmin !== null) {
    infoUser = JSON.parse(accessToken);
  } else {
    if (typeof accessToken === "string") {
      infoUser = JSON.parse(accessToken);
    } else if (typeof accessTokenAdmin === "string") {
      infoUser = JSON.parse(accessTokenAdmin);
    }
  }
  try {
    showSpinner();
    const user = await User.loadOne(infoUser.id);
    hideSpinner();
    setFormValues(form, user);
  } catch (error) {
    console.log("Error", error);
  }
}
