import express from "express";
import { orderController } from "../app/controllers/OrderController";

const router = express.Router();

router.post("/save", orderController.add);
router.patch("/update-fields/:id", orderController.updateFields);
router.get("/", orderController.index);

export default router;
