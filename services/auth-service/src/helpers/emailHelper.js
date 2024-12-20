const { producer } = require("../config/kafka");

const sendOTPEmail = async (email, otp) => {
  try {
    await producer.connect();
    await producer.send({
      topic: "send-otp",
      messages: [
        {
          value: JSON.stringify({
            email,
            data: {
              email,
              otp,
            },
          }),
        },
      ],
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.log(error);
  } finally {
    await producer.disconnect();
  }
};

module.exports = { sendOTPEmail };
