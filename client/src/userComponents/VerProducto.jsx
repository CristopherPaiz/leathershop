import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  Header,
  Icon,
  Form,
  Button,
  Grid,
  Label,
  Modal,
} from "semantic-ui-react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import API_URL from "../config.js";
import toast, { Toaster } from "react-hot-toast";
import { contexto } from "../context/ContextProvider";
import ImageViewer from "react-simple-image-viewer";

const VerProducto = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loggedIn, usuario } = useContext(contexto);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  if (!location.state) {
    return <Navigate to={"/"} />;
  }
  const { cosmetico } = location.state;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setConfirmDelete(false);
    handleModalClose(); // Cerramos el modal después de cancelar.
  };

  // Paso 1: Agregar estado para seguir los datos actualizados del cliente
  const [datosCosmeticoActualizados, setDatosCosmeticoActualizados] = useState({
    ...cosmetico,
  });

  // Paso 2: Función para manejar el envío del formulario y actualizar los datos
  const handleFormSubmit = async () => {
    console.log(datosCosmeticoActualizados);
    try {
      const response = await fetch(`${API_URL}/cliente/update/${cliente._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosClienteActualizados),
        credentials: "include", // Asegúrate de incluir esta opción
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

  const handleDeleteCliente = async () => {
    setConfirmDelete(true);
    if (confirmDelete) {
      try {
        const response = await fetch(
          `${API_URL}/cliente/delete/${cliente._id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!response.ok) {
          console.error("Error al eliminar el cliente");
        } else {
          // Manejar el escenario de éxito si es necesario
          toast.success("Cliente eliminado exitosamente");

          handleModalClose();
          // Esperar 2 segundos utilizando setTimeout
          await new Promise((resolve) => setTimeout(resolve, 10));

          navigate("/admin");
        }
      } catch (error) {
        console.error("Error al eliminar el cliente", error);
      }
    }
  };

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  if (
    (loggedIn && usuario.rol === "Admin") ||
    (loggedIn && usuario.rol === "Moderator")
  ) {
    return (
      <>
        <Modal open={modalOpen} onClose={handleModalClose} size="small">
          <Modal.Header>Confirmar Eliminación</Modal.Header>
          <Modal.Content>
            <p>¿Está seguro de que desea eliminar al producto?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button negative onClick={handleDeleteCliente}>
              Sí, eliminar
            </Button>
            <Button onClick={handleDeleteCancel}>No, cancelar</Button>
          </Modal.Actions>
        </Modal>
        <Toaster />{" "}
        <Header as="h2" icon textAlign="center">
          <Icon name="user" circular />
          <Header.Content>Detalle del Producto</Header.Content>
        </Header>
        <Grid centered style={{ width: "100vw", margin: "0 auto" }}>
          <Grid.Column mobile={14} tablet={8} computer={6}>
            <Form>
              <Form.Group widths="equal">
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
              <Form.Group widths="equal">
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
              <Form.Group widths="equal">
                <Form.Input
                  label="Precio"
                  type="number"
                  placeholder="0.00"
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
                  defaultValue={cliente?.anticipo ?? ""}
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
                defaultValue={cliente?.saldo ?? ""}
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
              <div>
                {cliente?.imagen?.map((src, index) => (
                  <img
                    src={src}
                    onClick={() => openImageViewer(index)}
                    width="100"
                    key={index}
                    style={{
                      margin: "2px",
                      border: "1px solid #000",
                    }}
                    alt=""
                  />
                ))}

                {isViewerOpen && (
                  <ImageViewer
                    src={cliente?.imagen}
                    currentIndex={currentImage}
                    disableScroll={false}
                    closeOnClickOutside={true}
                    onClose={closeImageViewer}
                  />
                )}
              </div>
              <Grid>
                <Grid.Column textAlign="center">
                  <br />
                  <Button
                    type="submit"
                    color="green"
                    onClick={handleFormSubmit}
                  >
                    Actualizar Datos
                  </Button>
                  <Button type="button" color="red" onClick={handleModalOpen}>
                    Eliminar Cliente
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

export default VerProducto;
