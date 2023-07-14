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
  imagen: [
    {
      nombre: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  descripcion: {
    type: String,
  },
  colores: [String],
  tallas: [String],
  especificaciones: {
    type: String,
  },
});

//a

module.exports = mongoose.model("Chumpa", chumpaSchema);
