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

    res.status(201).json(categoriaGuardada);
  } catch (error) {
    console.error("Error al crear la categoría:", error.message);
    res.status(500).json({ error: "Error al crear la categoría." });
  }
});

router.get("/cosmeticos/nombres", async (req, res) => {
  try {
    const data = await Cosmetico.find(
      {},
      { producto: 1, imagen: { $slice: 1 } }
    ).sort({
      producto: 1,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener los cosméticos",
      messageSys: error.message,
    });
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

const formatDate = (date) => {
  const dateObject = new Date(date);
  const day = String(dateObject.getDate()).padStart(2, "0");
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const year = dateObject.getFullYear();
  return `${day}/${month}/${year}`;
};

router.get("/CompraCosmetico/getall", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const count = await CompraCosmetico.countDocuments();
    const totalPages = Math.ceil(count / limit);

    if (page < 1 || page > totalPages) {
      return res.status(400).json({ message: "Página inválida" });
    }

    const skip = (page - 1) * limit;

    const data = await CompraCosmetico.find({})
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    // Obtener los nombres de productos asociados a los IDs
    const productoIds = data.map((item) => item.idProducto);
    const productos = await obtenerNombresProductos(productoIds);

    // Función para obtener los campos específicos según las condiciones
    const getCamposSegunCondicion = (item) => {
      if (item.utilidad === 0) {
        return {
          Tipo: "Mayoreo",
          idProductoR: item.idProducto,
          cantidadIngresoR: item.cantidadIngresoPorMayor,
          costoUnitarioR: item.costoUnitarioPorMayor,
          costoTotalR: item.costoTotalPorMayor,
          costoDeVentaR: item.costoDeVentaPorMayor,
          utilidadR: item.utilidadPorMayor,
          observacionesR: item.observaciones,
        };
      } else if (item.utilidadPorMayor === 0) {
        return {
          Tipo: "Por Unidad",
          idProductoR: item.idProducto,
          cantidadIngresoR: item.cantidadIngreso,
          costoUnitarioR: item.costoUnitario,
          costoTotalR: item.costoTotal,
          costoDeVentaR: item.costoDeVenta,
          utilidadR: item.utilidad,
          observacionesR: item.observaciones,
        };
      }
    };

    // Combinar los datos de compras con los nombres de productos y aplicar la función de filtrado
    const dataWithProductos = data.map((item) => {
      const nombreProducto = productos.find((prod) =>
        prod._id.equals(item.idProducto)
      )?.producto;
      const createdAtFormatted = formatDate(item.createdAt);
      return {
        ...getCamposSegunCondicion(item),
        nombreProducto,
        createdAtFormatted,
      };
    });

    res.status(200).json({ data: dataWithProductos, totalPages });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener los detalles de compra de los cosmeticos",
      messageSys: error.message,
    });
  }
});

router.get("/CompraCosmetico/getunidad", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const count = await CompraCosmetico.countDocuments();
    const totalPages = Math.ceil(count / limit);

    if (page < 1 || page > totalPages) {
      return res.status(400).json({ message: "Página inválida" });
    }

    const skip = (page - 1) * limit;

    // Filtrar los datos que corresponden a compras "Por Unidad"
    const data = await CompraCosmetico.find({ utilidadPorMayor: 0 })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    // Obtener los nombres de productos asociados a los IDs
    const productoIds = data.map((item) => item.idProducto);
    const productos = await obtenerNombresProductos(productoIds);

    // Función para obtener los campos específicos
    const getCamposPorUnidad = (item) => {
      return {
        Tipo: "Por Unidad",
        idProductoR: item.idProducto,
        cantidadIngresoR: item.cantidadIngreso,
        costoUnitarioR: item.costoUnitario,
        costoTotalR: item.costoTotal,
        costoDeVentaR: item.costoDeVenta,
        utilidadR: item.utilidad,
        observacionesR: item.observaciones,
      };
    };

    // Combinar los datos de compras con los nombres de productos y aplicar la función de filtrado
    const dataWithProductos = data.map((item) => {
      const nombreProducto = productos.find((prod) =>
        prod._id.equals(item.idProducto)
      )?.producto;
      const createdAtFormatted = formatDate(item.createdAt);
      return {
        ...getCamposPorUnidad(item),
        nombreProducto,
        createdAtFormatted,
      };
    });

    res.status(200).json({ data: dataWithProductos, totalPages });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener los detalles de compra de los cosmeticos",
      messageSys: error.message,
    });
  }
});

router.get("/CompraCosmetico/getmayoreo", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const count = await CompraCosmetico.countDocuments();
    const totalPages = Math.ceil(count / limit);

    if (page < 1 || page > totalPages) {
      return res.status(400).json({ message: "Página inválida" });
    }

    const skip = (page - 1) * limit;

    // Filtrar los datos que corresponden a compras "Mayoreo"
    const data = await CompraCosmetico.find({ utilidad: 0 })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    // Obtener los nombres de productos asociados a los IDs
    const productoIds = data.map((item) => item.idProducto);
    const productos = await obtenerNombresProductos(productoIds);

    // Función para obtener los campos específicos
    const getCamposMayoreo = (item) => {
      return {
        Tipo: "Mayoreo",
        idProductoR: item.idProducto,
        cantidadIngresoR: item.cantidadIngresoPorMayor,
        costoUnitarioR: item.costoUnitarioPorMayor,
        costoTotalR: item.costoTotalPorMayor,
        costoDeVentaR: item.costoDeVentaPorMayor,
        utilidadR: item.utilidadPorMayor,
        observacionesR: item.observaciones,
      };
    };

    // Combinar los datos de compras con los nombres de productos y aplicar la función de filtrado
    const dataWithProductos = data.map((item) => {
      const nombreProducto = productos.find((prod) =>
        prod._id.equals(item.idProducto)
      )?.producto;
      const createdAtFormatted = formatDate(item.createdAt);
      return {
        ...getCamposMayoreo(item),
        nombreProducto,
        createdAtFormatted,
      };
    });

    res.status(200).json({ data: dataWithProductos, totalPages });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener los detalles de compra de los cosmeticos",
      messageSys: error.message,
    });
  }
});

// Función para obtener los nombres de productos a partir de sus IDs
async function obtenerNombresProductos(ids) {
  try {
    const productos = await Cosmetico.find(
      { _id: { $in: ids } },
      { producto: 1 }
    );
    return productos;
  } catch (error) {
    return [];
  }
}

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

// Crear un nuevo detalle de compra de cosmético
router.post("/CompraCosmetico/add", async (req, res) => {
  try {
    const {
      idProducto,
      cantidadIngreso,
      cantidadIngresoPorMayor,
      costoUnitario,
      costoTotal,
      costoDeVenta,
      utilidad,
      costoUnitarioPorMayor,
      costoTotalPorMayor,
      costoDeVentaPorMayor,
      utilidadPorMayor,
      observaciones,
    } = req.body;

    const compraCosmetico = new CompraCosmetico({
      idProducto,
      cantidadIngreso,
      cantidadIngresoPorMayor,
      costoUnitario,
      costoTotal,
      costoDeVenta,
      utilidad,
      costoUnitarioPorMayor,
      costoTotalPorMayor,
      costoDeVentaPorMayor,
      utilidadPorMayor,
      observaciones,
    });

    // Guardar el detalle de compra en la base de datos
    const resultado = await compraCosmetico.save();

    // Actualizar cantidadTotal en la colección "Cosmetico"
    const cosmeticoToUpdate = await Cosmetico.findById(idProducto);
    cosmeticoToUpdate.cantidadTotal +=
      cantidadIngreso + cantidadIngresoPorMayor;
    await cosmeticoToUpdate.save();

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

///////////////////////////////////////////////////////////////////////////////////////////////////

//obtener todos los cosmeticos por disponibilidad
router.get("/cosmeticos/getalldisponibility", async (req, res) => {
  try {
    const categoria = req.query.categoria; // Obtener el parámetro de la URL

    let query = { estado: true }; // Agregar filtro por estado: true
    if (categoria) {
      query.categoria = categoria; // Si se proporciona una categoría, usarla para filtrar
    }

    const data = await Cosmetico.find(query);

    // Crear un nuevo array con los datos deseados (nombre del producto y Disponible)
    const result = data.map((item) => {
      return {
        producto: item.producto,
        Disponible: item.cantidadTotal - item.apartados - item.vendidos,
      };
    });

    // Ordenar por el campo "Disponible" de menor a mayor
    result.sort((a, b) => a.Disponible - b.Disponible);

    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener los cosméticos",
      messageSys: error.message,
    });
  }
});

//obtener todos los cosmeticos por apartados
router.get("/cosmeticos/getallapartados", async (req, res) => {
  try {
    const categoria = req.query.categoria; // Obtener el parámetro de la URL

    let query = { estado: true }; // Agregar filtro por estado: true
    if (categoria) {
      query.categoria = categoria; // Si se proporciona una categoría, usarla para filtrar
    }

    const data = await Cosmetico.find(query);

    // Crear un nuevo array con los datos deseados (nombre del producto y Disponible)
    const result = data.map((item) => {
      return {
        producto: item.producto,
        apartados: item.apartados,
      };
    });

    // Ordenar por el campo "Apartados" de menor a mayor
    result.sort((a, b) => b.apartados - a.apartados);

    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener los cosméticos",
      messageSys: error.message,
    });
  }
});

// Nueva ruta para obtener la suma total de utilidad por producto (solo para compras de unidad)
router.get("/cosmeticos/utilidad-por-unidad", async (req, res) => {
  try {
    const data = await CompraCosmetico.aggregate([
      {
        $match: { utilidadPorMayor: 0 }, // Filtrar solo las compras de unidad (utilidadPorMayor igual a 0)
      },
      {
        $group: {
          _id: "$idProducto",
          utilidadTotal: { $sum: "$utilidad" },
        },
      },
      {
        $lookup: {
          from: "cosmeticos",
          localField: "_id",
          foreignField: "_id",
          as: "producto",
        },
      },
      {
        $unwind: "$producto",
      },
      {
        $project: {
          _id: 0,
          producto: "$producto.producto",
          utilidadTotal: 1,
        },
      },
      {
        $sort: {
          utilidadTotal: -1,
        },
      },
    ]);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener la suma total de utilidad por producto",
      messageSys: error.message,
    });
  }
});

// Nueva ruta para obtener la suma total de utilidad por producto (solo para compras por mayor)
router.get("/cosmeticos/utilidad-por-mayor", async (req, res) => {
  try {
    const data = await CompraCosmetico.aggregate([
      {
        $match: { utilidadPorMayor: { $ne: 0 } }, // Filtrar solo las compras por mayor (utilidadPorMayor distinta de 0)
      },
      {
        $group: {
          _id: "$idProducto",
          utilidadTotal: { $sum: "$utilidadPorMayor" },
        },
      },
      {
        $lookup: {
          from: "cosmeticos",
          localField: "_id",
          foreignField: "_id",
          as: "producto",
        },
      },
      {
        $unwind: "$producto",
      },
      {
        $project: {
          _id: 0,
          producto: "$producto.producto",
          utilidadTotal: 1,
        },
      },
      {
        $sort: {
          utilidadTotal: -1,
        },
      },
    ]);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener la suma total de utilidad por producto",
      messageSys: error.message,
    });
  }
});

// Ruta para obtener la suma total de cantidad comprada y monto total de dinero por producto (ordenado de mayor a menor)
router.get("/cosmeticos/cantidad-y-monto-comprado", async (req, res) => {
  try {
    const data = await CompraCosmetico.aggregate([
      {
        $group: {
          _id: "$idProducto",
          cantidadComprado: { $sum: "$cantidadIngreso" },
          montoTotalDinero: {
            $sum: { $add: ["$costoTotal", "$costoTotalPorMayor"] },
          },
        },
      },
      {
        $lookup: {
          from: "cosmeticos",
          localField: "_id",
          foreignField: "_id",
          as: "producto",
        },
      },
      {
        $unwind: "$producto",
      },
      {
        $project: {
          _id: 0,
          producto: "$producto.producto",
          cantidadComprado: 1,
          montoTotalDinero: 1,
        },
      },
      {
        $sort: {
          montoTotalDinero: -1,
        },
      },
    ]);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      messageDev:
        "No se pudo obtener la suma total de cantidad y monto comprado por producto",
      messageSys: error.message,
    });
  }
});

// Ruta para obtener la suma total de cantidad comprada y monto total de venta por producto (ordenado de mayor a menor)
router.get("/cosmeticos/cantidad-y-monto-venta", async (req, res) => {
  try {
    const data = await CompraCosmetico.aggregate([
      {
        $group: {
          _id: "$idProducto",
          cantidadComprado: { $sum: "$cantidadIngreso" },
          montoTotalVenta: {
            $sum: {
              $add: [
                { $multiply: ["$cantidadIngreso", "$costoDeVenta"] },
                {
                  $multiply: [
                    "$cantidadIngresoPorMayor",
                    "$costoDeVentaPorMayor",
                  ],
                },
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "cosmeticos",
          localField: "_id",
          foreignField: "_id",
          as: "producto",
        },
      },
      {
        $unwind: "$producto",
      },
      {
        $project: {
          _id: 0,
          producto: "$producto.producto",
          cantidadComprado: 1,
          montoTotalVenta: 1,
        },
      },
      {
        $sort: {
          cantidadComprado: -1,
        },
      },
    ]);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      messageDev:
        "No se pudo obtener la suma total de cantidad y monto de venta por producto",
      messageSys: error.message,
    });
  }
});

// Ruta para obtener la cantidad comprada, monto total de dinero y utilidad generada por producto (ordenado de mayor a menor por utilidad)
router.get("/cosmeticos/cantidad-monto-utilidad", async (req, res) => {
  try {
    const data = await CompraCosmetico.aggregate([
      {
        $group: {
          _id: "$idProducto",
          cantidadComprado: { $sum: "$cantidadIngreso" },
          montoTotalDinero: {
            $sum: { $add: ["$costoTotal", "$costoTotalPorMayor"] },
          },
          montoTotalVenta: {
            $sum: {
              $add: [
                { $multiply: ["$cantidadIngreso", "$costoDeVenta"] },
                {
                  $multiply: [
                    "$cantidadIngresoPorMayor",
                    "$costoDeVentaPorMayor",
                  ],
                },
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "cosmeticos",
          localField: "_id",
          foreignField: "_id",
          as: "producto",
        },
      },
      {
        $unwind: "$producto",
      },
      {
        $project: {
          _id: 0,
          producto: "$producto.producto",
          cantidadComprado: 1,
          montoTotalDinero: 1,
          montoTotalVenta: 1,
          utilidad: {
            $subtract: ["$montoTotalVenta", "$montoTotalDinero"],
          },
        },
      },
      {
        $sort: {
          utilidad: -1,
        },
      },
    ]);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      messageDev:
        "No se pudo obtener la cantidad, monto y utilidad por producto",
      messageSys: error.message,
    });
  }
});
