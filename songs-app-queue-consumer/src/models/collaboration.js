/* eslint-disable no-unused-vars */
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Collaboration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ UserModel, PlaylistModel }) {
      // define association here
      this.belongsTo(PlaylistModel, { foreignKey: 'playlistId' });
      this.belongsTo(UserModel, { foreignKey: 'userId' });
    }
  }
  Collaboration.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    tableName: 'collaborations',
    modelName: 'CollaborationModel',
  });
  return Collaboration;
};
