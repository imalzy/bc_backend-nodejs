function successResponse(res, message, data = null, statusCode = 200, meta = null) {
    let response = {
        success : true,
        message
    }

    if(data) response.data = data;
    if(meta) response.meta = meta;

    return res.status(statusCode).json(response);
}

function errorResponse(res, message, statusCode = 400) {
    return res.status(statusCode).json({
        success : false,
        message
    })
}

function validationErrorResponse(res, errors, message = 'Validation failed'){
    return res.status(400).json({
        success : false,
        message,
        errors
    })
}

module.exports = {
    successResponse,
    errorResponse,
    validationErrorResponse
}