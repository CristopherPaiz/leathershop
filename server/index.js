const port = process.env.PORT || 3000;
const cors = require("cors");
const express = require("express");
const connect = require("./database/connection");
const routesChumpa = require("./routes/routeChumpa");

connect();
const app = express();

app.use(express.json());
app.use("/api", routesChumpa);
app.use(cors());

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
