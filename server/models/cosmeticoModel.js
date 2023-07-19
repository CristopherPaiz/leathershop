const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cosmeticoSchema = new Schema({
  producto: {
    type: String,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
  cantidadTotal: {
    type: Number,
    required: true,
  },
  apartados: {
    type: Number,
  },
  especificaciones: {
    type: String,
  },
  estado: {
    type: Boolean,
  },
  imagen: [
    {
      url: {
        type: String,
        required: true,
      },
    },
  ],
});

const Cosmetico = mongoose.model("Cosmetico", cosmeticoSchema);

const cosmeticoDetalleSchema = new Schema({
  idProducto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cosmetico",
  },
  cantidadIngreso: {
    type: Number,
  },
  costoUnitario: {
    type: Number,
  },
  costoTotal: {
    type: Number,
  },
  costoDeVenta: {
    type: Number,
  },
  utilidad: {
    type: Number,
  },
  cantidadIngresoPorMayor: {
    type: Number,
  },
  costoUnitarioPorMayor: {
    type: Number,
  },
  costoTotalPorMayor: {
    type: Number,
  },
  costoDeVentaPorMayor: {
    type: Number,
  },
  utilidadPorMayor: {
    type: Number,
  },
  observaciones: {
    type: String,
  },
});

const CompraCosmetico = mongoose.model(
  "CompraCosmetico",
  cosmeticoDetalleSchema
);

module.exports = {
  Cosmetico,
  CompraCosmetico,
};
 