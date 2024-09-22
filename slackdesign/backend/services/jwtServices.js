import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'; // Ensure the path is correct for your project structure
import { jwtConfig } from '../config/jwtConfig.js'; // Import JWT config if you're using a config file

class JwtService {
    // Method to generate a JWT token
    static generateToken(user) {
        try {
            return jwt.sign({ id: user.id }, jwtConfig.secretKey, {
                expiresIn: jwtConfig.expiresIn, // From config
            });
        } catch (error) {
            throw new Error('Error generating JWT token');
        }
    }

    // Method to verify a JWT token
    static verifyToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, jwtConfig.secretKey, (err, decoded) => {
                if (err) {
                    reject(new Error('Invalid or expired token'));
                } else {
                    resolve(decoded);
                }
            });
        });
    }

    // Method to extract the user from the token
    static async getUserFromToken(token) {
        try {
            const decoded = await this.verifyToken(token); // Verify the token first
            const user = await User.findByPk(decoded.id); // Retrieve user by primary key (id)
            
            if (!user) {
                throw new Error('User not found');
            }

            return user;
        } catch (error) {
            throw new Error(error.message || 'Unable to retrieve user from token');
        }
    }

    // Method to send JWT via cookies and headers
    static sendToken(user, statusCode, res, message) {
        try {
            const token = this.generateToken(user);
            const options = {
                expires: new Date(Date.now() + jwtConfig.cookieExpire * 24 * 60 * 60 * 1000), // Cookie expiry time
                httpOnly: true, // For security, to prevent JavaScript access to cookies
            };

            const userData = {
                id: user.id,
                username: user.username,
                email: user.email,
            };

            res.status(statusCode)
                .cookie('token', token, options) // Set token in cookies
                .header('Authorization', `Bearer ${token}`) // Set token in headers
                .json({
                    success: true,
                    user: userData,
                    message,
                    token, // Return token in response if needed
                });
        } catch (error) {
            throw new Error('Error sending JWT token');
        }
    }
}

export default JwtService;
