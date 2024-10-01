import mongoose from "mongoose";
import validator from "validator";

const passwordResetSchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true,
    },
    resetPasswordToken:{
        type:String,
        required:true
    },
    resetPasswordExpire:{
        type:String,
        required:true
    }
});

export const PasswordReset = mongoose.model("PasswordReset",passwordResetSchema);