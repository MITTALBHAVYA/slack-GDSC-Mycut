//server.js
import http from 'http';
import app from './app.js'; // Importing your Express app
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import postgresConnection from './config/databases/postgreconn.js';
import mongoConnection from './config/databases/mongoconn.js';
import JwtService from './services/jwtServices.js'
import { Message } from './models/messageModel.js';;
// import logger from "./utils/logger.js";


dotenv.config(); // Load environment variables

// Set up the port from environment variables or default to 5000
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await postgresConnection.authenticate();
    console.log("PostgreSQL connection has been established successfully");

    await mongoConnection();
    console.log("MongoDB connection has been established successfully");

    const server = http.createServer(app);

    const io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST'],
      },
    });

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

      io.on('connection', (socket) => {
        console.log('A user connected: ', socket.id);
  
        socket.on('joinRoom', (channelId) => {
          socket.join(channelId);
          console.log(`User ${socket.id} joined room ${channelId}`);
        });

      socket.on('sendMessage', async (messageData) => {
        try {
          const { channelId, message, userId } = messageData;
          const newMessage = await Message.create({
            message: message,
            channel_id: channelId,
            user_id: userId,
            timestamp: new Date(),
          });
          io.to(channelId).emit('newMessage', newMessage);
        } catch (error) {
          socket.emit('error', {
            message: 'Failed to send message'
          });
        }
      });

      socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
      });
    });

    // Start listening on the specified port
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log('Unable to start the server: ', error);
    process.exit(1);
  }
}
// Create the HTTP server and pass in the Express app
startServer();
