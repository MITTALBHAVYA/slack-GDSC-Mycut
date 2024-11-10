//authRoutes.js

import express from "express";
import { register, login, logout, forgotPassword, resetPassword} from "../controllers/authController.js";
import { rateLimiter } from "../middleware/rateLimiter.js";
import passport from "passport";

const router = express.Router();

router.post("/register",rateLimiter(15,20), register);
router.post("/login",rateLimiter(15,20), login);
// router.post("/google", googleLogin);
router.post("/logout", logout);
router.post("/forgot-password", rateLimiter(15,5),forgotPassword);
router.put("/reset-password/:token",resetPassword);

router.get('/google',passport.authenticate('google',{
    scope:['profile','email']
}));

router.get('/google/callback',passport.authenticate('google',{
    failureRedirect:`${process.env.FRONTEND_URL}/auth/login`,
    successRedirect:`${process.env.FRONTEND_URL}/workspace`
}),(req,res)=>{
    const token = req.user.token
    res.redirect(`${process.env.FRONTEND_URL}/auth/google?token=${token}`);
});
export default router;