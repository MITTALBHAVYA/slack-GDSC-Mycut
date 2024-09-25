import express from "express";
import {changePassword, updateProfile, getCurrentUser, getCurrUserPref, deleteCurrUser, changeUserPreferences} from "../controllers/userController.js"
import { isAuthorized } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/change-password", isAuthorized, changePassword);
router.put("/me", isAuthorized, updateProfile);
router.put("/pref",isAuthorized,changeUserPreferences);

router.get("/me", isAuthorized, getCurrentUser);
router.get("/pref",isAuthorized,getCurrUserPref);

router.delete("/me",isAuthorized,deleteCurrUser);

export default router;