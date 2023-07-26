const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clienteSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
  },
  fechaRecibo: {
    type: Date,
    required: true,
  },
  fechaEntrega: {
    type: Date,
  },
  numeroTel: {
    type: String,
  },
  producto: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  anticipo: {
    type: Number,
  },
  saldo: {
    type: Number,
  },
  especificaciones: {
    type: String,
  },
  medidas: {
    type: String,
  },
  trabajador: {
    type: String,
  },
  observaciones: {
    type: String,
  },
  recomendaciones: {
    type: String,
  },
  imagen: [
    {
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
  estado: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Cliente", clienteSchema);
