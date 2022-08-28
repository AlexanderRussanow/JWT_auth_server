module.exports = class UserDto {
  email;
  isActivated;
  id;
  constructor(user) {
    this.email = user.email;
    this.id = user._id;
    this.isActivated = user.isActivated;
  }
};
