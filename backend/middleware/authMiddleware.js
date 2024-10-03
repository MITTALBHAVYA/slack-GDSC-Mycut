//authMiddleWare.js
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import ErrorHandler from './errorHandler.js';

export const isAuthorized = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    
    if (!token) {
        return next(new ErrorHandler("USER NOT AUTHORIZED", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
        return next(new ErrorHandler("USER NOT FOUND", 404));
    }

    req.user = user;
    next();
});