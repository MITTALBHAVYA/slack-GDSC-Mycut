import express from "express";
import { register, login, googleLogin, logout, forgotPassword, resetPassword} from "../controllers/authController.js";
import { rateLimiter } from "../middleware/rateLimiter.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/logout", logout);
router.post("/forgot-password", rateLimiter(15,5),forgotPassword);
router.put("/reset-password/:token",resetPassword);


export default router;