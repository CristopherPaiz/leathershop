require("dotenv").config();
const mongoose = require("mongoose");
const db_url = process.env.DB_URL;

const connect = function () {
  mongoose
    .connect(db_url)
    .then(() => {
      console.log("Base de datos conectada");
    })
    .catch((err) => {
      console.log("Error al conectar: " + err);
    });
};

module.exports = connect;
