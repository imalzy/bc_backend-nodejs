// Entry Point Database
const express = require('express')
require('dotenv').config();

const connect = require('./config/database');
const helmet = require('helmet');
const app = express();
app.use(helmet());

// import routes
const user_routes = require("./routes/user.route");

app.use(express.json());
app.disable('x-powered-by');
app.use("/api/users", user_routes);

// api/auth/login
// api/auht/register

app.get('/health', async (req, res) => {
    try {
        const rows = await connect.query("SELECT 1 AS result");

        res.json({
            message: 'API running!',
            database: rows[0].result === 1 ? 'connected' : 'unknown'
        })
    } catch (error) {
        res.status(500).json({
            message: 'Database connection Failed'
        })
    }
})



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))