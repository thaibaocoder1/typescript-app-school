import express from "express";
import { catalogController } from "../app/controllers/CatalogController";

const router = express.Router();

router.get("/", catalogController.index);

export default router;
