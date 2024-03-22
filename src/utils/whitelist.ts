import { displayNumberWhitelist } from "./common";
import { AccessTokenData, WhiteLists } from "../constants";
import { toast } from "./toast";
let accessToken: string | null = localStorage.getItem("accessToken");
let accessTokenAdmin: string | null = localStorage.getItem("accessTokenAdmin");
let isHasWhiteList: string | null = localStorage.getItem("whitelist");
let whitelist: WhiteLists[] = [];
if (typeof isHasWhiteList === "string") {
  whitelist = JSON.parse(isHasWhiteList);
}

export function handleWhitelist(selector: string) {
  const buttonWhiteList = document.querySelectorAll(
    selector
  ) as NodeListOf<HTMLDivElement>;
  let infoUser: AccessTokenData;
  buttonWhiteList.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (accessToken !== null && accessTokenAdmin === null) {
        infoUser = JSON.parse(accessToken);
      } else if (accessToken === null && accessTokenAdmin !== null) {
        infoUser = JSON.parse(accessTokenAdmin);
      } else {
        toast.info("Please login to add whitelist");
        return;
      }
      const productID: string | undefined = btn.closest("div")?.dataset.id;
      const { id } = infoUser;
      const item: WhiteLists = {
        productID,
        userID: id,
      };
      if (Array.isArray(whitelist)) {
        const isChecked: number = whitelist.findIndex(
          (item) => item.productID === productID
        );
        if (isChecked >= 0) {
          toast.info("Sản phẩm đã được có trong mục yêu thích");
          return;
        } else {
          toast.success("Thêm vào whitelist thành công");
          whitelist.push(item);
          localStorage.setItem("whitelist", JSON.stringify(whitelist));
          displayNumberWhitelist("whitelist-order", whitelist);
        }
      }
    });
  });
}
