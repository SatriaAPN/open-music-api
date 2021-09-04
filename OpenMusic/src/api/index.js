const songs = require('./songs');
const users = require('./users');
const playlists = require('./playlists');
const collaborations = require('./collaborations');
const authentications = require('./authentications');
const uploads = require('./uploads');
const _exports = require('./exports');

module.exports = {
  // eslint-disable-next-line comma-dangle
  songs,
  users,
  playlists,
  collaborations,
  authentications,
  uploads,
  _exports,
};
