const express = require("express");
const router = express.Router();
const { Cosmetico, CompraCosmetico } = require("../models/cosmeticoModel");

// ======= ruta para obtener todos los cosmeticos usando el metodo GET =======
router.get("/cosmeticos/getall", async (req, res) => {
  try {
    const data = await Cosmetico.find({});
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener los cosmeticos",
      messageSys: error.message,
    });
  }
});

// ======= obtener un cosmetico por su id =======
router.get("/cosmeticos/getbyid/:id", async (req, res) => {
  try {
    const data = await Cosmetico.findById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener el cosmetico por el id: " + req.params.id,
      messageSys: error.message,
    });
  }
});

//======= crear un cosmetico =======
router.post("/cosmeticos/add", async (req, res) => {
  try {
    const {
      producto,
      categoria,
      cantidadTotal,
      apartados,
      especificaciones,
      estado,
      imagen,
      cantidadIngreso,
      costoUnitario,
      costoTotal,
      costoDeVenta,
      utilidad,
      cantidadIngresoPorMayor,
      costoUnitarioPorMayor,
      costoTotalPorMayor,
      costoDeVentaPorMayor,
      utilidadPorMayor,
      observaciones,
    } = req.body;

    // Crear un nuevo objeto para cada imagen que incluya el nombre y la URL
    const imagenes = imagen.map((img) => ({
      url: img.url,
    }));

    const cosmetico = new Cosmetico({
      producto,
      categoria,
      cantidadTotal,
      apartados,
      especificaciones,
      estado,
      imagen: imagenes,
    });

    // Guardar el objeto cosmetico en la base de datos u otras operaciones necesarias
    const resultado = await cosmetico.save().then((productoGuardado) => {
      // Creación de una nueva compra de producto
      const compraCosmetico = new CompraCosmetico({
        idProducto: productoGuardado._id, // Establecer la referencia al producto
        cantidadIngreso,
        costoUnitario,
        costoTotal,
        costoDeVenta,
        utilidad,
        cantidadIngresoPorMayor,
        costoUnitarioPorMayor,
        costoTotalPorMayor,
        costoDeVentaPorMayor,
        utilidadPorMayor,
        observaciones,
      });

      return compraCosmetico.save(); // Guardar la compra de producto en la base de datos
    });
    //mandamos estado 200 de OK y el resultado de la operacion
    res
      .status(200)
      .json({ message: "Cosmético añadido correctamente", resultado });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo añadir el cosmético",
      messageSys: error.message,
    });
  }
});

// ======= actualizar un cosmético por su id =======
router.put("/cosmeticos/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const options = { new: true };
    const resultado = await Cosmetico.findByIdAndUpdate(id, data, options);
    res
      .status(200)
      .json({ message: "Cosmético actualizado correctamente", resultado });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo actualizar el cosmético",
      messageSys: error.message,
    });
  }
});

// ======= Deshabilitar un cosmético por su id =======
router.put("/cosmeticos/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const options = { new: true };
    const resultado = await Cosmetico.findByIdAndUpdate(id, data, options);
    res
      .status(200)
      .json({ message: "Cosmético deshabilitado correctamente", resultado });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo deshabilitar el cosmético",
      messageSys: error.message,
    });
  }
});

//############################################################################################################
//############################################################################################################
//############################################################################################################
//############################################################################################################
//############################################################################################################
//############################################################################################################

// ======= ruta para obtener todos los detalles de los cosmeticos usando el metodo GET =======
router.get("/CompraCosmetico/getall", async (req, res) => {
  try {
    const data = await CompraCosmetico.find({}).sort({ _id: -1 }); //ordenar de mayor a menor
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener los detalles de compra de los cosmeticos",
      messageSys: error.message,
    });
  }
});

// ======= obtener un cosmetico por su id =======
router.get("/CompraCosmetico/getbyid/:id", async (req, res) => {
  try {
    const data = await CompraCosmetico.findById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      messageDev:
        "No se pudo obtener los detalles de compra de los cosmeticos por el id: " +
        req.params.id,
      messageSys: error.message,
    });
  }
});

//======= crear un nuevo cliente =======
router.post("/CompraCosmetico/add", async (req, res) => {
  try {
    const {
      idProducto,
      cantidadIngreso,
      costoUnitario,
      costoTotal,
      costoDeVenta,
      utilidad,
      cantidadIngresoPorMayor,
      costoUnitarioPorMayor,
      costoTotalPorMayor,
      costoDeVentaPorMayor,
      utilidadPorMayor,
      observaciones,
    } = req.body;

    const compraCosmetico = new CompraCosmetico({
      idProducto,
      cantidadIngreso,
      costoUnitario,
      costoTotal,
      costoDeVenta,
      utilidad,
      cantidadIngresoPorMayor,
      costoUnitarioPorMayor,
      costoTotalPorMayor,
      costoDeVentaPorMayor,
      utilidadPorMayor,
      observaciones,
    });

    // Guardar el objeto cliente en la base de datos u otras operaciones necesarias
    const resultado = await compraCosmetico.save();

    //mandamos estado 200 de OK y el resultado de la operacion
    res
      .status(200)
      .json({ message: "Detalle cosmético añadido correctamente", resultado });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo añadir el detalle cosmético",
      messageSys: error.message,
    });
  }
});

// ======= actualizar un cosmético por su id =======
router.put("/CompraCosmetico/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const options = { new: true };
    const resultado = await CompraCosmetico.findByIdAndUpdate(
      id,
      data,
      options
    );
    res
      .status(200)
      .json({ message: "Cosmético actualizado correctamente", resultado });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo actualizar el cosmético",
      messageSys: error.message,
    });
  }
});

// ======= Deshabilitar un cosmético por su id =======
router.put("/CompraCosmetico/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const options = { new: true };
    const resultado = await CompraCosmetico.findByIdAndUpdate(
      id,
      data,
      options
    );
    res
      .status(200)
      .json({ message: "Cosmético deshabilitado correctamente", resultado });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo deshabilitar el cosmético",
      messageSys: error.message,
    });
  }
});

module.exports = router;
