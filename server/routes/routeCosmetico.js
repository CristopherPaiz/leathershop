const express = require("express");
const router = express.Router();
const {
  Cosmetico,
  CompraCosmetico,
  CosmeticoCategoria,
} = require("../models/cosmeticoModel");

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

// Ruta para crear un cosmético
router.post("/cosmeticos/add", async (req, res) => {
  try {
    const {
      producto,
      categoria,
      cantidadTotal,
      apartados,
      especificaciones,
      estado,
    } = req.body;

    // Verificar si la categoría existe antes de crear el cosmético
    const categoriaExistente = await CosmeticoCategoria.findById(categoria);
    if (!categoriaExistente) {
      return res.status(400).json({ error: "La categoría no existe." });
    }

    // Crear un nuevo cosmético
    const cosmetico = new Cosmetico({
      producto,
      categoria,
      cantidadTotal,
      apartados,
      especificaciones,
      estado,
    });

    // Guardar el cosmético en la base de datos
    const resultado = await cosmetico.save();

    res.status(200).json({
      message: "Cosmético añadido correctamente",
      resultado,
    });
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

// Ruta para crear una categoría de cosméticos
router.post("/cosmeticos/categorias", async (req, res) => {
  const { nombre, descripcion } = req.body;

  try {
    // Verificar si la categoría ya existe
    const categoriaExistente = await CosmeticoCategoria.findOne({ nombre });

    if (categoriaExistente) {
      return res.status(400).json({ error: "La categoría ya existe." });
    }

    // Crear la nueva categoría
    const nuevaCategoria = new CosmeticoCategoria({
      nombre,
      descripcion,
    });

    // Guardar la nueva categoría en la base de datos
    const categoriaGuardada = await nuevaCategoria.save();

    console.log("Categoría creada con éxito:", categoriaGuardada);
    res.status(201).json(categoriaGuardada);
  } catch (error) {
    console.error("Error al crear la categoría:", error.message);
    res.status(500).json({ error: "Error al crear la categoría." });
  }
});

// Ruta para obtener todas las categorías de cosméticos
router.get("/cosmeticos/categorias", async (req, res) => {
  try {
    // Obtener todas las categorías de la base de datos
    const categorias = await CosmeticoCategoria.find();

    res.status(200).json(categorias);
  } catch (error) {
    console.error("Error al obtener las categorías:", error.message);
    res.status(500).json({ error: "Error al obtener las categorías." });
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

// ======= obtener todos los CompraCosmeticos de un ID de producto =======
router.get("/CompraCosmetico/getbyproductid/:idProducto", async (req, res) => {
  try {
    const idProducto = req.params.idProducto;
    const data = await CompraCosmetico.find({ idProducto });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      messageDev:
        "No se pudo obtener los detalles de compra de los cosmeticos para el ID de producto: " +
        req.params.idProducto,
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
