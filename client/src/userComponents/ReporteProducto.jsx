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
  const [pestanaActiva, setPestanaActiva] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cosmeticos, setCosmeticos] = useState([]);
  const [titulo, settitulo] = useState("Primero seleccione una pestaña...");

  const cambiarPestana = (numeroPestana) => {
    settitulo("Cargando...");
    setPestanaActiva(numeroPestana);
  };

  useEffect(() => {
    if (pestanaActiva === 1) {
      getDisponibilidad();
    } else if (pestanaActiva === 2) {
    } else if (pestanaActiva === 3) {
      utilidadUnidad();
    } else if (pestanaActiva === 4) {
      utilidadPorMayor();
    } else if (pestanaActiva === 5) {
      cantidadComprado();
    } else if (pestanaActiva === 6) {
      cantidadVendido();
    } else if (pestanaActiva === 7) {
      utilidadGenerada();
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

  //Obtener disponibilidad
  const utilidadUnidad = async () => {
    try {
      const response = await fetch(
        `${API_URL}/cosmeticos/utilidad-por-unidad`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        toast.error("Error al obtener la utilidad por unidad de los productos");
        throw new Error(
          "Error al obtener la utilidad por unidad de los productos"
        );
      }

      const data = await response.json();
      setCosmeticos(data);
      setLoading(false);
    } catch (error) {
      toast.error("Error al obtener la utilidad por unidad de los productos");
      console.error(
        "Error al obtener la utilidad por unidad de los productos:",
        error
      );
    }
  };

  //Obtener disponibilidad
  const utilidadPorMayor = async () => {
    try {
      const response = await fetch(`${API_URL}/cosmeticos/utilidad-por-mayor`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        toast.error("Error al obtener la utilidad por unidad de los productos");
        throw new Error(
          "Error al obtener la utilidad por unidad de los productos"
        );
      }

      const data = await response.json();
      setCosmeticos(data);
      setLoading(false);
    } catch (error) {
      toast.error("Error al obtener la utilidad por unidad de los productos");
      console.error(
        "Error al obtener la utilidad por unidad de los productos:",
        error
      );
    }
  };

  //Obtener disponibilidad
  const cantidadComprado = async () => {
    try {
      const response = await fetch(
        `${API_URL}/cosmeticos/cantidad-y-monto-comprado`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        toast.error("Error al obtener la utilidad por unidad de los productos");
        throw new Error(
          "Error al obtener la utilidad por unidad de los productos"
        );
      }

      const data = await response.json();
      setCosmeticos(data);
      setLoading(false);
    } catch (error) {
      toast.error("Error al obtener la utilidad por unidad de los productos");
      console.error(
        "Error al obtener la utilidad por unidad de los productos:",
        error
      );
    }
  };

  //Obtener disponibilidad
  const cantidadVendido = async () => {
    try {
      const response = await fetch(
        `${API_URL}/cosmeticos/cantidad-y-monto-venta`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        toast.error("Error al obtener la utilidad por unidad de los productos");
        throw new Error(
          "Error al obtener la utilidad por unidad de los productos"
        );
      }

      const data = await response.json();
      setCosmeticos(data);
      setLoading(false);
    } catch (error) {
      toast.error("Error al obtener la utilidad por unidad de los productos");
      console.error(
        "Error al obtener la utilidad por unidad de los productos:",
        error
      );
    }
  };

  //Obtener disponibilidad
  const utilidadGenerada = async () => {
    try {
      const response = await fetch(
        `${API_URL}/cosmeticos/cantidad-monto-utilidad`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        toast.error("Error al obtener la utilidad por unidad de los productos");
        throw new Error(
          "Error al obtener la utilidad por unidad de los productos"
        );
      }

      const data = await response.json();
      setCosmeticos(data);
      setLoading(false);
    } catch (error) {
      toast.error("Error al obtener la utilidad por unidad de los productos");
      console.error(
        "Error al obtener la utilidad por unidad de los productos:",
        error
      );
    }
  };

  if (loggedIn && usuario.rol === "Admin") {
    const botones = [
      { numero: 1, texto: "Disponibilidad", icono: "sort content descending" },
      { numero: 2, texto: "Apartados", icono: "handshake" },
      { numero: 3, texto: "Utilidad Unidad", icono: "hockey puck" },
      { numero: 4, texto: "Utilidad Mayor", icono: "database" },
      { numero: 5, texto: "Cant. Comprado", icono: "grid layout" },
      { numero: 6, texto: "Cant. Vendido", icono: "dollar" },
      { numero: 7, texto: "Utilidad Generada", icono: "dollar" },
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
              style={{ margin: "3px", width: "176px" }}
            >
              <Icon name={boton.icono} />
              {boton.texto}
            </Button>
          ))}
        </div>
        {loading ? (
          <h4
            style={{
              margin: "100px auto",
              width: "100vw",
              textAlign: "center",
            }}
          >
            {titulo}
          </h4>
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
                <Table celled unstackable style={{ marginBottom: "40px" }}>
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
                        negative={cosmetico?.Disponible <= 3}
                        positive={cosmetico?.Disponible > 3}
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
            {pestanaActiva === 3 ? (
              <div
                style={{
                  maxWidth: "350px",
                  width: "350px",
                  margin: "10px auto",
                }}
              >
                <Header as="h3" icon textAlign="center">
                  <Header.Subheader>
                    Utilidad de un producto en compras por Unidad:{" "}
                  </Header.Subheader>
                </Header>
                <Table celled unstackable style={{ marginBottom: "40px" }}>
                  <Table.Header>
                    <Table.Row textAlign="center">
                      <Table.HeaderCell>Producto</Table.HeaderCell>
                      <Table.HeaderCell>Utilidad por Unidad</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {cosmeticos.map((cosmetico) => (
                      <Table.Row key={cosmetico?.producto}>
                        <Table.Cell>{cosmetico?.producto}</Table.Cell>
                        <Table.Cell textAlign="center">
                          Q. {cosmetico?.utilidadTotal}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            ) : null}
            {pestanaActiva === 4 ? (
              <div
                style={{
                  maxWidth: "350px",
                  width: "350px",
                  margin: "10px auto",
                }}
              >
                <Header as="h3" icon textAlign="center">
                  <Header.Subheader>
                    Utilidad de un producto en compras por Mayoreo:{" "}
                  </Header.Subheader>
                </Header>
                <Table celled unstackable style={{ marginBottom: "40px" }}>
                  <Table.Header>
                    <Table.Row textAlign="center">
                      <Table.HeaderCell>Producto</Table.HeaderCell>
                      <Table.HeaderCell>Utilidad por Mayoreo</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {cosmeticos.map((cosmetico) => (
                      <Table.Row key={cosmetico?.producto}>
                        <Table.Cell>{cosmetico?.producto}</Table.Cell>
                        <Table.Cell textAlign="center">
                          Q. {cosmetico?.utilidadTotal}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            ) : null}
            {pestanaActiva === 5 ? (
              <div
                style={{
                  maxWidth: "350px",
                  width: "350px",
                  margin: "10px auto",
                }}
              >
                <Header as="h3" icon textAlign="center">
                  <Header.Subheader>
                    Cantidad de producto comprado a lo largo del tiempo{" "}
                  </Header.Subheader>
                  <Header.Subheader>
                    Y su equivalente en Quetzales
                  </Header.Subheader>
                </Header>
                <Table celled unstackable style={{ marginBottom: "40px" }}>
                  <Table.Header>
                    <Table.Row textAlign="center">
                      <Table.HeaderCell>Producto</Table.HeaderCell>
                      <Table.HeaderCell>
                        Cantidad Total Comprada
                      </Table.HeaderCell>
                      <Table.HeaderCell>Equivalente en GTQ.</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {cosmeticos.map((cosmetico) => (
                      <Table.Row key={cosmetico?.producto}>
                        <Table.Cell>{cosmetico?.producto}</Table.Cell>
                        <Table.Cell textAlign="center">
                          {cosmetico?.cantidadComprado} Unid.
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          Q. {cosmetico?.montoTotalDinero}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            ) : null}
            {pestanaActiva === 6 ? (
              <div
                style={{
                  maxWidth: "350px",
                  width: "350px",
                  margin: "10px auto",
                }}
              >
                <Header as="h3" icon textAlign="center">
                  <Header.Subheader>
                    Cantidad de producto PREVISTO para vender según lo comprado{" "}
                  </Header.Subheader>
                  <Header.Subheader>
                    Y su equivalente en Quetzales
                  </Header.Subheader>
                </Header>
                <Table celled unstackable>
                  <Table.Header>
                    <Table.Row textAlign="center">
                      <Table.HeaderCell>Producto</Table.HeaderCell>
                      <Table.HeaderCell>
                        Cantidad Total Vendida
                      </Table.HeaderCell>
                      <Table.HeaderCell>Equivalente en GTQ.</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {cosmeticos.map((cosmetico) => (
                      <Table.Row key={cosmetico?.producto}>
                        <Table.Cell>{cosmetico?.producto}</Table.Cell>
                        <Table.Cell textAlign="center">
                          {cosmetico?.cantidadComprado} Unid.
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          Q. {cosmetico?.montoTotalVenta}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
                <br />
                <br />
              </div>
            ) : null}
            {pestanaActiva === 7 ? (
              <div
                style={{
                  maxWidth: "350px",
                  width: "350px",
                  margin: "10px auto",
                  overflow: "auto",
                }}
              >
                <Header as="h3" icon textAlign="center">
                  <Header.Subheader>
                    Cantidad de utilidad PREVISTA según lo comprado y vendido{" "}
                  </Header.Subheader>
                  <Header.Subheader>
                    Y su equivalente en Quetzales
                  </Header.Subheader>
                </Header>
                <Table celled unstackable style={{ marginBottom: "40px" }}>
                  <Table.Header>
                    <Table.Row textAlign="center">
                      <Table.HeaderCell>Producto</Table.HeaderCell>
                      <Table.HeaderCell>Cantidad</Table.HeaderCell>
                      <Table.HeaderCell>Comprado</Table.HeaderCell>
                      <Table.HeaderCell>Vendido</Table.HeaderCell>
                      <Table.HeaderCell>Utilidad</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {cosmeticos.map((cosmetico) => (
                      <Table.Row key={cosmetico?.producto}>
                        <Table.Cell>{cosmetico?.producto}</Table.Cell>
                        <Table.Cell textAlign="center">
                          {cosmetico?.cantidadComprado} Unid.
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          Q. {cosmetico?.montoTotalDinero}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          Q. {cosmetico?.montoTotalVenta}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          Q. {cosmetico?.utilidad}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            ) : null}
          </>
        )}
      </>
    );
  } else {
    return <Navigate to={"/login"} />; // Redirige a la página de inicio
  }
};

export default ReporteProducto;
