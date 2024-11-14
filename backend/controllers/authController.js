//authController.js
import User from "../models/userModel.js";
import { UserPreferences } from "../models/userPreferencesModel.js"
import bcrypt from 'bcrypt';
import JwtService from '../services/jwtServices.js';
import { catchAsyncErrors } from '../middleware/catchAsyncErrors.js';
import ErrorHandler from '../middleware/errorHandler.js';
import EmailService from "../services/EmailService.js";
import crypto from 'crypto';
import { PasswordReset } from "../models/passwordResetModel.js";

export const register = catchAsyncErrors(async (req, res, next) => {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return next(new ErrorHandler("User already exists with this email", 400));
    }
    const user = await User.create({ username, email, password });
    const user_id = user.id;
    const userPref = await UserPreferences.create({ user_id });
    const token = JwtService.generateToken(user);
    JwtService.sendToken(user, 201, res, "User registered successfully");
});

export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const token = JwtService.generateToken(user);
    JwtService.sendToken(user, 200, res, "Login successful");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
    res
        .status(200)
        .cookie("token", "", {
            expires: new Date(Date.now()),
            httpOnly: true,
            sameSite: 'Strict',
        })
        .json({
            success: true,
            message: "Logged out successfully.",
        });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
        return next(new ErrorHandler("User not found with this email", 404));
    }
    const { id } = user;
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    const resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    const user_id = id;
    const delPrev = await PasswordReset.deleteMany({ user_id });
    const passwordResetData = await PasswordReset.create({ user_id, resetPasswordToken, resetPasswordExpire });
    const emailSubject = `Password Reset Request`;
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}`;
    const emailMessage = `You requested a password reset. Click here to reset your password: ${resetUrl}\n\n If you did not request this, please ignore this email.`;

    try {
        const emailService = new EmailService({
            recipientEmail: email,
            emailSubject,
            emailMessage,
        });
        await emailService.sendEmail();

        res.status(200).json({
            success: true,
            message: 'Password reset token sent to email',
        })
    } catch (error) {
        return next(new ErrorHandler("Email could not be sent", 500));
    }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    if (!req.body.password || !req.body.confirmPassword) {
        return next(new ErrorHandler("Please provide a password and confirm it", 400));
    }

    if (req.body.password.length < 8) {
        return next(new ErrorHandler("Password must be at least 8 characters long", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords do not match", 400));
    }

    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const passwordResetData = await PasswordReset.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!passwordResetData) {
        return next(new ErrorHandler("Password reset token is invalid or has expired", 400));
    }

    const { user_id } = passwordResetData;
    await PasswordReset.deleteOne({ user_id });

    const user = await User.findOne({ where: { id: user_id } });
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
    } catch (error) {
        return next(new ErrorHandler("Error hashing password", 500));
    }

    await user.save();

    JwtService.sendToken(user, 200, res, "Password reset successful");
});

