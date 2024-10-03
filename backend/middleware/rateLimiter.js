//rateLimiter.js
import rateLimit from "express-rate-limit";

export const rateLimiter = (minutes,maxRequests)=>{
    return rateLimit({
        windowMs:minutes*60*1000,
        max:maxRequests,
        message:`Too many requests from this IP, please try again after ${minutes} minutes`,
        headers:true,
    })
}