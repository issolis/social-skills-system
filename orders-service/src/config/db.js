import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: process.env.DB_SSL === 'true'
    ? { rejectUnauthorized: false }
    : false,
  connectionTimeoutMillis: 5000
});
pool.on("connect", () => {
    console.log("[DB] Users service connected");
});

pool.on("error", (err) => {
    console.error("[DB ERROR]", err.message);
});

export default pool; 