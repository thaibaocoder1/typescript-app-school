import express from "express";
import { detailController } from "../app/controllers/DetailController";

const router = express.Router();

router.post("/save", detailController.add);
router.get("/:id", detailController.index);

export default router;
