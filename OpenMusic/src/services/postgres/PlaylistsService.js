const { nanoid } = require('nanoid');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const {
  PlaylistModel, PlaylistsongModel, UserModel, SongModel, CollaborationModel,
} = require('../../models');

class PlaylistsService {
  constructor(collaborationService, cacheService) {
    this._collaborationService = collaborationService;
    this._Playlist = PlaylistModel;
    this._Playlistsong = PlaylistsongModel;
    this._User = UserModel;
    this._Song = SongModel;
    this._Collaboration = CollaborationModel;
    this._cacheService = cacheService;

    this.getSongsFromPlaylist = this.getSongsFromPlaylist.bind(this);
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const playlist = await this._Playlist.create({
      id, name, ownerId: owner,
    });

    if (!playlist) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return playlist.toJSON().id;
  }

  async getPlaylists(owner) {
    const playlists = await this._Playlist.findAll({
      where: { ownerId: owner },
      attributes: ['PlaylistModel.id', 'PlaylistModel.name', 'UserModel.username'],
      include: [{
        model: this._User,
        attributes: [],
        required: true,
        right: false,
      }],
      raw: true,
    });

    const collaborationPlaylists = await this._collaborationService.findAllCollaborationByUserId(owner);

    return playlists.concat(collaborationPlaylists);
  }

  async deletePlaylistById(id) {
    const playlist = await this._Playlist.findOne({
      where: { id },
    });

    if (!playlist) {
      throw new NotFoundError(
        'Playlist gagal dihapus. Id tidak ditemukan',
      );
    }

    await playlist.destroy();
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `ps-${nanoid(16)}`;

    const playlistsong = await this._Playlistsong.create({
      id, playlistId, songId,
    });

    await this._cacheService.delete(`songs:${playlistId}`);

    if (!playlistsong) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }
  }

  async getSongsFromPlaylist(playlistId) {
    try {
      const result = await this._cacheService.get(`songs:${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
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
      // Set Cache
      await this._cacheService.set(
        `songs:${playlistId}`,
        JSON.stringify(songs),
      );

      return songs;
    }
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const song = await this._Playlistsong.findOne({
      where: { playlistId, songId },
    });

    if (!song) {
      throw new InvariantError('Lagu gagal dihapus, lagu atau playlist tidak ditemukan');
    }

    await this._cacheService.delete(`songs:${playlistId}`);
  }

  async verifyPlaylistOwner(id, owner) {
    const playlist = await this._Playlist.findOne({
      where: { id },
      raw: true,
    });

    if (!playlist) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    if (playlist.ownerId !== owner) {
      throw new AuthorizationError(
        'Anda tidak berhak mengakses resource ini',
      );
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(
          playlistId,
          userId,
        );
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
