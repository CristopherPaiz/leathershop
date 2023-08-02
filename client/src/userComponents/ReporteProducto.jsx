import React, { useEffect, useState, useContext } from "react";
import {
  Header,
  Icon,
  Form,
  Grid,
  Radio,
  Pagination,
  Accordion,
  Tab,
  TabPane,
  Button,
  Table,
} from "semantic-ui-react";
import { Navigate } from "react-router-dom";
import API_URL from "../config.js";
import toast, { Toaster } from "react-hot-toast";
import { contexto } from "../context/ContextProvider";

const ReporteProducto = () => {
  const { loggedIn, usuario } = useContext(contexto);
  const [pestanaActiva, setPestanaActiva] = useState(1);
  const [loading, setLoading] = useState(true);
  const [cosmeticos, setCosmeticos] = useState([]);

  const cambiarPestana = (numeroPestana) => {
    setPestanaActiva(numeroPestana);
    localStorage.setItem("pestanaActiva", numeroPestana);
  };

  useEffect(() => {
    if (pestanaActiva === 1) {
      getDisponibilidad();
    } else if (pestanaActiva === 2) {
      setLoading(false);
    } else if (pestanaActiva === 3) {
      setLoading(false);
    } else if (pestanaActiva === 4) {
      setLoading(false);
    } else if (pestanaActiva === 5) {
      setLoading(false);
    } else if (pestanaActiva === 6) {
      setLoading(false);
    }
  }, [pestanaActiva]);

  //Obtener disponibilidad
  const getDisponibilidad = async () => {
    try {
      const response = await fetch(
        `${API_URL}/cosmeticos/getalldisponibility`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        toast.error("Error al obtener la disponibilidad de los productos");
        throw new Error("Error al obtener la disponibilidad de los productos");
      }

      const data = await response.json();
      setCosmeticos(data.data);
      setLoading(false);
    } catch (error) {
      toast.error("Error al obtener la disponibilidad de los productos");
      console.error(
        "Error al obtener la disponibilidad de los productos:",
        error
      );
    }
  };

  if (loggedIn && usuario.rol === "Admin") {
    const botones = [
      { numero: 1, texto: "Disponibilidad", icono: "sort content descending" },
      { numero: 2, texto: "Vendidos", icono: "handshake" },
      { numero: 3, texto: "Utilidad Unidad", icono: "hockey puck" },
      { numero: 4, texto: "Utilidad Mayor", icono: "database" },
      { numero: 5, texto: "Cant. Comprado", icono: "grid layout" },
      { numero: 6, texto: "Cant. Vendido", icono: "dollar" },
    ];
    return (
      <>
        <Toaster />
        <Header as="h2" icon textAlign="center">
          <Icon name="line graph" />
          <Header.Content>Reporte de productos</Header.Content>
        </Header>
        <div style={{ textAlign: "center" }}>
          {botones.map((boton) => (
            <Button
              key={boton.numero}
              active={pestanaActiva === boton.numero}
              toggle
              onClick={() => cambiarPestana(boton.numero)}
              style={{ margin: "3px", width: "170px" }}
            >
              <Icon name={boton.icono} />
              {boton.texto}
            </Button>
          ))}
        </div>
        {loading ? (
          <h1>Cargando...</h1>
        ) : (
          <>
            {pestanaActiva === 1 ? (
              <div
                style={{
                  maxWidth: "350px",
                  width: "350px",
                  margin: "10px auto",
                }}
              >
                <Header as="h3" icon textAlign="center">
                  <Header.Subheader>
                    Disponibilidad de un producto siguiendo la fórmula:{" "}
                  </Header.Subheader>
                  <Header.Subheader style={{ color: "red" }}>
                    Producto Total - apartados = disponibilidad
                  </Header.Subheader>
                </Header>
                <Table celled unstackable>
                  <Table.Header>
                    <Table.Row textAlign="center">
                      <Table.HeaderCell>Producto</Table.HeaderCell>
                      <Table.HeaderCell>Disponibilidad</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {cosmeticos.map((cosmetico) => (
                      <Table.Row
                        key={cosmetico?.producto}
                        negative={cosmetico?.Disponible === 0}
                        positive={cosmetico?.Disponible > 0}
                      >
                        <Table.Cell>{cosmetico?.producto}</Table.Cell>
                        <Table.Cell textAlign="center">
                          {cosmetico?.Disponible}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            ) : null}

            {pestanaActiva === 2 ? <h1>Hola2</h1> : null}
            {pestanaActiva === 3 ? <h1>Hola3</h1> : null}
            {pestanaActiva === 4 ? <h1>Hola4</h1> : null}
            {pestanaActiva === 5 ? <h1>Hola5</h1> : null}
            {pestanaActiva === 6 ? <h1>Hola6</h1> : null}
          </>
        )}
      </>
    );
  } else {
    return <Navigate to={"/login"} />; // Redirige a la página de inicio
  }
};

export default ReporteProducto;
