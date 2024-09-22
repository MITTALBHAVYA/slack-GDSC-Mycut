import mongoose from "mongoose";

const activityLogsSchema = new mongoose.Schema({
    user_id : {
        type : String,
        required : true,
    },
    action:{
        type : String,
        required : true,
        enum : ["USER_JOINED","USER_LEFT","USER_ROLE_CHANGED","USER_MENTIONED","MESSAGE_EDITED","MESSAGE_DELETED","MESSAGE_SENT","CHANNEL_CREATED","FILE_UPLOADED"],
    },
    timestamp : {
        type : Date,
        default: Date.now,
    },
    details : {
        type : String,
    }
});

export const ActivityLogs = mongoose.model("ActivityLogs",activityLogsSchema);