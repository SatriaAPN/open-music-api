/* eslint-disable radix */
/* eslint-disable no-param-reassign */
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { SongModel } = require('../../models');

class SongsService {
  constructor() {
    this._Song = SongModel;
  }

  async addSong({
    title, year, performer, genre, duration,
  }) {
    const id = `song-${nanoid(10)}`;
    year = parseInt(year);
    duration = parseInt(duration);

    const song = await this._Song.create({
      id, title, year, performer, genre, duration,
    });

    if (!song) {
      throw new InvariantError('lagu gagal ditambahkan');
    }

    return song.dataValues.id;
  }

  async getSongs() {
    const songs = await this._Song.findAll({
      raw: true,
      attributes: ['id', 'title', 'performer'],
    });

    return songs;
  }

  async getSongById(id) {
    const song = await this._Song.findOne({
      raw: true,
      where: { id },
      attributes: ['*', ['createdAt', 'insertedAt']],
    });

    if (!song) {
      throw new NotFoundError('Gagal menemukan lagu. Id tidak ditemukan');
    }

    return song;
  }

  async editSongById(id, {
    title, year, performer, genre, duration,
  }) {
    const song = await this._Song.findOne({
      where: { id },
    });
    if (!song) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }

    song.title = title;
    song.year = parseInt(year);
    song.performer = performer;
    song.genre = genre;
    song.duration = parseInt(duration);

    await song.save();
  }

  async deleteSongById(id) {
    const song = await this._Song.findOne({
      where: { id },
    });
    if (!song) {
      throw new NotFoundError('lagu gagal dihapus. Id tidak ditemukan');
    }

    await song.destroy();
  }
}

module.exports = SongsService;
