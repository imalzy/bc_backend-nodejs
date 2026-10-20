// Config Database
const maria_db = require("mariadb");
require('dotenv').config();

const connect = maria_db.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5
})

module.exports = connect;