const express = require("express");
const router = express.Router();
const {
  Cosmetico,
  CompraCosmetico,
  CosmeticoCategoria,
} = require("../models/cosmeticoModel");

// Ruta para obtener todas las categorías de cosméticos
router.get("/cosmeticos/categorias", async (req, res) => {
  try {
    // Obtener todas las categorías de la base de datos
    const categorias = await CosmeticoCategoria.find().sort({ nombre: 1 });
    res.status(200).json(categorias);
  } catch (error) {
    console.error("Error al obtener las categorías:", error.message);
    res.status(500).json({ error: "Error al obtener las categorías." });
  }
});

router.get("/cosmeticos/getall", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const productsPerPage = parseInt(req.query.limit) || 1;
    const categoria = req.query.categoria; // Obtener el parámetro de la URL

    let query = { estado: true }; // Agregar filtro por estado: true
    if (categoria) {
      query.categoria = categoria; // Si se proporciona una categoría, usarla para filtrar
    }

    const totalProducts = await Cosmetico.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    const data = await Cosmetico.find(query)
      .sort({ producto: 1 })
      .skip((page - 1) * productsPerPage)
      .limit(productsPerPage);

    res.status(200).json({ data, totalPages });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener los cosméticos",
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
  console.log(req.body);
  try {
    const {
      producto,
      categoria,
      cantidadTotal,
      apartados,
      especificaciones,
      imagen,
      inactivos,
      estado,
    } = req.body;

    // Obtener un array de strings con las URLs de las imágenes
    const imagenes = await imagen;
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
      imagen: imagenes,
      inactivos,
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

// Ruta para filtrar por el campo de nombre o por el campo de descripción o por los dos campos, y por estado: true
router.post("/cosmeticos/filtrar", async (req, res) => {
  try {
    const { nombre, especificaciones } = req.body;

    // Creamos un objeto de filtro con la condición de estado: true
    const filter = { estado: true };

    // Agregamos condiciones al objeto de filtro si los datos están presentes en el cuerpo de la solicitud
    if (nombre) {
      filter.producto = { $regex: new RegExp(nombre, "i") }; // La opción "i" hace que la búsqueda sea insensible a mayúsculas y minúsculas
    }
    if (especificaciones) {
      filter.especificaciones = { $regex: new RegExp(especificaciones, "i") };
    }

    // Realizamos la búsqueda con el filtro
    const data = await Cosmetico.find(filter);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener los productos filtrados",
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
