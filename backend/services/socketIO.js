import { Server as SocketIOServer } from 'socket.io';
import JwtService from './jwtServices.js';
import { Message } from '../models/messageModel.js';
import { uploadToCloudinary, determineFileType } from './cloudinaryServices.js';

export default function initSocketIO(server) {
    const io = new SocketIOServer(server, {
        cors: {
            // origin: process.env.FRONTEND_URL,
            origin: "http://192.168.31.40:5173",
            methods: ['GET', 'POST'],
        },
        maxHttpBufferSize: 10 * 1024 * 1024, // 10 MB buffer size
    });

    // Middleware for authentication
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            const decoded = await JwtService.verifyToken(token);
            socket.user = decoded;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    // Socket events
    io.on('connection', (socket) => {
        console.log('A user connected through socket id => ', socket.id);

        // Join room event
        socket.on('joinRoom', (channelId,userId) => {
            socket.join(channelId);
            console.log(`User ${userId} joined room ${channelId} through socket id => ${socket.id}`);
        });

        // Send message event
        socket.on('sendMessage', async (messageData) => {
            try {
                const { message = "", channelId, userId, username, file } = messageData;
                let uploadResult = null;
                let attachment = null;

                // Handle file upload if a file exists
                if (file) {
                    const fileBuffer = Buffer.from(file.data, 'base64');
                    uploadResult = await uploadToCloudinary(fileBuffer);
                    attachment = {
                        filename: file.name,
                        url: uploadResult.secure_url,
                        filetype: determineFileType(file.mimetype),
                    };
                }

                // Create and save the message
                const newMessage = await Message.create({
                    message: message,
                    channel_id: channelId,
                    user_id: userId,
                    username: username,
                    timestamp: new Date(),
                    attachments: attachment ? [attachment] : [],
                });

                // Emit the new message to the room
                io.to(channelId).emit('newMessage', newMessage);
            } catch (err) {
                console.error('Error sending message:', err);
                socket.emit('error', {
                    message: 'Failed to send message',
                });
            }
        });

        // Disconnect event
        socket.on('disconnect', () => {
            console.log(`User ${socket.id} disconnected`);
        });
    });

    return io;
}
