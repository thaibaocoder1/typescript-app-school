import express from "express";
import { orderController } from "../app/controllers/OrderController";

const router = express.Router();

router.post("/save", orderController.add);

export default router;
