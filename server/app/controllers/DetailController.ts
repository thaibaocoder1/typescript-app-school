import { Request, Response, NextFunction } from "express";
import { Catalog } from "../model/Catalog";
import { StatusCodes } from "http-status-codes";
import { Detail } from "../model/Detail";

class DetailController {
  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const catalogs = await Catalog.find({});
      res.status(StatusCodes.OK).json({
        status: "success",
        results: catalogs.length,
        data: catalogs,
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
