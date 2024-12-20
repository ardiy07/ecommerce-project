const nodemailer = require("nodemailer");
const env = require("../config/env");

const tranporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: "sendotp." + env.EMAIL_USER,
    to,
    subject,
    html,
  };
  try {
    await tranporter.sendMail(mailOptions);
    console.log("Email sent successfull");
  } catch (error) {
    console.log(error);
    throw new error();
  }
};

module.exports = sendEmail;
