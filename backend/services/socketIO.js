import { Server as SocketIOServer } from 'socket.io';
import JwtService from './jwtServices.js'
import { Message } from '../models/messageModel.js';


export default function initSocketIO(server){
    const io = new SocketIOServer(server,{
        cors:{
            origin:process.env.FRONTEND_URL,
            methods:['GET','POST'],
        },
    });

    io.use(async(socket,next)=>{
        try{
            const token = socket.handshake.auth.token;
            const decoded = await JwtService.verifyToken(token);
            socket.user = decoded;
            next();
        }catch(err){
            next(new Error('Authentication error'));
        }
    });

    io.on('connection',(socket)=>{
        console.log('A user connected: ',socket.id);

        socket.on('joinRoom',(channelId)=>{
            socket.join(channelId);
            console.log(`User ${socket.id} joined room ${channelId}`);
        });

        socket.on('sendMessage',async(messageData)=>{
            try{
                const {channelId,message,userId,username} = messageData;
                const newMessage = await Message.create({
                    message : message,
                    channel_id : channelId,
                    user_id : userId,
                    username : username,
                    timestamp : new Date(),
                });
                io.to(channelId).emit('newMessage',newMessage);
                
            }catch(err){
                socket.emit('error',{
                    message : 'Failed to send message'
                });
            }
        });

        socket.on('disconnect',()=>{
            console.log(`User ${socket.id} disconnected`);
        });
    });

    return io;
}