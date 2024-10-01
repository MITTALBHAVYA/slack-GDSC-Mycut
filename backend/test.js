import { connectPDB } from './config/databases/postgreconn.js';
import { connectMDB } from './config/databases/mongoconn.js';
import './models/index.js';

connectPDB();
connectMDB();  // Test the connection
