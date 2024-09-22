import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    channel_id: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    attachments: [
        {
            filename: String,
            url: String,
            filetype: String,
        },
    ],
    edited: {
        type: Boolean,
        default: false,
    },
    reactions: [{
        user_id: String,
        reaction: String,
    }]
});

export const Message = mongoose.model("Message", messageSchema);