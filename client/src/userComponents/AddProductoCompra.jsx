import React, { useEffect, useState, useContext } from "react";
import { Header, Icon, Form, Button, Grid, Dropdown } from "semantic-ui-react";
import { Navigate, useNavigate } from "react-router-dom";
import API_URL from "../config.js";
import toast, { Toaster } from "react-hot-toast";
import { contexto } from "../context/ContextProvider";

const AddProductoCompra = () => {
  const { loggedIn, usuario } = useContext(contexto);
  const [productos, setProductos] = useState([]);
  const [selectedProductoId, setSelectedProductoId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn && (usuario.rol === "Admin" || usuario.rol === "Moderator")) {
      obtenerProductos();
    }
  }, [loggedIn, usuario.rol]);

  const obtenerProductos = async () => {
    try {
      const response = await fetch(`${API_URL}/cosmeticos/nombres`);
      if (!response.ok) {
        throw new Error("Error al obtener los nombres de productos");
      }
      const data = await response.json();
      // Formatear los datos para el Dropdown
      const options = data.map((producto) => ({
        key: producto._id,
        value: producto._id,
        text: producto.nombre,
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
          <Grid.Column mobile={12} tablet={8} computer={6}>
            <Form>
              <Form.Field>
                <label>Seleccionar producto:</label>
                <Dropdown
                  placeholder="Seleccionar producto"
                  search
                  selection
                  options={productos}
                  onChange={handleProductoSelect}
                />
              </Form.Field>
            </Form>
            {selectedProductoId && (
              <h1>ID del producto seleccionado: {selectedProductoId}</h1>
            )}
          </Grid.Column>
        </Grid>
      </>
    );
  } else {
    return <Navigate to="/login" />;
  }
};

export default AddProductoCompra;
