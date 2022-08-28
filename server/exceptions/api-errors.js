
module.exports = class ApiError extends Error {
  statusCode;
  errors;

  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }

  static unauthorizedError() {
    return new ApiError(401, "Unauthorized");
  }

  static badRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }
};
