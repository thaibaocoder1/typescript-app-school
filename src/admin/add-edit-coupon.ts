import { CounponProps, Coupon } from "../models/Coupon";
import { CouponUpdate, initFormCoupon } from "../utils/form-coupon";

// main
(async () => {
  const params: URLSearchParams = new URLSearchParams(location.search);
  const couponID: string | null = params.get("id");
  const heading = document.getElementById("heading") as HTMLHeadingElement;
  if (couponID !== null) {
    heading.textContent = "Trang chỉnh sửa coupon";
  }
  const defaultValues: CounponProps = Boolean(couponID)
    ? await Coupon.loadOne(couponID as string)
    : {
        _id: "",
        name: "",
        value: 0,
        expireIns: 0,
        createdAt: "",
        updatedAt: "",
      };
  const paramsFn: CouponUpdate = {
    selector: "form-coupon",
    defaultValues,
  };
  initFormCoupon(paramsFn);
})();
