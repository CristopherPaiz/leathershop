const express = require("express");
const router = express.Router();
const Cliente = require("../models/clienteModel");
const jwt = require("jsonwebtoken");

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
      estado,
    } = req.body;

    // Crear un nuevo objeto para cada imagen que incluya el nombre y la URL
    const imagenes = imagen?.map((img) => ({
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
      estado,
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

router.post(
  "/cliente/getbyfecha",
  (req, res, next) => {
    const token = req.cookies.token;
    try {
      const ValidPayload = jwt.verify(token, process.env.JWT_SECRET);

      console.log(ValidPayload);
      // Llamar a next solo si el token es válido
      next();
    } catch (error) {
      res.status(401).json({ message: "No autorizado" });
    }
  },
  async (req, res) => {
    try {
      const { fechaRecibo, fechaEntrega } = req.body;

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
      }).sort({ fechaEntrega: 1 }); // Ordenar por fecha de entrega en orden ascendente (el más antiguo primero)

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({
        messageDev:
          "No se pudo obtener los clientes por fecha de entrega y estado",
        messageSys: error.message,
      });
    }
  }
);

// Ruta para obtener clientes cuyas fechas de entrega estén dentro de un rango específico y con estado=true
router.post("/cliente/getbyfechafin", async (req, res) => {
  try {
    const { fechaRecibo, fechaEntrega } = req.body;

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
    }); // Ordenar por fecha de entrega en orden ascendente (el más antiguo primero)

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      messageDev:
        "No se pudo obtener los clientes por fecha de entrega y estado",
      messageSys: error.message,
    });
  }
});

// Ruta para filtrar clientes por nombre, apellido o numeroTel y ordenar alfabéticamente
router.post("/cliente/filtrar", async (req, res) => {
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
