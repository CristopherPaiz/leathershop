import React, { useState, useEffect } from "react";
import {
  Header,
  Icon,
  Container,
  Input,
  Button,
  Card,
  Image,
} from "semantic-ui-react";
import API_URL from "../config.js";
import { Link } from "react-router-dom";

const PorEntregar = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loaded, setLoaded] = useState(false); // Bandera de control

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
    setLoaded(true);
  }, []);

  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }

    try {
      const fechaInicioISO = new Date(fechaInicio);
      fechaInicioISO.setDate(fechaInicioISO.getDate() + 1);
      const fechaFinISO = new Date(fechaFin);
      fechaFinISO.setDate(fechaFinISO.getDate() + 1);

      const response = await fetch(`${API_URL}/cliente/getbyfecha`, {
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

  const getDaysDifference = (dateString) => {
    const deliveryDate = new Date(dateString);
    const today = new Date();
    const timeDiff = deliveryDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (loaded) {
      handleSubmit();
    }
  }, [fechaInicio, fechaFin, loaded]);

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
            {resultados.map((cliente) => {
              const daysDifference = getDaysDifference(cliente.fechaEntrega);

              let backgroundColor;
              if (daysDifference <= 3) {
                backgroundColor = "#ea9999"; // 3 días o menos para entregar
              } else if (daysDifference <= 5) {
                backgroundColor = "#ffe599"; // 5 días o menos para entregar
              } else {
                backgroundColor = "#9fc5e8"; // Más de 7 días para entregar
              }

              return (
                <React.Fragment key={cliente._id}>
                  <Card.Content
                    key={cliente._id}
                    style={{
                      backgroundColor: backgroundColor,
                      marginBottom: "2px",
                    }}
                    as={Link}
                    to={`/admin/vercliente/${cliente._id}`}
                    state={{ cliente }}
                  >
                    <Image
                      src={
                        cliente?.imagen[0] ??
                        "https://cdn-icons-png.flaticon.com/512/7734/7734301.png"
                      }
                      size="tiny"
                      floated="left"
                      verticalAlign="middle"
                      style={{
                        objectFit: "cover",
                        width: "100px",
                        height: "100px",
                      }}
                    />

                    <Card.Header>
                      {cliente?.nombre ?? ""} {cliente?.apellido ?? ""}
                    </Card.Header>
                    <Card.Meta>
                      <strong>Producto: </strong> {cliente?.producto ?? ""}
                    </Card.Meta>

                    <Card.Meta>
                      <strong>Fecha recibido:</strong>{" "}
                      {formatDate(cliente?.fechaRecibo)}
                    </Card.Meta>
                    <Card.Meta>
                      <strong>Fecha Entrega:</strong>{" "}
                      {formatDate(cliente.fechaEntrega)}
                    </Card.Meta>
                    <Card.Description>
                      <strong>Especificaciones: </strong>
                      {cliente?.especificaciones ?? ""}
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
      <br />
      <br />
    </div>
  );
};

export default PorEntregar;
