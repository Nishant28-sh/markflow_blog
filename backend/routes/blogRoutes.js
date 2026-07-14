import { Router } from "express";
import {
  getBlogs,
  getBlogStats,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  duplicateBlog,
} from "../controllers/blogController.js";
import { protect } from "../middlewares/auth.js";

const router = Router();

router.use(protect);

router.get("/stats", getBlogStats);
router.get("/", getBlogs);
router.post("/", createBlog);
router.get("/:id", getBlogById);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);
router.post("/:id/duplicate", duplicateBlog);

export default router;
