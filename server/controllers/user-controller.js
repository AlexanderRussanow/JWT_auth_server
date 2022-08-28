const UserService = require("../services/user-service");
const ApiError = require("../exceptions/api-errors");
const validationResult = require("express-validator").validationResult;

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.badRequest(
            "Validation email or password error",
            errors.array()[0].msg
          )
        );
      }
      const { email, password } = req.body;
      const user = await UserService.registration(email, password);
      res.cookie("refreshToken", user.refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      return res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async activate(req, res, next) {
    try {
      const { link } = req.params;
      await UserService.activate(link);
      return res.redirect(process.env.FRONTEND_URL);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await UserService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      return res.json(userData);
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await UserService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (err) {
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await UserService.refresh(refreshToken);
      res.cookie("refreshToken", token.refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      return res.json(token);
    } catch (err) {
      next(err);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await UserService.getAllUsers();
      return res.json(users);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
