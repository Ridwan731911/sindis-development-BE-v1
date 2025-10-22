const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    return queryInterface.bulkInsert('users', [{
      name: 'Admin',
      role: 'admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      refresh_token: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', { email: 'admin@gmail.com' }, {});
  }
};
