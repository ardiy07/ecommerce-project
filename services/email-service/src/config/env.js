require("dotenv").config();

module.exports = {
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    KAFKA_BROKER: process.env.KAFKA_BROKER
}