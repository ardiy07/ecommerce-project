const env = require("./env");

module.exports = {
  "username": env.DB_USER,
  "password": env.DB_PASSWORD,
  "database": env.DB_NAME,
  "host": env.DB_HOST_SEQUELIZE,
  "dialect": "mysql",
};
