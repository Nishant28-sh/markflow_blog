import { Router } from "express";
import { uploadImage } from "../controllers/uploadController.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

router.post("/", protect, upload.single("image"), uploadImage);

export default router;
