const { Kafka } = require("kafkajs");
const env = require("./env");

const kafka = new Kafka({
  clientId: "auth-service",
  brokers: [env.KAFKA_BROKER],
});

const consumer = kafka.consumer({
  groupId: "auth-service-group",
});
const producer = kafka.producer();

module.exports = { consumer, producer };