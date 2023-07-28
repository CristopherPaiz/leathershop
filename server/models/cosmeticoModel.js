const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cosmeticoSchema = new Schema({
  producto: {
    type: String,
    required: true,
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: "CosmeticoCategoria",
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
  imagen: [String],
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

const cosmeticoCategoriaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
});

const CosmeticoCategoria = mongoose.model(
  "CosmeticoCategoria",
  cosmeticoCategoriaSchema
);

module.exports = {
  Cosmetico,
  CompraCosmetico,
  CosmeticoCategoria,
};
