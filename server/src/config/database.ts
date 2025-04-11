import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create connection pool with conservative limits to prevent resource exhaustion
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5, // Reduce connection limit to prevent overload
  queueLimit: 0,
  connectTimeout: 10000, // 10 seconds
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000, // 10 seconds
  namedPlaceholders: true, // Use named placeholders for better error messages
});

// Verify database connection on startup and periodically
const verifyConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connection established successfully");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
};

// Check connection immediately
verifyConnection();

// Check connection every 5 minutes to ensure it's still alive
setInterval(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✓ Heartbeat: Database connection is healthy");
    connection.release();
  } catch (error) {
    console.error("❌ Heartbeat check failed:", error);
  }
}, 5 * 60 * 1000);

export default pool;
