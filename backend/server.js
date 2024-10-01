import http from 'http';
import app from './app.js'; // Importing your Express app
import dotenv from 'dotenv';
import postgresConnection from './config/databases/postgreconn.js';
import mongoConnection from './config/databases/mongoconn.js';
// import logger from "./utils/logger.js";


dotenv.config(); // Load environment variables

// Set up the port from environment variables or default to 5000
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await postgresConnection.authenticate();
    console.log("PostgreSQL connection has been established successfully");

    await mongoConnection();
    console.log("MongoDB connection has been established successfully");

    const server = http.createServer(app);

    // Start listening on the specified port
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log('Unable to start the server: ',error);
    process.exit(1);
  }
}
// Create the HTTP server and pass in the Express app
startServer();
