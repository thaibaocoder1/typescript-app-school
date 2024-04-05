import { AccessTokenData } from "../constants";

export function getUserLogin() {
  let user: AccessTokenData;
  let accessToken: string | null = localStorage.getItem("accessToken");
  let accessTokenAdmin: string | null =
    localStorage.getItem("accessTokenAdmin");
  if (accessToken !== null && accessTokenAdmin !== null) {
    user = JSON.parse(accessToken);
  } else {
    if (typeof accessToken === "string") {
      user = JSON.parse(accessToken);
    } else {
      user = JSON.parse(<string>accessTokenAdmin);
    }
  }
  return user;
}
