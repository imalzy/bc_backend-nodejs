const { rateLimit } = require('express-rate-limit');

const authLimit = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    statusCode: 429,
    message: {
        message: "Terlalu banyak hit login!!"
    }
})

// Handle DDoS atau scrapping berlebihan
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    limit: 100, // Maksimal 100 request per 15 menit per IP
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    statusCode: 429,
    message: {
        success: false,
        message: "Terlalu banyak request. Silakan coba beberapa saat lagi."
    }
});

module.exports = { authLimit, apiLimiter }