const ClientError = require('../../exceptions/ClientError');

class songsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  postSongHandler = async(request, h) => {
    try {
      await this._validator.validateSongPayload(request.payload);
      const {
        title = 'untitled', year, performer, genre, duration,
      } = request.payload;

      const songId = await this._service.addSong({
        title, year, performer, genre, duration,
      });
      
      const response = h.response({
        status: 'success',
        message: 'lagu berhasil ditambahkan',
        data: {
          songId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);

      return response;
    }
  }

  getSongsHandler = async() => {
    const songs = await this._service.getsongs();

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  getSongByIdHandler = async(request, h) => {
    try {
      const { id } = request.params;
      const song = await this._service.getSongById(id);

      return {
        status: 'success',
        data: {
          song,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);

      return response;
    }
  }

  putSongByIdHandler = async(request, h) => {
    try {
      await this._validator.validateSongPayload(request.payload);
      const { id } = request.params;

      await this._service.editSongById(id, request.payload);

      return {
        status: 'success',
        message: 'lagu berhasil diperbarui',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'fail',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(404);

      return response;
    }
  }

  deleteSongByIdHandler = async(request, h) => {
    try {
      const { id } = request.params;
      await this._service.deleteSongById(id);

      return {
        status: 'success',
        message: 'lagu berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);

      return response;
    }
  }
}

module.exports = songsHandler;
