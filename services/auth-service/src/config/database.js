const env = require("./env");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD,  {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: "mysql",
    logging: true
});

module.exports = sequelize;