import express from "express";
import { catalogController } from "../app/controllers/CatalogController";

const router = express.Router();

router.get("/:id", catalogController.detail);
router.patch("/:id", catalogController.update);
router.post("/save", catalogController.add);
router.get("/", catalogController.index);

export default router;
