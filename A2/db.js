
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || "database-1.c1xnj8i7pnpu.us-east-1.rds.amazonaws.com",
    user: process.env.DB_USER || "vedant",
    password: process.env.DB_PASS || "Life-123",
    database: process.env.DB_NAME || "cloudass2",
});

module.exports = pool;
