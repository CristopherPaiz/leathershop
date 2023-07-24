import React, { useEffect, useState } from "react";
import { Header, Icon, Form, Button, Grid, Label } from "semantic-ui-react";
import { useLocation } from "react-router-dom";
import API_URL from "../config.js";
import toast, { Toaster } from "react-hot-toast";

const VerCliente = () => {
  const location = useLocation();
  const { cliente } = location.state;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Paso 1: Agregar estado para seguir los datos actualizados del cliente
  const [datosClienteActualizados, setDatosClienteActualizados] = useState({
    ...cliente,
  });

  // Paso 2: Función para manejar el envío del formulario y actualizar los datos
  const handleFormSubmit = async () => {
    console.log(datosClienteActualizados);
    try {
      const response = await fetch(`${API_URL}/cliente/update/${cliente._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosClienteActualizados),
      });

      if (!response.ok) {
        // Manejar escenarios de error si es necesario
        console.error("Error al actualizar los datos del cliente");
      } else {
        // Manejar el escenario de éxito si es necesario
        toast.success("Datos del cliente actualizados exitosamente");
      }
    } catch (error) {
      console.error("Error al actualizar los datos del cliente", error);
    }
  };

  const formatfecha = (fechaRecibo) => {
    const date = new Date(fechaRecibo);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
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
            <Form.Group widths="equal" stackable>
              <Form.Input
                label="Nombre"
                placeholder="Nombre"
                required
                defaultValue={cliente?.nombre ?? ""}
                onChange={(e) =>
                  setDatosClienteActualizados({
                    ...datosClienteActualizados,
                    nombre: e.target.value,
                  })
                }
                autoComplete="nope"
              />
              <Form.Input
                label="Apellido"
                placeholder="Apellido"
                required
                defaultValue={cliente?.apellido ?? ""}
                onChange={(e) =>
                  setDatosClienteActualizados({
                    ...datosClienteActualizados,
                    apellido: e.target.value,
                  })
                }
                autoComplete="nope"
              />
            </Form.Group>
            <Form.Group widths="equal" stackable>
              <Form.Input
                label="Fecha de Recibo"
                type="date"
                required
                defaultValue={formatfecha(cliente?.fechaRecibo ?? "")}
                autoComplete="nope"
                onChange={(e) =>
                  setDatosClienteActualizados({
                    ...datosClienteActualizados,
                    fechaRecibo: e.target.value,
                  })
                }
              />
              <Form.Input
                label="Fecha de Entrega"
                type="date"
                required
                defaultValue={formatfecha(cliente?.fechaEntrega ?? "")}
                autoComplete="nope"
                onChange={(e) =>
                  setDatosClienteActualizados({
                    ...datosClienteActualizados,
                    fechaEntrega: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Input
              label="Número de Teléfono"
              type="tel"
              required
              defaultValue={cliente?.numeroTel ?? ""}
              autoComplete="nope"
              onChange={(e) =>
                setDatosClienteActualizados({
                  ...datosClienteActualizados,
                  numeroTel: e.target.value,
                })
              }
            />
            <Form.Input
              label="Producto"
              placeholder="Producto"
              required
              defaultValue={cliente?.producto ?? ""}
              autoComplete="nope"
              onChange={(e) =>
                setDatosClienteActualizados({
                  ...datosClienteActualizados,
                  producto: e.target.value,
                })
              }
            />
            <Form.Group widths="equal" stackable>
              <Form.Input
                label="Precio"
                type="number"
                placeholder="0.00"
                step="0.01"
                defaultValue={cliente?.precio ?? ""}
                autoComplete="nope"
                required
                onChange={(e) =>
                  setDatosClienteActualizados({
                    ...datosClienteActualizados,
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
                step="0.01"
                defaultValue={cliente?.anticipo ?? ""}
                required
                autoComplete="nope"
                onChange={(e) =>
                  setDatosClienteActualizados({
                    ...datosClienteActualizados,
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
              step="0.01"
              defaultValue={cliente?.saldo ?? ""}
              required
              autoComplete="nope"
              onChange={(e) =>
                setDatosClienteActualizados({
                  ...datosClienteActualizados,
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
              defaultValue={cliente?.especificaciones ?? ""}
              autoComplete="nope"
              onChange={(e) =>
                setDatosClienteActualizados({
                  ...datosClienteActualizados,
                  especificaciones: e.target.value,
                })
              }
            />
            <Form.TextArea
              label="Medidas"
              placeholder="Medidas"
              defaultValue={cliente?.medidas ?? ""}
              onChange={(e) =>
                setDatosClienteActualizados({
                  ...datosClienteActualizados,
                  medidas: e.target.value,
                })
              }
            />
            <Form.Input
              label="Trabajador"
              placeholder="Trabajador"
              defaultValue={cliente?.trabajador ?? ""}
              autoComplete="nope"
              onChange={(e) =>
                setDatosClienteActualizados({
                  ...datosClienteActualizados,
                  trabajador: e.target.value,
                })
              }
            />
            <Form.TextArea
              label="Descripción"
              placeholder="Descripción"
              defaultValue={cliente?.descripcion ?? ""}
              autoComplete="nope"
              onChange={(e) =>
                setDatosClienteActualizados({
                  ...datosClienteActualizados,
                  descripcion: e.target.value,
                })
              }
            />
            <Form.TextArea
              label="Observaciones"
              placeholder="Observaciones"
              defaultValue={cliente?.observaciones ?? ""}
              autoComplete="nope"
              onChange={(e) =>
                setDatosClienteActualizados({
                  ...datosClienteActualizados,
                  observaciones: e.target.value,
                })
              }
            />
            <Form.TextArea
              label="Recomendaciones"
              placeholder="Recomendaciones"
              defaultValue={cliente?.recomendaciones ?? ""}
              autoComplete="nope"
              onChange={(e) =>
                setDatosClienteActualizados({
                  ...datosClienteActualizados,
                  recomendaciones: e.target.value,
                })
              }
            />
            <Form.Input
              label="Colores"
              placeholder="Colores"
              defaultValue={cliente?.colores[0] ?? ""}
              autoComplete="nope"
              onChange={(e) =>
                setDatosClienteActualizados({
                  ...datosClienteActualizados,
                  colores: [e.target.value],
                })
              }
            />
            <Form.Input
              label="Tallas"
              placeholder="Tallas ej: S, M, L"
              defaultValue={cliente?.tallas[0] ?? ""}
              autoComplete="nope"
              onChange={(e) =>
                setDatosClienteActualizados({
                  ...datosClienteActualizados,
                  tallas: [e.target.value],
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
              defaultValue={cliente?.estado ?? ""}
              autoComplete="nope"
              onChange={(e, { value }) =>
                setDatosClienteActualizados({
                  ...datosClienteActualizados,
                  estado: value,
                })
              }
            />
            <Grid>
              <Grid.Column textAlign="center">
                <Button type="submit" onClick={handleFormSubmit}>
                  Actualizar Datos
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
};

export default VerCliente;
