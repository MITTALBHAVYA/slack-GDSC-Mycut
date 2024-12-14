//server.js
import http from 'http';
import app from './app.js';
import dotenv from 'dotenv';
import postgresConnection from './config/databases/postgreconn.js';
import mongoConnection from './config/databases/mongoconn.js';
import initSocketIO from './services/socketIO.js'

dotenv.config(); // Load environment variables

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await postgresConnection.authenticate();
    console.log("PostgreSQL connection has been established successfully");

    await mongoConnection();
    console.log("MongoDB connection has been established successfully");

    const server = http.createServer(app);

    const io = initSocketIO(server);

    server.listen(PORT,'0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log('Unable to start the server: ', error);
    process.exit(1);
  }
}
startServer();
