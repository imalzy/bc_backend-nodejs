
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Token tidak ditemukan'
        });
    }

    const token = authHeader.split(' ')[1];

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({
            success: false,
            message: 'JWT_SECRET belum dikonfigurasi'
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            { algorithms: ['HS256'] }
        );

        req.user = {
            id: decoded.sub,
            email: decoded.email
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token tidak valid atau sudah kedaluwarsa'
        });
    }
};

module.exports = authenticateToken;
