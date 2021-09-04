const { PlaylistsongModel, SongModel } = require('./models');
 
class SongsService {
  constructor() {
    this._Playlistsong = PlaylistsongModel;
    this._Song = SongModel;
  }
 
  async getSongs(playlistId) {
    const songs = await this._Playlistsong.findAll({
      where: { playlistId },
      attributes: ['PlaylistsongModel.id', 'SongModel.title', 'SongModel.performer'],
      include: [{
        model: this._Song,
        attributes: [],
        required: true,
        right: false,
      }],
      raw: true,
    });

    return songs;
  }
}
 
module.exports = SongsService;