import mongoose from 'mongoose';
import moment from 'moment-timezone';

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
        validate : {
            validator:function(value){
                return moment.tz.names().includes(value);
            },
            message:props=>`${props.value} is not a valid timezone!`
        },
    },
});

export const UserPreferences = mongoose.model("UserPreferences",userPreferencesSchema);