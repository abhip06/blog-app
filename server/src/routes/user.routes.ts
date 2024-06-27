import { Router } from "express";
import {
    deleteUser,
    getAllUsers,
    getUserById,
    login,
    logout,
    modifyRoleOfUser,
    register,
    searchUser,
    getCurrentUser,
    getBlogsPublished,
    changeCurrentPassword,
    updateAccountDetails,
    changeUserAvatar,
} from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

// Auth routes
router.route("/register").post(upload.single("avatar"), register);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logout);

// User routes
router.route("/my-account").get(verifyJWT, getCurrentUser);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/update-profile").patch(verifyJWT, updateAccountDetails);
router.route("/blogs-published").get(verifyJWT, getBlogsPublished);

// route for updating user avatar
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), changeUserAvatar);

// Unprotected routes
router.route("/profile/:userId").get(getUserById);
router.route("/search").get(searchUser);

// Admin routes
router.route("/all").get(verifyJWT, getAllUsers);
router.route("/delete/:userId").delete(verifyJWT, deleteUser);
router.route("/update-role/:userId").get(verifyJWT, modifyRoleOfUser);

export default router;