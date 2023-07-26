import React, { useEffect, useState, useContext } from "react";
import { Header, Icon, Form, Button, Grid, Label } from "semantic-ui-react";
import { Navigate } from "react-router-dom";
import API_URL from "../config.js";
import toast, { Toaster } from "react-hot-toast";
import { contexto } from "../context/ContextProvider";

const AddCliente = () => {
  const { loggedIn, usuario } = useContext(contexto);
  const [datosCliente, setDatosCliente] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFormSubmit = async () => {
    console.log(datosCliente);
    try {
      // Ajustar el formato de las fechas
      const formattedData = {
        ...datosCliente,
        fechaRecibo: new Date(datosCliente.fechaRecibo),
        fechaEntrega: new Date(datosCliente.fechaEntrega),
      };

      // Ajustar campos enteros
      formattedData.precio = Number(datosCliente.precio);
      formattedData.anticipo = Number(datosCliente.anticipo);
      formattedData.saldo = Number(datosCliente.saldo);

      // Convertir los campos "colores" y "tallas" de string a array
      formattedData.colores = datosCliente.colores
        ? datosCliente.colores.split(",").map((color) => color.trim())
        : [];

      formattedData.tallas = datosCliente.tallas
        ? datosCliente.tallas.split(",").map((talla) => talla.trim())
        : [];

      const response = await fetch(`${API_URL}/cliente/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
        credentials: "include", // Asegúrate de incluir esta opción
      });

      if (!response.ok) {
        // Manejar escenarios de error si es necesario
        console.error("Error al añadir el cliente", response);
      } else {
        // Manejar el escenario de éxito si es necesario
        toast.success("Cliente añadido exitosamente");
      }
    } catch (error) {
      console.error("Error al añadir el cliente", error);
    }
  };

  if (loggedIn && usuario.rol === "Admin") {
    return (
      <>
        <Toaster />{" "}
        <Header as="h2" icon textAlign="center">
          <Icon name="user" circular />
          <Header.Content>Detalle del cliente</Header.Content>
        </Header>
        <Grid centered style={{ width: "100vw", margin: "0 auto" }}>
          <Grid.Column mobile={14} tablet={8} computer={6}>
            <Form>
              <Form.Group widths="equal">
                <Form.Input
                  label="Nombre"
                  placeholder="Nombre"
                  required
                  autoComplete="nope"
                  onChange={(e) =>
                    setDatosCliente({
                      ...datosCliente,
                      nombre: e.target.value,
                    })
                  }
                />
                <Form.Input
                  label="Apellido"
                  placeholder="Apellido"
                  autoComplete="nope"
                  onChange={(e) =>
                    setDatosCliente({
                      ...datosCliente,
                      apellido: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input
                  label="Fecha de Recibo"
                  type="date"
                  required
                  autoComplete="nope"
                  onChange={(e) =>
                    setDatosCliente({
                      ...datosCliente,
                      fechaRecibo: e.target.value,
                    })
                  }
                />
                <Form.Input
                  label="Fecha de Entrega"
                  type="date"
                  required
                  autoComplete="nope"
                  onChange={(e) =>
                    setDatosCliente({
                      ...datosCliente,
                      fechaEntrega: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Input
                label="Número de Teléfono"
                type="tel"
                required
                autoComplete="nope"
                onChange={(e) =>
                  setDatosCliente({
                    ...datosCliente,
                    numeroTel: e.target.value,
                  })
                }
              />
              <Form.Input
                label="Producto"
                placeholder="Producto"
                required
                autoComplete="nope"
                onChange={(e) =>
                  setDatosCliente({
                    ...datosCliente,
                    producto: e.target.value,
                  })
                }
              />
              <Form.Group widths="equal">
                <Form.Input
                  label="Precio"
                  type="number"
                  placeholder="0.00"
                  autoComplete="nope"
                  required
                  onChange={(e) =>
                    setDatosCliente({
                      ...datosCliente,
                      precio: e.target.value,
                    })
                  }
                >
                  <Label basic size="big">
                    Q
                  </Label>
                  <input />
                </Form.Input>
                <Form.Input
                  label="Anticipo"
                  type="number"
                  placeholder="0.00"
                  autoComplete="nope"
                  onChange={(e) =>
                    setDatosCliente({
                      ...datosCliente,
                      anticipo: e.target.value,
                    })
                  }
                >
                  <Label basic size="big">
                    Q
                  </Label>
                  <input />
                </Form.Input>
              </Form.Group>
              <Form.Input
                label="Saldo"
                type="number"
                placeholder="0.00"
                autoComplete="nope"
                onChange={(e) =>
                  setDatosCliente({
                    ...datosCliente,
                    saldo: e.target.value,
                  })
                }
              >
                <Label basic size="big">
                  Q
                </Label>
                <input />
              </Form.Input>
              <Form.TextArea
                label="Especificaciones"
                placeholder="Especificaciones"
                autoComplete="nope"
                onChange={(e) =>
                  setDatosCliente({
                    ...datosCliente,
                    especificaciones: e.target.value,
                  })
                }
              />
              <Form.TextArea label="Medidas" placeholder="Medidas" />
              <Form.Input
                label="Trabajador"
                placeholder="Trabajador"
                autoComplete="nope"
                onChange={(e) =>
                  setDatosCliente({
                    ...datosCliente,
                    trabajador: e.target.value,
                  })
                }
              />
              <Form.TextArea
                label="Descripción"
                placeholder="Descripción"
                autoComplete="nope"
                onChange={(e) =>
                  setDatosCliente({
                    ...datosCliente,
                    descripcion: e.target.value,
                  })
                }
              />
              <Form.TextArea
                label="Observaciones"
                placeholder="Observaciones"
                autoComplete="nope"
                onChange={(e) =>
                  setDatosCliente({
                    ...datosCliente,
                    observaciones: e.target.value,
                  })
                }
              />
              <Form.TextArea
                label="Recomendaciones"
                placeholder="Recomendaciones"
                autoComplete="nope"
                onChange={(e) =>
                  setDatosCliente({
                    ...datosCliente,
                    recomendaciones: e.target.value,
                  })
                }
              />
              <Form.Input
                label="Colores"
                placeholder="Colores"
                autoComplete="nope"
                onChange={(e) =>
                  setDatosCliente({
                    ...datosCliente,
                    colores: e.target.value,
                  })
                }
              />
              <Form.Input
                label="Tallas"
                placeholder="Tallas ej: S, M, L"
                autoComplete="nope"
                onChange={(e) =>
                  setDatosCliente({
                    ...datosCliente,
                    tallas: e.target.value,
                  })
                }
              />
              <Form.Select
                label="Estado"
                options={[
                  { key: "false", text: "Pendiente", value: false },
                  { key: "true", text: "Entregado", value: true },
                ]}
                placeholder="Seleccionar estado"
                required
                defaultValue={false}
                autoComplete="nope"
                onChange={(e, { value }) =>
                  setDatosCliente({
                    ...datosCliente,
                    estado: value,
                  })
                }
              />
              <Grid>
                <Grid.Column textAlign="center">
                  <Button type="submit" onClick={handleFormSubmit}>
                    Añadir cliente
                  </Button>
                </Grid.Column>
              </Grid>
              <br />
              <br />
              <br />
            </Form>
          </Grid.Column>
        </Grid>
      </>
    );
  } else {
    return <Navigate to="/login" />;
  }
};

export default AddCliente;
