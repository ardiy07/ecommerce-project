const emailConsumer = require("./consumers/emailConsumer");

(async () => {
  try {
    await emailConsumer();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
