import User from "../models/userModel.js";
import bcrypt from 'bcrypt';
import JwtService from '../services/jwtServices.js';
import { catchAsyncErrors } from '../middleware/catchAsyncErrors.js';
import ErrorHandler from '../middleware/errorHandler.js';
import { UserPreferences } from '../models/userPreferencesModel.js';
import moment from "moment-timezone";


export const changePassword = catchAsyncErrors(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
        return next(new ErrorHandler("Current password is incorrect", 401));
    }
    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
    } catch (error) {
        return next(new ErrorHandler("Error hashing password", 500));
    }
    await user.save();

    JwtService.sendToken(user, 200, res, "Password changed successfully");
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    const { username, email } = req.body;
    const user = await User.findByPk(req.user.id);

    if (username) user.username = username;
    if (email) {
        const emailExists = await User.findOne({ where: { email } });
        if (emailExists && emailExists.id !== user.id) {
            return next(new ErrorHandler("Email already in use", 400));
        }
        user.email = email;
    }

    await user.save();

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    });
});

export const getCurrentUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'username', 'email']
    });
    res.status(200).json({ success: true, user });
});

export const getCurrUserPref = catchAsyncErrors(async (req, res, next) => {
    const user_id = req.user.id;
    const userpref = await UserPreferences.findOne({ user_id });
    res.status(200).json({ success: true, userpref });
})

export const deleteCurrUser = catchAsyncErrors(async (req, res, next) => {
    const user_id = req.user.id;
    const user = await User.destroy(
        {
            where: {
                id: user_id,
            }
        }
    );
    const userpref = await UserPreferences.deleteOne({ user_id });
    res.status(200).json({ success: true, user, userpref });
});

export const changeUserPreferences = catchAsyncErrors(async (req, res, next) => {
    const { theme, notifications_enabled, timezone } = req.body;
    const userId = req.user.id;

    let userPreferences = await UserPreferences.findOne({ user_id: userId });
    if (!userPreferences) {
        return next(new ErrorHandler("User preferences not found", 404));
    }

    if (theme) {
        if (!['light', 'dark'].includes(theme)) {
            return next(new ErrorHandler("Invlaid theme option", 400));
        }
        userPreferences.theme = theme;
    }

    if(typeof notifications_enabled === 'boolean'){
        userPreferences.notifications_enabled = notifications_enabled;
    }

    if(timezone){
        if(!moment.tz.names().includes(timezone)){
            return next(new ErrorHandler("Invalid Timezone",400));
        }
        userPreferences.timezone=timezone;
    }

    await userPreferences.save();

    res.status(200).json({
        success:true,
        message:"User Preference Updated Successfully",
        preferences:userPreferences
    })
}
)