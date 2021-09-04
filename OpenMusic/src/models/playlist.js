const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Playlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ UserModel, PlaylistsongModel, CollaborationModel }) {
      // define association here
      this.belongsTo(UserModel, { foreignKey: 'ownerId' });
      this.hasMany(PlaylistsongModel, { foreignKey: 'playlistId' });
      this.hasMany(CollaborationModel, { foreignKey: 'playlistId' });
    }
  }
  Playlist.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'playlists',
    modelName: 'PlaylistModel',
  });
  return Playlist;
};
