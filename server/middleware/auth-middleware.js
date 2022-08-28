const ApiError = require("../exceptions/api-errors")
const TokenService = require("../services/token-service");

module.exports = function(req, res, next) {
      try {
         const authotization = req.headers.authorization;
         if (!authotization) {
            return next(ApiError.unauthorizedError());
         }
         const [, accessToken] = authotization.split(" ");
         if (!accessToken) {
            return next(ApiError.unauthorizedError());
         }
         const userData = TokenService.validateAccessToken(accessToken);
         if (!userData) {
            return next(ApiError.unauthorizedError());
         }
         req.user = userData;
         next()

   } catch (err) {
      return next(ApiError.unauthorizedError())
   }
}