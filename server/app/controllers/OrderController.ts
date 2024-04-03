import { Request, Response, NextFunction } from "express";
import { Catalog } from "../model/Catalog";
import { Order } from "../model/Order";
import { StatusCodes } from "http-status-codes";

class OrderController {
  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await Order.find({});
      res.status(StatusCodes.OK).json({
        status: "success",
        results: orders.length,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  };
  detail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const catalog = await Catalog.findOne({ _id: req.params.id });
      res.status(StatusCodes.OK).json({
        status: "success",
        data: catalog,
      });
    } catch (error) {
      next(error);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const catalog = await Catalog.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
        }
      );
      res.status(StatusCodes.OK).json({
        status: "success",
        data: catalog,
      });
    } catch (error) {
      next(error);
    }
  };
  add = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await Order.create(req.body);
      if (order) {
        res.status(StatusCodes.CREATED).json({
          status: "success",
          message: "Add order success!!",
          data: order,
        });
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "failed",
          message: "Add order failed!!",
        });
      }
    } catch (error) {
      next(error);
    }
  };
}

export const orderController = new OrderController();
