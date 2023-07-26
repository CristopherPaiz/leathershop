import React, { useState, useEffect } from "react";
import {
  Header,
  Icon,
  Container,
  Input,
  Button,
  Card,
} from "semantic-ui-react";
import API_URL from "../config.js";
import { Link } from "react-router-dom";
const Entregados = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [resultados, setResultados] = useState([""]);

  useEffect(() => {
    // Función para obtener la fecha actual
    const getCurrentDate = () => {
      const today = new Date();
      today.setDate(today.getDate() - 30);
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Función para obtener la fecha una semana en el futuro
    const getOneWeekAheadDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Establecer las fechas por defecto en el estado
    setFechaInicio(getCurrentDate());
    setFechaFin(getOneWeekAheadDate());
    // Disparar el evento del fetch al inicio para obtener los resultados iniciales
    handleSubmit();
  }, []);

  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }

    try {
      const fechaInicioISO = new Date(fechaInicio);
      const fechaFinISO = new Date(fechaFin);

      const response = await fetch(`${API_URL}/cliente/getbyfechafin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fechaRecibo: fechaInicioISO,
          fechaEntrega: fechaFinISO,
        }),
        credentials: "include", // Asegúrate de incluir esta opción
      });

      if (!response.ok) {
        throw new Error("Error al obtener los clientes por fecha");
      }

      const data = await response.json();
      setResultados(data);
    } catch (error) {
      console.error("Error al obtener los clientes por fecha:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div style={{ margin: "0 auto", textAlign: "center" }}>
      <div style={{ margin: "15px" }}>
        <Header size="tiny" dividing>
          <Icon name="calendar alternate" />
          <Header.Content>Trabajos pendientes de entregar</Header.Content>
        </Header>
      </div>
      <form onSubmit={handleSubmit} style={{ margin: "10px" }}>
        <strong> Del </strong>
        <Input
          type="date"
          id="fechaInicio"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />

        <strong> Al </strong>
        <Input
          type="date"
          id="fechaFin"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
        />
        <Container textAlign="center">
          <Button type="submit" style={{ margin: "10px auto", width: "200px" }}>
            Filtrar
          </Button>
        </Container>
      </form>
      <Card
        style={{
          margin: "10px auto 30px auto ",
          width: "90vw",
          textAlign: "left",
        }}
      >
        {resultados.length > 0 ? (
          <>
            {resultados.map((cliente, idx) => {
              return (
                <React.Fragment key={idx}>
                  <Card.Content
                    style={{
                      backgroundColor: "#b6d7a8",
                    }}
                  >
                    <Button
                      as={Link}
                      icon="eye"
                      secondary
                      inverted
                      floated="right"
                      to={`/admin/vercliente/${cliente._id}`}
                      state={{ cliente }}
                    />
                    <Card.Header>
                      {cliente?.nombre ?? ""} {cliente?.apellido ?? ""}
                    </Card.Header>
                    <Card.Meta>Producto: {cliente?.producto ?? ""}</Card.Meta>
                    <Card.Description>
                      <strong>Fecha recibido:</strong>{" "}
                      {formatDate(cliente.fechaRecibo)}
                    </Card.Description>
                    <Card.Description>
                      <strong>Fecha Entrega:</strong>{" "}
                      {formatDate(cliente.fechaEntrega)}
                    </Card.Description>
                  </Card.Content>
                </React.Fragment>
              );
            })}
          </>
        ) : (
          <p>No hay resultados</p>
        )}
      </Card>
    </div>
  );
};

export default Entregados;