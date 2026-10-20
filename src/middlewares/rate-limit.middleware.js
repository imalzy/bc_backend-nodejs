const { rateLimit } = require('express-rate-limit');

const authLimit = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        message: "Terlalu banyak hit login!!"
    }
})

module.exports = { authLimit }