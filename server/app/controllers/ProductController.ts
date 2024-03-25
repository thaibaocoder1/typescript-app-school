import { Request, Response, NextFunction } from "express";
import { Product } from "../model/Product";
import { StatusCodes } from "http-status-codes";
import { Catalog } from "../model/Catalog";

class ProductController {
  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryObj = { ...req.query };
      const excludeFields = ["page", "sort", "limit", "fields"];
      excludeFields.forEach((el) => delete queryObj[el]);
      const query = Product.find(queryObj);
      const products = await query;
      if (products?.length === 0) {
        throw new Error("Products list is empty!");
      }
      res.status(StatusCodes.OK).json({
        status: "success",
        results: products.length,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  };
  detail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await Product.findById({ _id: req.params.id }).populate(
        "categoryID"
      );
      res.status(StatusCodes.OK).json({
        status: "success",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };
  add = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ...obj } = req.body;
      obj.thumb = {
        data: req.file?.originalname,
        contentType: req.file?.mimetype,
        fileName: `http://localhost:8888/uploads/${req.file?.originalname}`,
      };
      const product = await Product.create(obj);
      res.status(StatusCodes.CREATED).json({
        status: "success",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ...obj } = req.body;
      const product = await Product.findById({ _id: req.params.id });
      if (!req.files) {
        if (JSON.stringify(req.body) !== JSON.stringify(product!.toObject())) {
          await Product.findOneAndUpdate({ _id: req.params.id }, obj, {
            new: true,
          });
        }
      } else {
        obj.thumb = {
          data: req.file?.originalname,
          contentType: req.file?.mimetype,
          fileName: `http://localhost:8888/uploads/${req.file?.originalname}`,
        };
        await Product.findOneAndUpdate({ _id: req.params.id }, obj, {
          new: true,
        });
      }
      res.status(StatusCodes.CREATED).json({
        status: "success",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };
  slug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.query;
      const catalog = await Catalog.findOne({ slug });
      const products = await Product.find({ categoryID: catalog?._id });
      if (products && products.length > 0) {
        return res.status(200).json({
          success: true,
          results: products.length,
          data: products,
        });
      } else {
        return res.json({
          success: false,
          message: "Không có sản phẩm nào được tìm thấy.",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi lấy thông tin sản phẩm.",
      });
    }
  };
}

export const productController = new ProductController();
