const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { PlaylistModel, UserModel, CollaborationModel } = require('../../models');

class CollaborationsService {
  constructor(cacheService) {
    this._Collaboration = CollaborationModel;
    this._Playlist = PlaylistModel;
    this._User = UserModel;
    this._cacheService = cacheService;
  }

  async addCollaboration(playlistId, userId) {
    const id = `collab-${nanoid(16)}`;

    const collaboration = await this._Collaboration.create({
      id, playlistId, userId,
    });

    if (!collaboration) {
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }

    await this._cacheService.delete(`songs:${playlistId}`);
  }

  async deleteCollaboration(playlistId, userId) {
    const collaboration = await this._Collaboration.findOne({
      where: { playlistId, userId },
    });

    if (!collaboration) {
      throw new InvariantError('Kolaborasi gagal dihapus');
    }

    await this._cacheService.delete(`songs:${playlistId}`);
    await collaboration.destroy();
  }

  async verifyCollaborator(playlistId, userId) {
    const collaboration = await this._Collaboration.findOne({
      where: { playlistId, userId },
    });

    if (!collaboration) {
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }
  }

  async findAllCollaborationByUserId(userId) {
    const playlistsCollaboration = await this._Collaboration.findAll({
      where: { userId },
      attributes: ['CollaborationModel.id', 'PlaylistModel.name', 'PlaylistModel.UserModel.username'],
      include: [{
        model: this._Playlist,
        attributes: [],
        include: [{
          model: this._User,
          attributes: [],
          required: true,
          right: false,
        }],
        required: true,
        right: false,
      }, {
        model: this._User,
        attributes: [],
        required: true,
        right: false,
      }],
      raw: true,
    });

    return playlistsCollaboration;
  }
}

module.exports = CollaborationsService;
