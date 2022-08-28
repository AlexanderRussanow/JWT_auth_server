const jwt = require('jsonwebtoken');
const TokenModel = require('../models/token-model');


class TokenService {
   generateToken(payload) {
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
      return { accessToken, refreshToken };
   }

   validateRefreshToken(refreshToken) {
      return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
   }

   validateAccessToken(accessToken) {
      return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
   }

   async saveRefreshToken(refreshToken, user) {
      const tokenData = await TokenModel.findOne({ user: user  });
      if (tokenData) {
         tokenData.refreshToken = refreshToken;
         await tokenData.save();
      }
      const token = await TokenModel.create({ user: user, refreshToken: refreshToken });
      return token;
   }

   async removeToken(refreshToken) {
      return TokenModel.remove({ refreshToken });
   }

   async findToken(refreshToken) {
      return TokenModel.findOne({ refreshToken });
   }
}

module.exports = new TokenService();