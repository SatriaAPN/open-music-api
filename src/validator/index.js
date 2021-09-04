const UsersValidator = require('./users');
const SongsValidator = require('./songs');
const PlaylistValidator = require('./playlists');
const CollaborationsValidator = require('./collaborations');
const AuthenticationsValidator = require('./authentications');

module.exports = {
  // eslint-disable-next-line max-len
  UsersValidator, SongsValidator, PlaylistValidator, CollaborationsValidator, AuthenticationsValidator,
};
