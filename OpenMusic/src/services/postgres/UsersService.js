const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');
const { UserModel } = require('../../models');

class UsersService {
  constructor() {
    this._User = UserModel;
  }

  async addUser({ username, fullname, password }) {
    await this.verifyUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this._User.create({
      id, username, fullname, hashed: hashedPassword,
    });

    if (!user) {
      throw new InvariantError('User gagal ditambahkan');
    }

    return user.toJSON().id;
  }

  async verifyUsername(username) {
    const user = await this._User.findOne({
      where: { username },
    });

    if (user) {
      throw new InvariantError(
        'Gagal menambahkan user. Username sudah digunakan.',
      );
    }
  }

  async getUserById(userId) {
    const user = await this._User.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return user.toJSON();
  }

  async verifyUserCredential(username, password) {
    const user = await this._User.findOne({
      where: { username },
    });

    if (!user) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const { id, hashed: hashedPassword } = user;

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return id;
  }

  async getUsersByUsername(username) {
    const users = await this._User.findAll({
      where: {
        username,
      },
      raw: true,
    });

    return users;
  }
}

module.exports = UsersService;
