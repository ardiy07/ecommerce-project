const consumer = require("../config/kafka");
const sendEmail = require("../providers/email/emailSender");
const emailTopics = require("../providers/email/emailTopics");

const emailConsumer = async () => {
  await consumer.connect();
  await Promise.all(
    Object.keys(emailTopics).map(async (topic) => {
      consumer.subscribe({ topic, fromBeginning: true });
    })
  );

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (topic in emailTopics) {
        const { subject, template } = emailTopics[topic];
        const data = JSON.parse(message.value.toString());
        console.log(`Sending email to ${data.to} for topic ${topic}`);
        await sendEmail(data.to, subject, template, data.context);
      } else {
        console.warn(`Unknown topic: ${topic}`);
      }
    },
  });
};

module.exports = emailConsumer;
