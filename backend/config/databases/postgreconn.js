import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const getPostgresConfig = () => {
  if (process.env.PG_URL) {
    return {
      connectionString: process.env.PG_URL,
      dialect: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: false,
    };
  } else {
    return {
      database: process.env.PG_DB,
      host: process.env.PG_HOST,
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      dialect: "postgres",
      logging: false,
    };
  }
};

const postgresConnection = new Sequelize(getPostgresConfig());

export default postgresConnection;
