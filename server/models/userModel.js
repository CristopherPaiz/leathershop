const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: [true, "El nombre de usuario ya existe"],
  },
  imagen: {
    type: String,
  },
  rol: {
    type: String,
    required: true,
  },
});

//exacto
module.exports = mongoose.model("User", userSchema);
