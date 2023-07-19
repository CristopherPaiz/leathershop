const express = require("express");
const router = express.Router();
const Cliente = require("../models/clienteModel");

// ======= ruta para obtener todos los clientes usando el metodo GET =======
router.get("/cliente/getall", async (req, res) => {
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
router.get("/cliente/getbyid/:id", async (req, res) => {
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
router.post("/cliente/add", async (req, res) => {
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
    } = req.body;

    // Crear un nuevo objeto para cada imagen que incluya el nombre y la URL
    const imagenes = imagen.map((img) => ({
      url: img.url,
    }));

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
    });

    // Guardar el objeto cliente en la base de datos u otras operaciones necesarias
    const resultado = await cliente.save();

    //mandamos estado 200 de OK y el resultado de la operacion
    res
      .status(200)
      .json({ message: "Cliente añadido correctamente", resultado });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo añadir al cliente",
      messageSys: error.message,
    });
  }
});

// ======= actualizar un cliente por su id =======
router.put("/cliente/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const options = { new: true };
    const resultado = await Cliente.findByIdAndUpdate(id, data, options);
    res
      .status(200)
      .json({ message: "Cliente actualizado correctamente", resultado });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo actualizar al cliente",
      messageSys: error.message,
    });
  }
});

// ======= eliminar un cliente por su id =======
router.delete("/cliente/delete/:id", async (req, res) => {
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
