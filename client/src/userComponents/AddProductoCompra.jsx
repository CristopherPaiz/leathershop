import React, { useEffect, useState, useContext } from "react";
import { Header, Icon, Form, Button, Grid, Dropdown } from "semantic-ui-react";
import { Navigate } from "react-router-dom";
import API_URL from "../config.js";
import toast, { Toaster } from "react-hot-toast";
import { contexto } from "../context/ContextProvider";
import "./AddProductoCompraCSS.css";

const AddProductoCompra = () => {
  const { loggedIn, usuario } = useContext(contexto);
  const [productos, setProductos] = useState([]);
  const [selectedProductoId, setSelectedProductoId] = useState(null);

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

  if (loggedIn && (usuario.rol === "Admin" || usuario.rol === "Moderator")) {
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
              <Header as="h4" style={{ margin: "0px 0px 20px 0px" }}>
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
                  }}
                >
                  POR UNIDAD
                </label>
                <Form.Group>
                  <Form.Input
                    label="Cantidad Ingreso"
                    placeholder="Cantidad Ingreso"
                    type="number"
                    required
                    defaultValue="0"
                    width={8}
                  />
                  <Form.Input
                    label="Costo Unitario"
                    placeholder="Costo Unitario"
                    type="number"
                    required
                    defaultValue="0"
                    style={{ marginBottom: "10px" }}
                    width={8}
                  />
                  <Form.Input
                    label="Costo Total"
                    placeholder="Costo Total"
                    type="number"
                    required
                    defaultValue="0"
                    width={8}
                  />
                  <Form.Input
                    label="Precio de Venta"
                    placeholder="Precio de Venta"
                    required
                    defaultValue="0"
                    style={{ marginBottom: "10px" }}
                    width={8}
                  />
                  <Form.Input
                    label="Utilidad Generada"
                    placeholder="Utilidad"
                    required
                    readOnly
                    defaultValue="0"
                    style={{ marginBottom: "25px" }}
                    width={16}
                  />
                </Form.Group>
                <label
                  style={{
                    fontWeight: "1000",
                    fontSize: "20px",
                    margin: "25px",
                  }}
                >
                  POR MAYOREO
                </label>
                <Form.Group widths={2}>
                  <Form.Input
                    label="Cantidad Ingreso"
                    placeholder="Cantidad Ingreso"
                    type="number"
                    defaultValue="0"
                    required
                    width={8}
                  />
                  <Form.Input
                    label="Costo Unitario"
                    placeholder="Costo Unitario"
                    type="number"
                    defaultValue="0"
                    required
                    width={8}
                    style={{ marginBottom: "10px" }}
                  />
                  <Form.Input
                    label="Costo Total"
                    placeholder="Costo Total"
                    type="number"
                    defaultValue="0"
                    required
                    width={8}
                  />
                  <Form.Input
                    label="Precio de Venta"
                    placeholder="Precio de Venta"
                    defaultValue="0"
                    type="number"
                    required
                    width={8}
                    style={{ marginBottom: "10px" }}
                  />
                  <Form.Input
                    label="Utilidad Generada"
                    placeholder="Utilidad Generada"
                    defaultValue="0"
                    type="number"
                    required
                    readOnly
                    width={16}
                    style={{ marginBottom: "50px" }}
                  />
                </Form.Group>
                <Form.TextArea
                  label="Observaciones del producto"
                  placeholder="Observaciones del Producto"
                  type="text"
                  width={16}
                />
                <br />

                <Button type="submit" color="green">
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
