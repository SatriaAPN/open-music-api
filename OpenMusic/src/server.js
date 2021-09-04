/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();

// Dependency
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

const { sequelize } = require('./models');
const ClientError = require('./exceptions/ClientError');

// dotenv config
require('dotenv').config();

// importing the api
const { authentications,
  collaborations,
  playlists,
  songs,
  users,
  uploads,
  _exports,
} = require('./api');

// importing the postgres services
const { AuthenticationsService,
  CollaborationsService,
  PlaylistsService,
  SongsService,
  UsersService,
} = require('./services/postgres');

// importing the validator
const { AuthenticationsValidator,
  CollaborationsValidator,
  PlaylistValidator,
  SongsValidator,
  UsersValidator,
  UploadsValidator,
  ExportsValidator,
} = require('./validator');

// importing the token
const TokenManager = require('./tokenize/TokenManager');

// importing the redis services
const { StorageService } = require('./services/storage');

// importing the redis services
const { CacheService } = require('./services/redis');

// importing the rabbit mq services
const { ProducerService } = require('./services/rabbitmq');

// initializing the server
const init = async () => {
  const cacheService = new CacheService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService(cacheService);
  const playlistsService = new PlaylistsService(collaborationsService, cacheService);
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('songsapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: ExportsValidator,
        playlistsService,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
      },
    },
  ]);

  // error handling
  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    if (response instanceof ClientError) {
      // membuat response baru dari response toolkit sesuai kebutuhan error handling
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    // jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return response.continue || response;
  });

  await server.start();

  // eslint-disable-next-line no-console
  console.log(`Server berjalan pada ${server.info.uri}`);

  // initializing the database
  await sequelize.authenticate();
  // eslint-disable-next-line no-console
  console.log('database on');
};

init();
