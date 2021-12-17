function errorHandler(err, request, response, next) {
    return response.status(err.status || 500).json({
        error: {
            message: err.message
        }
    });
}

module.exports = errorHandler;