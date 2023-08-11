const express = require("express");
const router = express.Router();
const Cliente = require("../models/clienteModel");
const authenticateToken = require("../middleware/auth");

// ======= ruta para obtener todos los clientes usando el metodo GET =======
router.get("/cliente/getall", authenticateToken, async (req, res) => {
  try {
    const data = await Cliente.find({});
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener los clientes",
      messageSys: error.message,
    });
  }
});

// ======= obtener un cliente por su id =======
router.get("/cliente/getbyid/:id", authenticateToken, async (req, res) => {
  try {
    const data = await Cliente.findById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener al cliente por el id: " + req.params.id,
      messageSys: error.message,
    });
  }
});

//======= crear un nuevo cliente =======
router.post("/cliente/add", authenticateToken, async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      fechaRecibo,
      fechaEntrega,
      numeroTel,
      producto,
      precio,
      anticipo,
      saldo,
      especificaciones,
      medidas,
      trabajador,
      observaciones,
      recomendaciones,
      imagen,
      descripcion,
      colores,
      tallas,
      estado,
    } = req.body;

    // Obtener un array de strings con las URLs de las imágenes
    const imagenes = await imagen;

    const cliente = new Cliente({
      nombre,
      apellido,
      fechaRecibo,
      fechaEntrega,
      numeroTel,
      producto,
      precio,
      anticipo,
      saldo,
      especificaciones,
      medidas,
      trabajador,
      observaciones,
      recomendaciones,
      imagen: imagenes,
      descripcion,
      colores,
      tallas,
      estado,
    });

    // Guardar el objeto cliente en la base de datos u otras operaciones necesarias
    const resultado = await cliente.save();

    //mandamos estado 200 de OK y el resultado de la operacion
    res.status(200).json({ message: "Cliente añadido correctamente", resultado });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo añadir al cliente",
      messageSys: error.message,
    });
  }
});

// ======= actualizar un cliente por su id =======
router.put("/cliente/update/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const options = { new: true };
    const resultado = await Cliente.findByIdAndUpdate(id, data, options);
    res.status(200).json({ message: "Cliente actualizado correctamente", resultado });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo actualizar al cliente",
      messageSys: error.message,
    });
  }
});

router.post("/cliente/getbyfecha", authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { fechaRecibo, fechaEntrega } = req.body;

    const count = await Cliente.countDocuments();
    const totalPages = Math.ceil(count / limit);

    if (page < 1 || page > totalPages) {
      return res.status(400).json({ message: "Página inválida" });
    }

    const skip = (page - 1) * limit;

    const data = await Cliente.find({
      $and: [
        {
          fechaRecibo: {
            $gte: new Date(fechaRecibo),
            $lte: new Date(fechaEntrega),
          },
        },
        {
          estado: false,
        },
      ],
    })
      .sort({ fechaEntrega: 1 }) // Ordenar por fecha de entrega en orden ascendente (el más antiguo primero)
      .skip(skip)
      .limit(limit);

    res.status(200).json({ data, totalPages });
    // res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener los clientes por fecha de entrega y estado",
      messageSys: error.message,
    });
  }
});

// Ruta para obtener clientes cuyas fechas de entrega estén dentro de un rango específico y con estado=true
router.post("/cliente/getbyfechafin", authenticateToken, async (req, res) => {
  try {
    const { fechaRecibo, fechaEntrega } = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const count = await Cliente.countDocuments();
    const totalPages = Math.ceil(count / limit);

    if (page < 1 || page > totalPages) {
      return res.status(400).json({ message: "Página inválida" });
    }

    const skip = (page - 1) * limit;

    const data = await Cliente.find({
      $and: [
        {
          fechaRecibo: {
            $gte: new Date(fechaRecibo),
            $lte: new Date(fechaEntrega),
          },
        },
        {
          estado: true,
        },
      ],
    })
      .sort({ fechaEntrega: -1 }) // Ordenar por fecha de entrega en orden ascendente (el más reciente primero)
      .skip(skip)
      .limit(limit); // Ordenar por fecha de entrega en orden ascendente (el más antiguo primero)

    // res.status(200).json(data);
    res.status(200).json({ data, totalPages });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener los clientes por fecha de entrega y estado",
      messageSys: error.message,
    });
  }
});

// Ruta para filtrar clientes por nombre, apellido o numeroTel y ordenar alfabéticamente
router.post("/cliente/filtrar", authenticateToken, async (req, res) => {
  try {
    const { nombre, apellido, numeroTel } = req.body;

    // Creamos un objeto de filtro vacío
    const filter = {};

    // Agregamos condiciones al objeto de filtro si los datos están presentes en el body
    if (nombre) {
      filter.nombre = { $regex: new RegExp(nombre, "i") }; // La opción "i" hace que la búsqueda sea insensible a mayúsculas y minúsculas
    }
    if (apellido) {
      filter.apellido = { $regex: new RegExp(apellido, "i") };
    }
    if (numeroTel) {
      filter.numeroTel = { $regex: new RegExp(numeroTel, "i") };
    }

    // Realizamos la búsqueda con el filtro y ordenamos los resultados alfabéticamente por nombre
    const data = await Cliente.find(filter).sort({ nombre: 1 });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo filtrar a los clientes",
      messageSys: error.message,
    });
  }
});

// ======= eliminar un cliente por su id =======
router.delete("/cliente/delete/:id", authenticateToken, async (req, res) => {
  try {
    await Cliente.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo eliminar al cliente",
      messageSys: error.message,
    });
  }
});

module.exports = router;
