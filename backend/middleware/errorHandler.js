//errorHandler.js
class ErrorHandler extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true; // Mark this error as operational
    }
  }
  
  export const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error.";
  
    // Handle specific types of errors
    if (err.name === "CastError") {
      const message = `Invalid ${err.path}`;
      err = new ErrorHandler(message, 400);
    } else if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered.`;
      err = new ErrorHandler(message, 400);
    } else if (err.name === "JsonWebTokenError") {
      const message = `Json Web Token is invalid, try again.`;
      err = new ErrorHandler(message, 400);
    } else if (err.name === "TokenExpiredError") {
      const message = `Json Web Token is expired, try again.`;
      err = new ErrorHandler(message, 400);
    }
  
    // Send response
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      // Include stack trace only in development
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  };
  
  export default ErrorHandler;
  