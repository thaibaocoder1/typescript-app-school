import { Request, Response, NextFunction } from "express";
import { Catalog } from "../model/Catalog";
import { StatusCodes } from "http-status-codes";

class CatalogController {
  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const catalogs = await Catalog.find({}).sort("-createdAt");
      if (catalogs?.length === 0) {
        throw new Error("Catalog list is empty!");
      }
      res.status(StatusCodes.OK).json({
        status: "success",
        results: catalogs.length,
        data: catalogs,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const catalogController = new CatalogController();
