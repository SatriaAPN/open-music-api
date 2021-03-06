/* eslint-disable no-unused-vars */
const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Authentication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Authentication.init({
    token: {
      allowNull: false,
      type: DataTypes.STRING,
      primaryKey: true,
    },
  }, {
    sequelize,
    tableName: 'authentications',
    modelName: 'AuthenticationModel',
  });
  return Authentication;
};
