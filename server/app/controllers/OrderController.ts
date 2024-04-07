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
      const order = await Order.findOne({ _id: req.params.id });
      res.status(StatusCodes.OK).json({
        status: "success",
        data: order,
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
  updateFields = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ...obj } = req.body;
      const order = await Order.findById({ _id: req.params.id });
      if (order) {
        await Order.updateOne({ _id: req.params.id }, obj, { new: true });
        res.status(StatusCodes.CREATED).json({
          status: "success",
          data: order,
        });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({
          status: "failed",
          message: "Not found order in database!!",
        });
      }
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
