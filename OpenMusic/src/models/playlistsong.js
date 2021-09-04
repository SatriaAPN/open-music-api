const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Playlistsong extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ SongModel, PlaylistModel }) {
      // define association here
      this.belongsTo(PlaylistModel, { foreignKey: 'playlistId' });
      this.belongsTo(SongModel, { foreignKey: 'songId' });
    }
  }
  Playlistsong.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    tableName: 'playlistsongs',
    modelName: 'PlaylistsongModel',
  });
  return Playlistsong;
};
