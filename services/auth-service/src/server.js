const env = require("./config/env");
const express = require("express");
const app = express();
const routes = require("./routes/authRoute");

app.use(express.json());
app.use("/auth", routes);

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
