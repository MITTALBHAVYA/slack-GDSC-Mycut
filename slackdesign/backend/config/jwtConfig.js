export const jwtConfig = {
    secretKey: process.env.JWT_SECRET_KEY ,  // Secret used to sign JWTs
    expiresIn: process.env.JWT_EXPIRE ,  // JWT expiration time, default 7 days
    cookieExpire: process.env.COOKIE_EXPIRE ,  // Cookie expiration in days
};
