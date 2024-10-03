//app.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js'
import channelRoutes from './routes/channelRoutes.js';
// import messageRoutes from './routes/messageRoutes.js';
import userChannelRelationRoutes from './routes/userChannelRelationRoutes.js'
import workspaceRoutes from './routes/workspaceRoutes.js';
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
app.use('/api/v1/workspace', workspaceRoutes);
app.use('/api/v1/workspace/:workspaceId/channel', channelRoutes);
app.use('/api/v1/workspace/:workspaceId/channel/:channelId',userChannelRelationRoutes);
// app.use('/api/v1/message', messageRoutes);

// connectMDB();
// connectPDB();

app.use(errorMiddleware); // Error handling middleware

export default app;
