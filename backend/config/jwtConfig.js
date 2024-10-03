//jwtConfig.js
export const jwtConfig = {
    secretKey: process.env.JWT_SECRET_KEY ,
    expiresIn: process.env.JWT_EXPIRE , 
    cookieExpire: process.env.COOKIE_EXPIRE ,
};
