import { Request, Response, NextFunction } from "express";
import { Coupon } from "../model/Coupon";
import { StatusCodes } from "http-status-codes";

class CouponController {
  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;
      const coupon = await Coupon.findOne({ name });
      if (coupon) {
        res.status(StatusCodes.OK).json({
          status: "success",
          data: coupon,
        });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({
          status: "failed",
          message: "Not found apply coupon!!",
        });
      }
    } catch (error) {
      next(error);
    }
  };
}

export const couponController = new CouponController();
