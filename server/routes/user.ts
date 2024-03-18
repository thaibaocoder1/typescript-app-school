import express from "express";
import { userController } from "../app/controllers/UserController";
import upload from "../middleware/multer";

const router = express.Router();

router.post("/save", upload.single("imageUrl"), userController.add);
router.patch("/update/:id", upload.single("imageUrl"), userController.update);
router.get("/:id", userController.detail);
router.get("/", userController.index);

export default router;
