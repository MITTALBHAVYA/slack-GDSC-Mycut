//app.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js'
import channelRoutes from './routes/channelRoutes.js';
import messageRoutes from "./routes/messageRoutes.js";
import userChannelRelationRoutes from './routes/userChannelRelationRoutes.js'
import workspaceRoutes from './routes/workspaceRoutes.js';
import session from 'express-session';
import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-google-oauth20';
import User from './models/userModel.js';
import JwtService from './services/jwtServices.js';
import { UserPreferences } from './models/userPreferencesModel.js';
import './models/index.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "https://accounts.google.com"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuth2Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/v1/auth/google/callback',
    scope: ["profile", "email"]
  },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          where: {
            google_auth_id: profile.id
          }
        });
        if (!user) {
          const existingUser = await User.findOne({
            where: {
              email: profile.emails[0].value
            }
          });

          if (existingUser) {
            existingUser.google_auth_id = profile.id;
            await existingUser.save();
            user = existingUser;
          }
          else {
            user = await User.create({
              username: profile.displayName,
              email: profile.emails[0].value,
              google_auth_id: profile.id,
              password: null
            });

            await UserPreferences.create({
              user_id: user.id
            });
          }
        }
        const token = JwtService.generateToken(user);
        user.token = token;
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user);
})

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/api/v1/auth/google', passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/api/v1/auth/google/callback", 
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/auth/login`
  }), 
  (req, res) => {
    const token = req.user.token;
    const userData = {
      id:req.user.id,
      username: req.user.username,
      email: req.user.email
    };

    // Set the token as a cookie
    res.cookie('token', token, { httpOnly: true, secure: true });

    // Set the token in the Authorization header
    res.setHeader('Authorization', `Bearer ${token}`);

    // Redirect to frontend callback with token and userData
    res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?token=${encodeURIComponent(token)}&userData=${encodeURIComponent(JSON.stringify(userData))}`);
  }
);


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/workspace', workspaceRoutes);
app.use('/api/v1/workspace/:workspaceId/channel', channelRoutes);
app.use('/api/v1/workspace/:workspaceId/channel/:channelId', userChannelRelationRoutes);
app.use('/api/v1/workspace/:workspaceId/channel/:channelId/messages', messageRoutes);
app.use(errorMiddleware); // Error handling middleware

export default app;
