import express from "express";
import { couponController } from "../app/controllers/CouponController";

const router = express.Router();

router.post("/check", couponController.index);

export default router;
