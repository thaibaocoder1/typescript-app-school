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
  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await Detail.find().populate("productID").populate({
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
  statistical = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const details = await Detail.find().populate({
        path: "orderID",
        match: { status: 3 },
      });
      const orders = details.filter((detail) => detail.orderID !== null);
      if (orders) {
        return res.status(StatusCodes.OK).json({
          success: true,
          results: orders.length,
          data: orders,
        });
      } else {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Không có đơn hàng nào được tìm thấy.",
        });
      }
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Đã xảy ra lỗi khi lấy thông tin đơn hàng.",
      });
    }
  };
}

export const detailController = new DetailController();
