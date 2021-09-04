const UsersValidator = require('./users');
const SongsValidator = require('./songs');
const PlaylistValidator = require('./playlists');
const CollaborationsValidator = require('./collaborations');
const AuthenticationsValidator = require('./authentications');
const UploadsValidator = require('./uploads');
const ExportsValidator = require('./exports');

module.exports = {
  // eslint-disable-next-line max-len
  UsersValidator,
  SongsValidator,
  PlaylistValidator,
  CollaborationsValidator,
  AuthenticationsValidator,
  UploadsValidator,
  ExportsValidator,
};
