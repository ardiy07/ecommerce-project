const sendEmail = require("../services/emailService");
const consumer = require("../config/kafka");
const render = require("../templates/render");

const topics = ["send-otp"];

const runCosumer = async () => {
  await consumer.connect();

  for (const topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: true });
  }

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const event = JSON.parse(message.value.toString());
      const { email, data } = event;

      try {
        const html = render(topic, data);
        await sendEmail(email, `Subject for ${topic}`, html);
        console.log("Email sent successfully");
      } catch (error) {
        console.log(error);
      }
    },
  });
};

module.exports = runCosumer;
