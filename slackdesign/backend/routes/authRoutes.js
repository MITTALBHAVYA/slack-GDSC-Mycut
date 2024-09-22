import express from "express";
import { register, login, googleLogin, logout, forgotPassword, resetPassword, changePassword, updateProfile, getCurrentUser } from "../controllers/authController.js";
import { isAuthorized } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token",resetPassword);

router.put("/change-password", isAuthorized, changePassword);
router.put("/update-profile", isAuthorized, updateProfile);

router.get("/me", isAuthorized, getCurrentUser);

export default router;