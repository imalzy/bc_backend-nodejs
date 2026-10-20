const { errorResponse } = require('../utils/response.util');

function notFoundHandler(req, res, next) {
    return errorResponse(res, `Rute tidak ditemukan: ${req.method} ${req.originalUrl}`, 404);
}

function errorHandler(err, req, res, next) {
    const status_code = err.status || err.statusCode || 500;

    console.error(`[Error] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`, err)

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return errorResponse(res, 'Format JSON pada request body tidak valid', 400);
    }

    if (err.type === 'entity.too.large') {
        return errorResponse(res, 'Ukuran payload melebihi batas maksimal yang diizinkan (10kb)', 413);
    }

    const message = (status_code === 500)
        ? 'Terjadi kesalahan internal pada server'
        : (err.message || 'Terjadi kesalahan pada server');

    const response = {
        success: false,
        message
    };

     if (status_code === 500) {
        response.stack = err.stack;
    }

    return res.status(status_code).json(response);
}

module.exports = {
    notFoundHandler,
    errorHandler
}