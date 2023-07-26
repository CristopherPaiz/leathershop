const port = process.env.PORT || 3000;
const cors = require("cors");
const express = require("express");
const connect = require("./database/connection");
const routesChumpa = require("./routes/routeChumpa");
const routesUser = require("./routes/routeUser");
const routeCosmetico = require("./routes/routeCosmetico");
const clienteCosmetico = require("./routes/routeCliente");

connect();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api", routesChumpa);
app.use("/api", routesUser);
app.use("/api", routeCosmetico);
app.use("/api", clienteCosmetico);

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
