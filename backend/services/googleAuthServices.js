// googleAuthServices.js

import { OAuth2Client } from 'google-auth-library';
import { Op } from 'sequelize';
import User from '../models/userModel.js'; // Adjust the path if needed
import JwtService from './jwtServices.js'; // Import the JwtService
import { UserPreferences } from '../models/userPreferencesModel.js';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);

/**
 * Verify Google ID Token and get user info
 * @param {string} googleToken - Google ID token
 * @returns {Promise<Object>} - User information
 */
const verifyGoogleToken = async (googleToken) => {
    try {
        const ticket = await oauth2Client.verifyIdToken({
            idToken: googleToken,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return payload;
    } catch (error) {
        throw new Error('Invalid Google Token');
    }
};

const generateUniqueUsername = async (baseName) => {
    let username = baseName.replace(/\s+/g, '').toLowerCase();
    let suffix = 0;
    let isUnique = false;
    let finalUsername = username;

    while (!isUnique) {
        const existingUser = await User.findOne({ where: { username: finalUsername } });
        if (!existingUser) {
            isUnique = true;
        } else {
            suffix += 1;
            finalUsername = `${username}${suffix}`;
        }
    }
    return finalUsername;
};

/**
 * Handle Google authentication
 * @param {string} googleToken - Google ID token
 * @param {object} res - The response object to send JWT token
 * @returns {Promise<void>}
 */
const authenticateWithGoogle = async (googleToken, res) => {
    const { email, name, sub: googleId } = await verifyGoogleToken(googleToken);

    let user = await User.findOne({
        where: {
            [Op.or]: [{ email }, { google_auth_id: googleId }]
        }
    });

    if (user) {
        if (!user.google_auth_id) {
            user.google_auth_id = googleId;
            await user.save();
        }
    } else {
        const username = await generateUniqueUsername(name);
        user = await User.create({
            email,
            username,
            google_auth_id: googleId,
            password: null,
        });

        await UserPreferences.create({
            user_id: user.id,
        });
    }

    // Send the token as a response and end the function
    return JwtService.sendToken(user, 200, res, 'Google authentication successful');
};

export { authenticateWithGoogle };
