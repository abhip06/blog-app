import { Router } from "express";
import { register } from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.route("/register").post(upload.single("avatar"), register);

export default router;