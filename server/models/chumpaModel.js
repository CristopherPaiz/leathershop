const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chumpaSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
  },
  precioAnterior: {
    type: Number,
  },
  imagen: [String],
  descripcion: {
    type: String,
  },
  colores: [String],
  tallas: [String],
  especificaciones: {
    type: String,
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

//a

module.exports = mongoose.model("Chumpa", chumpaSchema);
