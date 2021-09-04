const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ PlaylistsongModel }) {
      // define association here
      this.hasMany(PlaylistsongModel, { foreignKey: 'songId' });
    }

    toJSON() {
      return { ...this.get(), createdAt: undefined };
    }
  }
  Song.init({
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    performer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'songs',
    modelName: 'SongModel',
  });
  return Song;
};
