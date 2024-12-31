const transport = require("../../config/email");
const renderTemplate = require("./templates/renderTemplate");

const sendEmail = async (to, subject, templateName, data) => {
  const html = renderTemplate(templateName, data);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}: ${error.message}`);
  }
};

module.exports = sendEmail;