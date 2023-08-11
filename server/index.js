const port = process.env.PORT || 3000;
const cors = require("cors");
const express = require("express");
const connect = require("./database/connection");
const routesChumpa = require("./routes/routeChumpa");
const routesUser = require("./routes/routeUser");
const routeCosmetico = require("./routes/routeCosmetico");
const routeCliente = require("./routes/routeCliente");
const cookieParser = require("cookie-parser");

connect();
const app = express();
app.use(cookieParser());
app.use(
  cors({
    //add all domains of netlify
    origin: [
      "http://localhost:3000",
      "https://inquisitive-uniform-foal.cyclic.app",
      "https://leathershopxela.netlify.app/",
      "https://leathershopxela/",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

//add hello world route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json());
app.use(cookieParser());
app.use("/api", routesChumpa);
app.use("/api", routesUser);
app.use("/api", routeCosmetico);
app.use("/api", routeCliente);

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
