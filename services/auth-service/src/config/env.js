require("dotenv").config();

const env = {
    PORT: process.env.PORT || 3000,
    DB_HOST: process.env.DB_HOST,
    DB_HOST_SEQUELIZE: process.env.DB_HOST_SEQUELIZE,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_SECRET_REFRESH: process.env.JWT_SECRET_REFRESH
}

module.exports = env;