const { Kafka } = require("kafkajs");
const env = require("./env");

const kafka = new Kafka({
  clientId: "email-service",
  brokers: [env.KAFKA_BROKER],
});

const consumer = kafka.consumer({
  groupId: "email-service-group",
});

module.exports = consumer;
