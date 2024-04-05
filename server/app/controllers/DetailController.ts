import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { Detail } from "../model/Detail";

class DetailController {
  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await Detail.find({ orderID: req.params.id })
        .populate("productID")
        .populate({
          path: "orderID",
        });
      res.status(StatusCodes.OK).json({
        status: "success",
        results: orders.length,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  };
  add = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderDetail = await Detail.create(req.body);
      if (orderDetail) {
        res.status(StatusCodes.CREATED).json({
          status: "success",
          message: "Add order detail success!!",
          data: orderDetail,
        });
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "failed",
          message: "Add order detail failed!!",
        });
      }
    } catch (error) {
      next(error);
    }
  };
}

export const detailController = new DetailController();
