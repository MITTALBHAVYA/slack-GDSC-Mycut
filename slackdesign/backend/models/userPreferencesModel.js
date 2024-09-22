import mongoose from 'mongoose';

const userPreferencesSchema = new mongoose.Schema({
    user_id : {
        type : String,
        required : true,
    },
    theme : {
        type : String,
        enum : ['light','dark'],
        default : 'light',
    },
    notifications_enabled: {
        type:Boolean,
        default:true,
    },
    timezone : {
        type : String,
        default : 'UTC',
    }
});

export const UserPreferences = mongoose.model("UserPreferences",userPreferencesSchema);