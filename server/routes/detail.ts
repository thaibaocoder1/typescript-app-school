import express from "express";
import { detailController } from "../app/controllers/DetailController";

const router = express.Router();

router.post("/save", detailController.add);

export default router;
