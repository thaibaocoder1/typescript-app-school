import express from "express";
import { productController } from "../app/controllers/ProductController";
import upload from "../middleware/multer";

const router = express.Router();

router.get("/list", productController.slug);
router.post("/save", upload.single("thumb"), productController.add);
router.patch("/update/:id", upload.single("thumb"), productController.update);
router.patch("/update-fields/:id", productController.updateFields);
router.get("/:id", productController.detail);
router.get("/", productController.index);

export default router;
