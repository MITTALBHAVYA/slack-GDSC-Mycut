//postgreconn.js

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const postgresConnection = new Sequelize(
  process.env.PG_URL || process.env.PG_DB,
  process.env.PG_URL
  ? {
    dialect: 'postgres',
    dialectOptions:{
      ssl : {
        require:true,
        rejectUnauthorized: false,
      },
    },
    logging:false,
  }
  :{
    host: process.env.PG_HOST,
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    dialect: 'postgres',
    logging: false,
  }
);

export default postgresConnection;