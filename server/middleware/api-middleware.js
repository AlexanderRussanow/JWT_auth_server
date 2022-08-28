const ApiError = require("../exceptions/api-errors");

module.exports = function(err, req, res) {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      message: err.message,
      error: err.error,
    });
  } else {
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
}