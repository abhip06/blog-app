import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";
import { blogPublisher, deleteBlog, getAllBlogs, getBlogById, getBlogsByCategory, publishBlog, searchBlog, updateBlog } from "../controllers/blog.controller";

const router = Router();

router.route("/publish").post(verifyJWT, upload.single("blogImage"), publishBlog);
router.route("/all").get(getAllBlogs);
router.route("/search").get(searchBlog);
router.route("/:blogId").get(getBlogById);
router.route("/blog-publisher/:publisherId").get(blogPublisher);

router.route("/category/:category").get(getBlogsByCategory);

router.route("/update-blog/:blogId").patch(verifyJWT, upload.single("blogImage"), updateBlog);

router.route("/delete/:blogId").delete(verifyJWT, deleteBlog);

export default router;