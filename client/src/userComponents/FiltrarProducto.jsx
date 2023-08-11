import React, { useState, useEffect } from "react";
import { Icon, Button, Header, Grid, Form } from "semantic-ui-react";
import API_URL from "../config.js";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

const FiltrarProducto = () => {
  const [nombre, setNombre] = useState("");
  const [especificaciones, setEspecificaciones] = useState("");
  const [cosmeticos, setCosmeticos] = useState([]);

  const handleNombreChange = (e) => {
    setNombre(e.target.value);
  };

  const handleEspecificacionesChange = (e) => {
    setEspecificaciones(e.target.value);
  };

  // Función para manejar la búsqueda de productos
  const handleBuscarProductos = async (event) => {
    if (event) {
      event.preventDefault();
    }

    try {
      // Mostrar el Toast "Cargando"
      const loadingToast = toast.loading("Cargando...", {
        position: "bottom-center",
      });

      const response = await fetch(`${API_URL}/cosmeticos/filtrar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          especificaciones,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        toast.error("Error al obtener la lista de productos", {
          position: "bottom-center",
        });
        throw new Error("Error al obtener la lista de productos", {
          position: "bottom-center",
        });
      }

      const data = await response.json();
      setCosmeticos(data);

      // Ocultar el Toast "Cargando" una vez que se complete la solicitud
      toast.dismiss(loadingToast);

      // Mostrar el Toast con los resultados
      toast.success("Datos cargados correctamente", {
        position: "bottom-center",
      });
    } catch (error) {
      toast.error("Error al obtener la lista de productos", {
        position: "bottom-center",
      });
      console.error("Error al obtener la lista de productos:", error);
    }
  };

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    flexDirection: "row",
    margin: "10px auto",
    maxWidth: "600px",
    minWidth: "300px",
    boxShadow:
      "rgba(0, 0, 0, 0.07) 0px 1px 1px, rgba(0, 0, 0, 0.07) 0px 2px 2px, rgba(0, 0, 0, 0.07) 0px 2px 2px, rgba(0, 0, 0, 0.07) 0px 4px 4px, rgba(0, 0, 0, 0.07) 0px 8px 8px",
    textDecoration: "none",
    color: "black",
  };

  const imageStyle = {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    marginRight: "10px",
    minWidth: "100px",
    maxWidth: "100px",
    margin: "5px 20px 5px 5px",
  };

  const titleStyle = {
    fontSize: "18px",
    fontWeight: "bold",
  };

  const spanStyle = {
    display: "block",
    marginTop: "3px",
  };

  return (
    <>
      <Toaster />
      <div
        style={{
          textAlign: "center",
        }}
      >
        <Header size="tiny" dividing style={{ width: "80vw", margin: "20px auto" }}>
          <Icon name="th" />
          <Header.Content>Combina uno o ambos campos para filtrar los productos</Header.Content>
          <Header.Content size="tiny" as="h5" style={{ fontSize: "10px", color: "red" }}>
            ATENCIÓN: Una búsqueda con pocos parámetros puede cargar muchos productos a la vez o si la búsqueda NO tiene
            parámetros, se cargarán todos los productos.
          </Header.Content>
        </Header>
        <Grid centered style={{ width: "100vw", margin: "0 auto" }}>
          <Grid.Column mobile={14} tablet={8} computer={6}>
            <Form>
              <Form.Group widths="equal">
                <Form.Input
                  label="Nombre del Producto"
                  placeholder="Nombre del Producto"
                  value={nombre}
                  onChange={handleNombreChange}
                  autoComplete="nope"
                />
                <Form.Input
                  label="Alguna especificación del producto"
                  placeholder="Alguna especificación del producto"
                  value={especificaciones}
                  onChange={handleEspecificacionesChange}
                  autoComplete="nope"
                />
              </Form.Group>
              <Grid>
                <Grid.Column textAlign="center">
                  <Button type="submit" onClick={handleBuscarProductos}>
                    Buscar Productos
                  </Button>
                </Grid.Column>
              </Grid>
            </Form>
          </Grid.Column>
        </Grid>
        <div style={{ margin: "5px 10px", overflow: "hidden" }}>
          <Header size="tiny" dividing>
            Resultados de la búsqueda:
          </Header>
          {cosmeticos?.length > 0 ? (
            <div>
              {cosmeticos?.map((cosmetico) => (
                <Link
                  key={cosmetico._id}
                  style={containerStyle}
                  to={`/user/verProducto/${cosmetico._id}`}
                  state={{ cosmetico }}
                >
                  <img
                    src={cosmetico?.imagen[0] ?? "https://cdn-icons-png.flaticon.com/512/7734/7734301.png"}
                    alt={cosmetico?.producto ?? ""}
                    style={imageStyle}
                  />
                  <div style={{ textAlign: "left" }}>
                    <div style={titleStyle}>{cosmetico?.producto ?? ""}</div>
                    <div>{cosmetico?.especificaciones ?? ""}</div>
                    <span style={spanStyle}>
                      <strong>Disponibles: </strong>
                      {cosmetico?.cantidadTotal - (cosmetico?.vendidos ?? 0) - cosmetico?.apartados ?? ""}
                    </span>
                    <span style={spanStyle}>
                      <strong>Apartados: </strong>
                      {cosmetico?.apartados ?? ""}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p>No hay resultados</p>
          )}
          <br />
          <br />
        </div>
      </div>
    </>
  );
};

export default FiltrarProducto;
