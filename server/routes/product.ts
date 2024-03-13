import express from "express";
import { productController } from "../app/controllers/ProductController";

const router = express.Router();

router.post("/save", productController.add);
router.get("/:id", productController.detail);
router.get("/", productController.index);

export default router;
