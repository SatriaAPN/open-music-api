module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('playlistsongs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      playlistId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      songId: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable('playlistsongs');
  },
};
