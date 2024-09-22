import { OAuth2Client } from 'google-auth-library';
import User from '../models/userModel.js'; // Adjust the path if needed
import JwtService from './jwtServices.js'; // Import the JwtService

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

/**
 * Handle Google authentication
 * @param {string} googleToken - Google ID token
 * @param {object} res - The response object to send JWT token
 * @returns {Promise<Object>} - User data and JWT token
 */
const authenticateWithGoogle = async (googleToken, res) => {
    const { email, name, sub: googleId } = await verifyGoogleToken(googleToken);

    // Check if user already exists
    let user = await User.findOne({ where: { email } });

    if (!user) {
        // Handle unique username
        let username = name;
        let existingUser = await User.findOne({ where: { username } });

        while (existingUser) {
            username = `${name}${Math.floor(Math.random() * 10000)}`; // Generate a unique username
            existingUser = await User.findOne({ where: { username } });
        }

        // Create a new user if not exists
        user = await User.create({
            email,
            username,
            google_auth_id: googleId,
            password: null, // Setting password to null for Google-authenticated users
        });
    }

    // Use JwtService to generate JWT and send it as a response
    JwtService.sendToken(user, 200, res, 'Google authentication successful');
};

export { authenticateWithGoogle };
