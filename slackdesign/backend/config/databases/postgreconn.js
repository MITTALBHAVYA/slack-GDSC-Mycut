import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const postgresConnection = new Sequelize(
  process.env.PG_DB,     // Database name
  process.env.PG_USER,   // Username
  process.env.PG_PASSWORD, // Password
  {
    host: process.env.PG_HOST,
    dialect: 'postgres',
    logging: false,
  }
);

// Function to test connection
// export const connectPDB = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('PostgreSQL connected successfully');
//   } catch (err) {
//     console.error('Error connecting to PostgreSQL:', err);
//   }
// };

export default postgresConnection;
