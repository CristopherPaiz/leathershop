import React, { useEffect, useState, useContext } from "react";
import {
  Header,
  Icon,
  Form,
  Button,
  Grid,
  Dropdown,
  Radio,
} from "semantic-ui-react";
import { Navigate, useNavigate } from "react-router-dom";
import API_URL from "../config.js";
import toast, { Toaster } from "react-hot-toast";
import { contexto } from "../context/ContextProvider";
import "./AddProductoCompraCSS.css";

const AddProductoCompra = () => {
  const { loggedIn, usuario } = useContext(contexto);
  const [productos, setProductos] = useState([]);
  const [selectedProductoId, setSelectedProductoId] = useState(null);
  const [value, setValue] = useState("menor");

  // useStates para todos los campos del formulario
  const [cantidadIngreso, setCantidadIngreso] = useState();
  const [costoUnitario, setCostoUnitario] = useState();
  const [costoTotal, setCostoTotal] = useState();
  const [precioVenta, setPrecioVenta] = useState();
  const [utilidadGenerada, setUtilidadGenerada] = useState();

  // useStates para todos los campos del formulario por mayoreo
  const [cantidadIngresoM, setCantidadIngresoM] = useState();
  const [costoUnitarioM, setCostoUnitarioM] = useState();
  const [costoTotalM, setCostoTotalM] = useState();
  const [precioVentaM, setPrecioVentaM] = useState();
  const [utilidadGeneradaM, setUtilidadGeneradaM] = useState();

  //useState para observaciones
  const [observaciones, setObservaciones] = useState("");

  const navigate = useNavigate();

  //##################### USEEFFECTS DE PRECIO UNIDAD ##################################
  //####################################################################################
  //useEffect de costo total
  useEffect(() => {
    setCostoUnitario(Number(costoTotal / cantidadIngreso));
  }, [costoTotal]);

  //useEffect de costo unitario
  useEffect(() => {
    setCostoTotal(Number(costoUnitario * cantidadIngreso));
  }, [costoUnitario]);

  //useEffect para controlar ventas y setear un valor a utilidad generada
  useEffect(() => {
    if (cantidadIngreso > 0 && (costoUnitario > 0 || costoTotal > 0)) {
      setUtilidadGenerada(Number(precioVenta * cantidadIngreso - costoTotal));
    } else {
      setUtilidadGenerada(0);
    }
  }, [precioVenta, costoTotal, costoUnitario, cantidadIngreso]);

  //##################### USEEFFECTS DE PRECIO MAYOREO #################################
  //####################################################################################
  //useEffect de costo total
  useEffect(() => {
    setCostoUnitarioM(Number(costoTotalM / cantidadIngresoM));
  }, [costoTotalM]);

  //useEffect de costo unitario
  useEffect(() => {
    setCostoTotalM(Number(costoUnitarioM * cantidadIngresoM));
  }, [costoUnitarioM]);

  //useEffect para controlar ventas y setear un valor a utilidad generada
  useEffect(() => {
    if (cantidadIngresoM > 0 && (costoUnitarioM > 0 || costoTotalM > 0)) {
      setUtilidadGeneradaM(
        Number(precioVentaM * cantidadIngresoM - costoTotalM)
      );
    } else {
      setUtilidadGeneradaM(0);
    }
  }, [precioVentaM, costoTotalM, costoUnitarioM, cantidadIngresoM]);

  // ###################################################################################3

  const handleChangeState = (event, data) => {
    setValue(data.value);
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const response = await fetch(`${API_URL}/cosmeticos/nombres`);
      if (!response.ok) {
        throw new Error("Error al obtener los nombres de productos");
      }
      const data = await response.json();
      // Formatear los datos para el Dropdown
      const options = data?.map((categoria) => ({
        key: categoria._id,
        image: {
          avatar: true,
          transition: "fade in",
          duration: 1000,
          src:
            categoria?.imagen[0] ??
            "https://cdn-icons-png.flaticon.com/512/7734/7734301.png",
        },
        text: categoria.producto,
        value: categoria._id, // Usamos el _id como valor del Dropdown para filtrar por categoría
      }));
      setProductos(options);
    } catch (error) {
      console.error("Error al obtener los nombres de productos:", error);
    }
  };

  const handleProductoSelect = (event, data) => {
    setSelectedProductoId(data.value);
  };

  const handleFormSubmit = async () => {
    try {
      if (value === "menor") {
        const cantidadIngresoNumber = Number(cantidadIngreso);
        const costoUnitarioNumber = Number(costoUnitario);
        const costoTotalNumber = Number(costoTotal);
        const precioVentaNumber = Number(precioVenta);
        const utilidadGeneradaNumber = Number(utilidadGenerada);

        if (
          !selectedProductoId ||
          isNaN(cantidadIngresoNumber) ||
          isNaN(costoUnitarioNumber) ||
          isNaN(costoTotalNumber) ||
          isNaN(precioVentaNumber) ||
          isNaN(utilidadGeneradaNumber) ||
          cantidadIngresoNumber <= 0 ||
          costoUnitarioNumber <= 0 ||
          costoTotalNumber <= 0 ||
          precioVentaNumber <= 0 ||
          utilidadGeneradaNumber <= 0
        ) {
          toast.error("Por favor, complete todos los campos de unidad.");
          return;
        }

        const formattedData = {
          idProducto: selectedProductoId,
          cantidadIngreso: cantidadIngresoNumber,
          costoUnitario: costoUnitarioNumber,
          costoTotal: costoTotalNumber,
          costoDeVenta: precioVentaNumber,
          utilidad: utilidadGeneradaNumber,
          cantidadIngresoPorMayor: 0,
          costoUnitarioPorMayor: 0,
          costoTotalPorMayor: 0,
          costoDeVentaPorMayor: 0,
          utilidadPorMayor: 0,
          observaciones: observaciones,
        };

        const response = await fetch(`${API_URL}/CompraCosmetico/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
          credentials: "include",
        });

        if (response.ok) {
          toast.success("Compra del producto añadido correctamente");
          await new Promise((resolve) => setTimeout(resolve, 2000));
          navigate("/user");
        } else {
          toast.error("Error al añadir Compra del producto cero");
        }
      } else if (value === "mayor") {
        const cantidadIngresoMNumber = Number(cantidadIngresoM);
        const costoUnitarioMNumber = Number(costoUnitarioM);
        const costoTotalMNumber = Number(costoTotalM);
        const precioVentaMNumber = Number(precioVentaM);
        const utilidadGeneradaMNumber = Number(utilidadGeneradaM);

        if (
          !selectedProductoId ||
          isNaN(cantidadIngresoMNumber) ||
          isNaN(costoUnitarioMNumber) ||
          isNaN(costoTotalMNumber) ||
          isNaN(precioVentaMNumber) ||
          isNaN(utilidadGeneradaMNumber) ||
          cantidadIngresoMNumber <= 0 ||
          costoUnitarioMNumber <= 0 ||
          costoTotalMNumber <= 0 ||
          precioVentaMNumber <= 0 ||
          utilidadGeneradaMNumber <= 0
        ) {
          toast.error("Por favor, complete todos los campos de mayoreo.");
          return;
        }

        const formattedData = {
          idProducto: selectedProductoId,
          cantidadIngreso: 0,
          costoUnitario: 0,
          costoTotal: 0,
          costoDeVenta: 0,
          utilidad: 0,
          cantidadIngresoPorMayor: cantidadIngresoMNumber,
          costoUnitarioPorMayor: costoUnitarioMNumber,
          costoTotalPorMayor: costoTotalMNumber,
          costoDeVentaPorMayor: precioVentaMNumber,
          utilidadPorMayor: utilidadGeneradaMNumber,
          observaciones: observaciones,
        };

        const response = await fetch(`${API_URL}/CompraCosmetico/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
          credentials: "include",
        });

        if (response.ok) {
          toast.success("Compra del producto añadido correctamente");
          await new Promise((resolve) => setTimeout(resolve, 2000));
          navigate("/user");
        } else {
          toast.error("Error al añadir Compra del producto aqui primer");
        }
      } else {
        toast.error("Error al añadir Compra del producto aqui segundo");
      }
    } catch (error) {
      toast.error("Error al añadir Compra del producto aqui catch" + error);
    }
  };

  if (loggedIn && usuario.rol === "Admin") {
    return (
      <>
        <Toaster />
        <Header as="h2" icon textAlign="center">
          <Icon name="add" />
          <Header.Content>Añadir Compra de producto</Header.Content>
        </Header>
        <Grid centered style={{ margin: "20px" }}>
          <Grid.Column mobile={15} tablet={8} computer={6}>
            <Form>
              <Form.Field>
                <label>Primero seleccione un producto:</label>
                <Dropdown
                  placeholder="Seleccionar producto"
                  search
                  selection
                  options={productos}
                  onChange={handleProductoSelect}
                />
              </Form.Field>
            </Form>
          </Grid.Column>
          {selectedProductoId && (
            <>
              <Form>
                <Form.Field>
                  <Radio
                    label="Por Unidad"
                    name="radioGroup"
                    value="menor"
                    checked={value === "menor"}
                    onChange={handleChangeState}
                  />
                  <span style={{ color: "transparent" }}>espacio</span>
                  <Radio
                    label="Por Mayoreo"
                    name="radioGroup"
                    value="mayor"
                    checked={value === "mayor"}
                    onChange={handleChangeState}
                  />
                </Form.Field>
              </Form>

              <Header as="h4" style={{ margin: "30px 0px 20px 0px" }}>
                <Header.Content>
                  ID del producto
                  <Header.Subheader>{selectedProductoId}</Header.Subheader>
                </Header.Content>
              </Header>
              <Form unstackable style={{ maxWidth: "1200px", width: "1000px" }}>
                <label
                  style={{
                    fontWeight: "1000",
                    fontSize: "20px",
                    margin: "5px",
                    color: value === "menor" ? "black" : "#eee",
                  }}
                >
                  POR UNIDAD
                </label>
                <Form.Group>
                  <Form.Input
                    label="Cantidad Ingreso"
                    placeholder="Cantidad Ingreso"
                    type="number"
                    required={value === "menor"}
                    defaultValue="0"
                    value={cantidadIngreso === 0 ? "" : cantidadIngreso}
                    width={8}
                    disabled={value === "mayor"}
                    onChange={(e) => {
                      setCantidadIngreso(Number(e.target.value));
                    }}
                  />
                  <Form.Input
                    label="Costo Unitario"
                    placeholder="Costo Unitario"
                    type="number"
                    required={value === "menor"}
                    defaultValue="0"
                    value={
                      costoUnitario === 0
                        ? ""
                        : parseFloat(costoUnitario) % 1 === 0
                        ? costoUnitario
                        : parseFloat(costoUnitario)
                            .toFixed(2)
                            .replace(/\.?0+$/, "")
                    }
                    style={{ marginBottom: "10px" }}
                    width={8}
                    disabled={value === "mayor"}
                    onChange={(e) => {
                      setCostoUnitario(Number(e.target.value));
                    }}
                  />
                  <Form.Input
                    label="Costo Total"
                    placeholder="Costo Total"
                    type="number"
                    required={value === "menor"}
                    defaultValue="0"
                    value={
                      costoTotal === 0
                        ? ""
                        : parseFloat(costoTotal) % 1 === 0
                        ? costoTotal
                        : parseFloat(costoTotal)
                            .toFixed(2)
                            .replace(/\.?0+$/, "")
                    }
                    width={8}
                    disabled={value === "mayor"}
                    onChange={(e) => {
                      setCostoTotal(Number(e.target.value));
                    }}
                  />
                  <Form.Input
                    label="Precio de Venta"
                    placeholder="Precio de Venta"
                    required={value === "menor"}
                    value={precioVenta === 0 ? "" : precioVenta}
                    style={{ marginBottom: "10px" }}
                    defaultValue="0"
                    width={8}
                    disabled={value === "mayor"}
                    onChange={(e) => {
                      setPrecioVenta(Number(e.target.value));
                    }}
                  />
                  <Form.Input
                    label="Utilidad Generada"
                    placeholder="Utilidad"
                    required={value === "menor"}
                    readOnly
                    value={utilidadGenerada === 0 ? "" : utilidadGenerada}
                    defaultValue="0"
                    style={{ marginBottom: "25px" }}
                    width={16}
                    disabled={value === "mayor"}
                    onChange={(e) => {
                      setUtilidadGenerada(Number(e.target.value));
                    }}
                  />
                </Form.Group>
                <label
                  style={{
                    fontWeight: "1000",
                    fontSize: "20px",
                    margin: "25px",
                    color: value === "mayor" ? "black" : "#eee",
                  }}
                >
                  POR MAYOREO
                </label>
                <Form.Group>
                  <Form.Input
                    label="Cantidad Ingreso"
                    placeholder="Cantidad Ingreso"
                    type="number"
                    required={value === "mayor"}
                    defaultValue="0"
                    value={cantidadIngresoM === 0 ? "" : cantidadIngresoM}
                    width={8}
                    disabled={value === "menor"}
                    onChange={(e) => {
                      setCantidadIngresoM(Number(e.target.value));
                    }}
                  />
                  <Form.Input
                    label="Costo Unitario"
                    placeholder="Costo Unitario"
                    type="number"
                    required={value === "mayor"}
                    defaultValue="0"
                    value={
                      costoUnitarioM === 0
                        ? ""
                        : parseFloat(costoUnitarioM) % 1 === 0
                        ? costoUnitarioM
                        : parseFloat(costoUnitarioM)
                            .toFixed(2)
                            .replace(/\.?0+$/, "")
                    }
                    style={{ marginBottom: "10px" }}
                    width={8}
                    disabled={value === "menor"}
                    onChange={(e) => {
                      setCostoUnitarioM(Number(e.target.value));
                    }}
                  />
                  <Form.Input
                    label="Costo Total"
                    placeholder="Costo Total"
                    type="number"
                    required={value === "mayor"}
                    defaultValue="0"
                    value={
                      costoTotalM === 0
                        ? ""
                        : parseFloat(costoTotalM) % 1 === 0
                        ? costoTotalM
                        : parseFloat(costoTotalM)
                            .toFixed(2)
                            .replace(/\.?0+$/, "")
                    }
                    width={8}
                    disabled={value === "menor"}
                    onChange={(e) => {
                      setCostoTotalM(Number(e.target.value));
                    }}
                  />
                  <Form.Input
                    label="Precio de Venta"
                    placeholder="Precio de Venta"
                    required={value === "mayor"}
                    value={precioVentaM === 0 ? "" : precioVentaM}
                    style={{ marginBottom: "10px" }}
                    defaultValue="0"
                    width={8}
                    disabled={value === "menor"}
                    onChange={(e) => {
                      setPrecioVentaM(Number(e.target.value));
                    }}
                  />
                  <Form.Input
                    label="Utilidad Generada"
                    placeholder="Utilidad"
                    required={value === "mayor"}
                    readOnly
                    value={utilidadGeneradaM === 0 ? "" : utilidadGeneradaM}
                    defaultValue="0"
                    style={{ marginBottom: "25px" }}
                    width={16}
                    disabled={value === "menor"}
                    onChange={(e) => {
                      setUtilidadGeneradaM(Number(e.target.value));
                    }}
                  />
                </Form.Group>
                <Form.TextArea
                  label="Observaciones del producto"
                  defaultValue={observaciones}
                  placeholder="Observaciones del Producto"
                  type="text"
                  onChange={(e) => {
                    setObservaciones(e.target.value);
                  }}
                  width={16}
                />
                <br />

                <Button type="submit" color="green" onClick={handleFormSubmit}>
                  Añadir compra
                </Button>
                <br />
                <br />
                <br />
                <br />
              </Form>
            </>
          )}
        </Grid>
      </>
    );
  } else {
    return <Navigate to="/login" />;
  }
};

export default AddProductoCompra;
