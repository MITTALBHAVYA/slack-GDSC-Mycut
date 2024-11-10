//passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel.js';
import { UserPreferences } from '../models/userPreferencesModel.js';
import JwtService from '../services/jwtServices.js';

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser(async(id,done)=>{
    try{
        const user = await User.findByPk(id);
        done(null,user);
    }catch(error){
        done(error,null);
    }
});

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:`/google/callback`,
    
},async(req,accessToken,refreshToken,profile,done)=>{
    try{
        let user = await User.findOne({
            where: {
                google_auth_id : profile.id
            }
        });
        if(!user){
            const existingUser = await User.findOne({
                where:{
                    email:profile.emails[0].value
                }
            });

            if(existingUser){
                existingUser.google_auth_id = profile.id;
                await existingUser.save();
                user = existingUser;
            }
            else{
                user = await User.create({
                    username:profile.displayName,
                    email:profile.emails[0].value,
                    google_auth_id:profile.id,
                    password:null
                });

                await UserPreferences.create({
                    user_id : user.id
                });
            }
        }
        const token = JwtService.generateToken(user);
        user.token = token;
        done(null,user);
    }catch(error){
        done(error,null);
    }
}));

export default passport;