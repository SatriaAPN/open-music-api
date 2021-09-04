const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ PlaylistModel, CollaborationModel }) {
      // define association here
      this.hasMany(PlaylistModel, { foreignKey: 'ownerId' });
      this.hasMany(CollaborationModel, { foreignKey: 'userId' });
    }
  }
  User.init({
    id: {
      primaryKey: true,
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hashed: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'UserModel',
  });
  return User;
};
