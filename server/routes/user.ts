import express from "express";
import { userController } from "../app/controllers/UserController";
import upload from "../middleware/multer";

const router = express.Router();

router.post("/login", userController.check);

router.get("/refresh/:token", userController.refresh);
router.get("/verify/:id", userController.verify);
router.post("/active", userController.active);
router.post("/forgot", userController.forgot);
router.post("/change", userController.reset);
router.get("/logout/:id", userController.logout);

router.post("/save", upload.single("imageUrl"), userController.add);
router.delete("/soft/:id", userController.softDelete);
router.delete("/:id", userController.delete);
router.patch("/update/:id", upload.single("imageUrl"), userController.update);
router.patch("/restore/:id", userController.restore);
router.patch("/update-fields/:id", userController.updateFields);
router.get("/trash-users", userController.trash);
router.get("/:id", userController.detail);
router.get("/", userController.index);

export default router;
