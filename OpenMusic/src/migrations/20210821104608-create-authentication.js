module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('authentications', {
      token: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('authentications');
  },
};
