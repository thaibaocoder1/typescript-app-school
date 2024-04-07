import { Request, Response, NextFunction } from "express";
import { Order } from "../model/Order";
import { StatusCodes } from "http-status-codes";
import { Detail } from "../model/Detail";
import mailer from "../../middleware/mailer";
import fs from "fs";
import util from "util";

const readFile = util.promisify(fs.readFile);

async function waitForFile(filePath: string): Promise<void> {
  return new Promise((resolve) => {
    const checkExistence = async () => {
      try {
        await fs.promises.access(filePath, fs.constants.F_OK);
        resolve();
      } catch (error) {
        setTimeout(checkExistence, 1000);
      }
    };
    checkExistence();
  });
}
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
  // update = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const catalog = await Catalog.findOneAndUpdate(
  //       { _id: req.params.id },
  //       req.body,
  //       {
  //         new: true,
  //       }
  //     );
  //     res.status(StatusCodes.OK).json({
  //       status: "success",
  //       data: catalog,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
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
  invoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const order = await Order.findById({ _id: id });
      const orderDetail = await Detail.find({ orderID: id }).populate(
        "productID"
      );
      if (order) {
        const filePath = await mailer.renderInvoice(order, orderDetail);
        await waitForFile(filePath);
        const pdfContent = await readFile(filePath);
        (await mailer.createTransporter()).sendMail({
          from: "iSmart ADMIN",
          to: order.email,
          subject: "Đơn hành thanh toán tại iSmart ✔",
          text: "Đơn hành thanh toán tại iSmart",
          attachments: [
            {
              filename: "invoice.pdf",
              content: pdfContent,
            },
          ],
        });
        res.status(StatusCodes.OK).json({
          success: true,
          data: {
            message: "Send bill successfully!",
          },
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

export const orderController = new OrderController();
