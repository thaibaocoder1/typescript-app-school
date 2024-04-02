import { Request, Response, NextFunction } from "express";
import { Coupon } from "../model/Coupon";
import { StatusCodes } from "http-status-codes";
interface ErrorPayload {
  isExpire: boolean;
  id: string;
}

class CouponController {
  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const coupons = await Coupon.find({}).sort("-createdAt");
      if (coupons) {
        res.status(StatusCodes.OK).json({
          status: "success",
          data: coupons,
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
  detail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const counpon = await Coupon.findById({ _id: req.params.id });
      if (counpon) {
        res.status(StatusCodes.OK).json({
          status: "success",
          data: counpon,
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
  check = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;
      const coupon = await Coupon.findOne({ name });
      if (coupon) {
        const now: number = Math.floor(Date.now());
        const couponExpire: number = Math.floor(coupon.expireIns);
        if (now > couponExpire) {
          res.status(StatusCodes.NOT_FOUND).json({
            status: "failed",
            message: "Coupon is expire!!",
          });
        } else {
          res.status(StatusCodes.OK).json({
            status: "success",
            message: "Coupon is valid!!",
            data: coupon,
          });
        }
      } else {
        res.status(StatusCodes.NOT_FOUND).json({
          status: "failed",
          message: "Coupon is invalid!!",
        });
      }
    } catch (error) {
      next(error);
    }
  };
  validate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const [...data] = req.body;
      const errorLog: ErrorPayload[] = [];
      const now: number = Math.floor(Date.now());
      for (const item of data) {
        const coupon = await Coupon.findOne({ _id: item });
        const expireIns: number = Math.floor(coupon?.expireIns!);
        if (now > expireIns) {
          const payload = {
            isExpire: true,
            id: item as string,
          };
          errorLog.push(payload);
        }
      }
      if (errorLog.length > 0) {
        res.status(StatusCodes.NOT_FOUND).json({
          status: "failed",
          message: "One of coupons is expire!!",
          data: errorLog,
        });
      } else {
        res.status(StatusCodes.OK).json({
          status: "success",
          message: "Coupon is valid!!",
          data: errorLog,
        });
      }
    } catch (error) {
      next(error);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const counpon = await Coupon.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
        }
      );
      res.status(StatusCodes.CREATED).json({
        status: "success",
        data: counpon,
      });
    } catch (error) {
      next(error);
    }
  };
  add = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const coupon = await Coupon.create(req.body);
      res.status(StatusCodes.CREATED).json({
        status: "success",
        data: coupon,
      });
    } catch (error) {
      next(error);
    }
  };
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (id) {
        await Coupon.deleteOne({ _id: id });
        res.status(StatusCodes.CREATED).json({
          status: "success",
          message: "Delete success!",
        });
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "failed",
          message: "Delete failed!",
        });
      }
    } catch (error) {
      next(error);
    }
  };
}

export const couponController = new CouponController();
