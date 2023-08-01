import React, { useState, useEffect } from "react";
import {
  Icon,
  Button,
  Header,
  Grid,
  Form,
  Card,
  Image,
} from "semantic-ui-react";
import API_URL from "../config.js";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

const BuscarCliente = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [numeroTel, setNumeroTel] = useState("");
  const [resultados, setResultados] = useState([]);

  // useEffect(() => {
  //   const storedBusqueda = JSON.parse(localStorage.getItem("busquedaActual"));
  //   if (storedBusqueda) {
  //     setResultados(storedBusqueda);
  //   }
  // }, []);

  const handleBuscar = async (event) => {
    if (event) {
      event.preventDefault();
    }
    try {
      // Mostrar el Toast "Cargando"
      const loadingToast = toast.loading("Cargando...", {
        position: "bottom-center",
      });

      const response = await fetch(`${API_URL}/cliente/filtrar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          apellido,
          numeroTel,
        }),
        credentials: "include", // Asegúrate de incluir esta opción
      });

      if (!response.ok) {
        toast.error("Error al filtrar los clientes", {
          position: "bottom-center",
        });
        throw new Error("Error al filtrar los clientes", {
          position: "bottom-center",
        });
      }

      const data = await response.json();
      // localStorage.setItem("busquedaActual", JSON.stringify(data));
      setResultados(data);

      // Ocultar el Toast "Cargando" una vez que se complete la solicitud
      toast.dismiss(loadingToast);

      // Mostrar el Toast con los resultados
      toast.success("Datos cargados correctamente", {
        position: "bottom-center",
      });
    } catch (error) {
      toast.error("Error al obtener los clientes por fecha", {
        position: "bottom-center",
      });
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
    <>
      <Toaster />{" "}
      {/* Coloca el Toaster fuera del form para que sea accesible en toda la página */}
      <div style={{ margin: "15px", textAlign: "center" }}>
        <Header size="tiny" dividing>
          <Icon name="calendar alternate" />
          <Header.Content>
            Combina uno o varios campos filtrar clientes
          </Header.Content>
          <Header.Content
            size="tiny"
            as="h5"
            style={{ fontSize: "10px", color: "red" }}
          >
            ATENCIÓN: Una búsqueda con pocos parámetros puede cargar muchos
            clientes a la vez o si la búsqueda NO tiene parámetros, se cargarán
            todos los clientes.
          </Header.Content>
        </Header>
      </div>
      <Grid centered style={{ width: "100vw", margin: "0 auto" }}>
        <Grid.Column mobile={14} tablet={8} computer={6}>
          <Form>
            <Form.Group widths="equal">
              <Form.Input
                label="Nombre"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                autoComplete="nope"
              />
              <Form.Input
                label="Apellido"
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                autoComplete="nope"
              />
            </Form.Group>

            <Form.Input
              label="Número de Teléfono"
              type="tel"
              placeholder="Número de Teléfono"
              value={numeroTel}
              onChange={(e) => setNumeroTel(e.target.value)}
              autoComplete="nope"
            />
            <Grid>
              <Grid.Column textAlign="center">
                <Button type="submit" onClick={handleBuscar}>
                  Buscar clientes
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        </Grid.Column>
      </Grid>
      {/* Renderizar los datos */}
      <div style={{ margin: "15px" }}>
        <Header size="tiny" dividing>
          Resultados de la búsqueda:
        </Header>
        <Card
          style={{
            margin: "10px auto 30px auto ",
            width: "90vw",
            textAlign: "left",
          }}
        >
          {resultados.length > 0 ? (
            <>
              {resultados?.map((cliente, idx) => (
                <React.Fragment key={idx}>
                  <Card.Content
                    key={idx}
                    style={{
                      backgroundColor: cliente.estado ? "#d0e3d6" : "#f9eee4", // Fondo blanco (snow) para índices pares
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
                    <Card.Meta>Producto: {cliente?.producto ?? ""}</Card.Meta>
                    <Card.Meta>
                      Descripción: {cliente?.descripcion ?? ""}
                    </Card.Meta>
                    <Card.Description>
                      <strong>Precio:</strong> Q. {cliente?.precio ?? ""}
                      <strong>&nbsp;&nbsp;&nbsp;&nbsp;Anticipo:</strong> Q.{" "}
                      {cliente?.anticipo ?? ""}
                      <strong>&nbsp;&nbsp;&nbsp;&nbsp;Saldo </strong> Q.{" "}
                      {cliente?.saldo ?? ""}
                    </Card.Description>
                    <Card.Description>
                      <strong>Recibido:</strong>{" "}
                      {formatDate(cliente.fechaRecibo)}
                      <strong> Entrega:</strong>{" "}
                      {formatDate(cliente.fechaEntrega)}
                    </Card.Description>
                  </Card.Content>
                </React.Fragment>
              ))}
            </>
          ) : (
            <p>No hay resultados</p>
          )}
        </Card>
        <br />
        <br />
      </div>
    </>
  );
};

export default BuscarCliente;
