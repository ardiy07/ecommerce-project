const runConsumer = require("./consumers/kafkaConsumer");

(async () => {
  try {
    await runConsumer();
    console.log("Email service is running");
  } catch (error) {
    console.error("Failed to run email service:", error);
    process.exit(1);
  }
})();
