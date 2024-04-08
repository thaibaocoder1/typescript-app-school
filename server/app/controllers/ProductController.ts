import { Request, Response, NextFunction } from "express";
import { Product } from "../model/Product";
import { StatusCodes } from "http-status-codes";
import { Catalog } from "../model/Catalog";

class ProductController {
  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryObj = { ...req.query };
      const query = Product.find(queryObj).sort("-createdAt");
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
  params = async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const searchTerm = req.query.searchTerm;
    const slug = req.query.slug;
    const brands = req.query.brands;
    let products: any;
    let count: any;

    let query: any = {};

    if (searchTerm && searchTerm !== "") {
      query.name = { $regex: searchTerm, $options: "i" };
    }
    if (slug && slug !== "") {
      const catalog = await Catalog.findOne({ slug });
      if (catalog) {
        query.categoryID = catalog._id;
      }
    }
    if (brands && brands !== "") {
      let brandsArray: string[] = [];
      if (typeof brands === "string") {
        brandsArray = brands.split(",").map((brand) => brand.trim());
      }
      const regexConditions = brandsArray.map((brand) => ({
        name: { $regex: brand, $options: "i" },
      }));
      query.$or = regexConditions;
    }
    try {
      const skip = (page - 1) * limit;
      products = await Product.find(query).skip(skip).limit(limit);
      count = await Product.countDocuments(query);
      res.status(StatusCodes.OK).json({
        status: "success",
        results: products.length,
        data: products,
        pagination: {
          page,
          limit,
          totalRows: count,
        },
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
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
        data: Buffer.from(`${req.file?.originalname}`),
        contentType: req.file?.mimetype,
        fileName: `http://localhost:8888/uploads/${req.file?.originalname}`,
      };
      const existProduct = await Product.findOne({ code: obj.code });
      if (existProduct) {
        res.status(StatusCodes.CONFLICT).json({
          status: "failed",
          message: "Duplicate product code. Try again!!",
        });
      } else {
        const product = await Product.create(obj);
        res.status(StatusCodes.CREATED).json({
          status: "success",
          data: product,
        });
      }
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
  updateFields = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ...obj } = req.body;
      const product = await Product.findById({ _id: req.params.id });
      if (product) {
        await Product.updateOne({ _id: req.params.id }, obj, { new: true });
        res.status(StatusCodes.CREATED).json({
          status: "success",
          data: product,
        });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({
          status: "failed",
          message: "Not found product in database!!",
        });
      }
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
