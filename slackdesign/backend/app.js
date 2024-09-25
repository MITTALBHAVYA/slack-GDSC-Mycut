import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import fileUpload from 'express-fileupload';
// import { connectMDB } from './config/databases/mongoconn.js';
// import { connectPDB } from './config/databases/postgreconn.js';
import { errorMiddleware } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js'
// import channelRoutes from './routes/channelRoutes.js';
// import messageRoutes from './routes/messageRoutes.js';
// import workspaceRoutes from './routes/workspaceRoutes.js';
import './models/index.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user',userRoutes);
// app.use('/api/v1/workspace', workspaceRoutes);
// app.use('/api/v1/channel', channelRoutes);
// app.use('/api/v1/message', messageRoutes);

// connectMDB();
// connectPDB();

app.use(errorMiddleware); // Error handling middleware

export default app;
