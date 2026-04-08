const mysql = require("mysql2/promise");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env")
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306, // ✅ ensure number
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  // ✅ REQUIRED for Railway (SSL)
  ssl: {
    rejectUnauthorized: false   // ⚠️ IMPORTANT CHANGE
  },

  connectTimeout: 20000 // ✅ avoid timeout issues
});

// ✅ TEST CONNECTION
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully 🚀");
    connection.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

module.exports = pool;