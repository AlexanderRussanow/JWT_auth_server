const UserModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const MailService = require("./mail-service");
const TokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-errors");

class UserService {
  async registration(email, password) {
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      throw ApiError.badRequest(`User with email ${email} already exist`);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // const activationLink = Math.random().toString(36).substring(7);
    const activationLink = uuid.v4();
    const user = await UserModel.create({
      email,
      password: hashedPassword,
      activationLink,
    });

    await MailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );
    const userDto = new UserDto(user);
    const tokens = TokenService.generateToken({ ...userDto });
    await TokenService.saveRefreshToken(tokens.refreshToken, user.id);
    return { user: userDto, ...tokens };
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.badRequest(
        `User with activationLink ${activationLink} not found`
      );
    }
    user.isActivated = true;
    user.activationLink = null;
    await user.save();
    return user;
  }

  async login(email, password) {
    const userExist = await UserModel.findOne({ email });
    if (!userExist) {
      throw ApiError.badRequest(`User with email ${email} not found`);
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      userExist.password
    );
    if (!isPasswordCorrect) {
      throw ApiError.badRequest(`Password is incorrect`);
    }
    if (!userExist.isActivated) {
      throw ApiError.badRequest(`User is not activated`);
    }
    const userDto = new UserDto(userExist);
    const tokens = TokenService.generateToken({ ...userDto });
    await TokenService.saveRefreshToken(tokens.refreshToken, userExist.id);
    return { user: userDto, ...tokens };
  }

  async logout(refreshToken) {
    const token = await TokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.unauthorizedError();
    }
    const userData = await TokenService.validateRefreshToken(refreshToken);
    const refreshTokenFromDB = await TokenService.findToken(refreshToken);
    if (!userData || !refreshTokenFromDB) {
      throw ApiError.unauthorizedError();
    }
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = TokenService.generateToken({ ...userDto });
    await TokenService.saveRefreshToken(tokens.refreshToken, user.id);
    return { user: userDto, ...tokens };
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }
}

module.exports = new UserService();
