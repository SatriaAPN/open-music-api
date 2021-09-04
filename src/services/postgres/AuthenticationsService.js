const { AuthenticationModel } = require('../../models');

const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationsService {
  constructor() {
    this._Authentication = AuthenticationModel;
  }

  async addRefreshToken(token) {
    await this._Authentication.create({
      token,
    });
  }

  async verifyRefreshToken(token) {
    const authentication = await this._Authentication.findOne({
      where: { token },
    });

    if (!authentication) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async deleteRefreshToken(token) {
    await this.verifyRefreshToken(token);

    const authentication = await this._Authentication.findOne({
      where: { token },
    });

    await authentication.destroy();
  }
}

module.exports = AuthenticationsService;
