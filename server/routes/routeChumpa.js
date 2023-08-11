const express = require("express");
const router = express.Router();
const Chumpa = require("../models/chumpaModel");

// ======= ruta para obtener todos las entradas de las chumpas usando el metodo GET =======
router.get("/chumpas/getall", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const count = await Chumpa.countDocuments();
    const totalPages = Math.ceil(count / limit);

    if (page < -1 || page > totalPages) {
      return res.status(400).json({ message: "Página inválida" });
    }

    const skip = (page - 1) * limit;

    const data = await Chumpa.find({ estado: true })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ data: data, totalPages });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener las chumpas",
      messageSys: error.message,
    });
  }
});

// ======= obtener una chumpa por su id =======
router.get("/chumpas/getbyid/:id", async (req, res) => {
  try {
    const data = await Chumpa.findById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener la chumpa por el id: " + req.params.id,
      messageSys: error.message,
    });
  }
});

//======= crear una nueva chumpa =======
router.post("/chumpas/add", async (req, res) => {
  try {
    const {
      nombre,
      precio,
      precioAnterior,
      imagen,
      descripcion,
      colores,
      tallas,
      especificaciones,
    } = req.body;

    const imagenes = await imagen;

    const chumpa = new Chumpa({
      nombre,
      precio,
      precioAnterior,
      imagen: imagenes,
      descripcion,
      colores,
      tallas,
      especificaciones,
    });

    // Guardar el objeto chumpa en la base de datos u otras operaciones necesarias
    const resultado = await chumpa.save();

    //mandamos estado 200 de OK y el resultado de la operacion
    res
      .status(200)
      .json({ message: "Chumpa añadida correctamente", resultado });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo añadir chumpa",
      messageSys: error.message,
    });
  }
});

// ======= actualizar una chumpa por su id =======
router.put("/chumpas/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const options = { new: true };
    const resultado = await Chumpa.findByIdAndUpdate(id, data, options);
    res
      .status(200)
      .json({ message: "Chumpa actualizada correctamente", resultado });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo actualizar la chumpa",
      messageSys: error.message,
    });
  }
});

// ======= eliminar una chumpa por su id =======
router.delete("/chumpas/delete/:id", async (req, res) => {
  try {
    await Chumpa.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Chumpa eliminada correctamente" });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo eliminar la chumpa",
      messageSys: error.message,
    });
  }
});

//Exportar el router para poder usarlo en el index.js
module.exports = router;
