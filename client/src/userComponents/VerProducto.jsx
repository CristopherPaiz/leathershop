import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  Header,
  Form,
  Button,
  Grid,
  Label,
  Modal,
  Image,
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
  const [categorias, setCategorias] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  if (!location.state) {
    return <Navigate to={"/"} />;
  }
  const { cosmetico } = location.state;
  const [apartados, setApartados] = useState(cosmetico?.apartados);

  // Paso 1: Agregar estado para seguir los datos actualizados del cliente
  const [datosCosmeticoActualizados, setDatosCosmeticoActualizados] = useState({
    ...cosmetico,
  });

  // Step 1: Remove the second argument from setApartados
  const handleApartadosChange = (newValue) => {
    setApartados(newValue);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getCategoria();
    // Step 2: Move the side effect code here
    setDatosCosmeticoActualizados((prevData) => ({
      ...prevData,
      apartados: apartados,
      cantidadTotal: cosmetico.cantidadTotal,
    }));
  }, [apartados, cosmetico.cantidadTotal]);

  // Paso 2: Función para manejar el envío del formulario y actualizar los datos
  const handleFormSubmit = async () => {
    try {
      const response = await fetch(
        `${API_URL}/cosmeticos/update/${cosmetico._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...datosCosmeticoActualizados,
            categoria: selectedCategoriaId, // Usamos el ID de la categoría seleccionada
          }),
          credentials: "include", // Asegúrate de incluir esta opción
        }
      );

      if (!response.ok) {
        // Manejar escenarios de error si es necesario
        console.error("Error al actualizar los datos del cosmetico");
      } else {
        // Manejar el escenario de éxito si es necesario
        toast.success("Datos del cosmetico actualizados exitosamente", {
          position: "bottom-center",
        });
      }
    } catch (error) {
      console.error("Error al actualizar los datos del cosmetico", error);
    }
  };

  const getCategoria = async () => {
    try {
      const response = await fetch(`${API_URL}/cosmeticos/categorias`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        toast.error("Error al obtener la lista de categorías");
        throw new Error("Error al obtener la lista de categorías");
      }

      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      toast.error("Error al obtener la lista de categorías");
      console.error("Error al obtener la lista de categorías:", error);
    }
  };

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

  const handleDeleteCosmetico = async () => {
    setConfirmDelete(true);
    if (confirmDelete) {
      try {
        const response = await fetch(
          `${API_URL}/cliente/delete/${cosmetico._id}`,
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

  // Paso 3: Crear estado para manejar la categoría seleccionada por su ID
  const [selectedCategoriaId, setSelectedCategoriaId] = useState(
    cosmetico?.categoria
  );

  // Paso 4: Crear una función para manejar el cambio de la categoría en el Dropdown
  const handleCategoriaChange = (e, { value }) => {
    setSelectedCategoriaId(value);
  };

  const listaCategorias = categorias?.map((categoria) => ({
    key: categoria._id,
    text: categoria.nombre,
    value: categoria._id, // Usamos el _id como valor del Dropdown para filtrar por categoría
  }));

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
            <Button negative onClick={handleDeleteCosmetico}>
              Sí, eliminar
            </Button>
            <Button onClick={handleDeleteCancel}>No, cancelar</Button>
          </Modal.Actions>
        </Modal>
        <Toaster />{" "}
        <Header as="h2" icon textAlign="center">
          <Image src={cosmetico.imagen[0]} size="massive" circular />
          <Header.Content>{cosmetico?.producto}</Header.Content>
        </Header>
        <Header as="h2" icon textAlign="center">
          <Header.Content
            style={{
              padding: "5px",
              borderRadius: "5px",
              backgroundColor: "#d0e0e3",
              width: "250px",
              margin: "4px auto",
            }}
          >
            Disponible: {cosmetico?.cantidadTotal - apartados}
          </Header.Content>
          <Header.Content
            style={{
              padding: "5px",
              borderRadius: "5px",
              backgroundColor: "#ffe599",
              width: "250px",
              margin: "4px auto",
            }}
          >
            Apartados: {apartados}
          </Header.Content>
        </Header>
        <Header
          style={{
            width: "300px",
            display: "block",
            margin: "0 auto",
            borderRadius: "10px",
            border: "1px solid #b6d7a8",
            backgroundColor: "#d9ead3",
          }}
        >
          <Grid centered style={{ margin: "1px", padding: "10px" }}>
            <span style={{ marginBottom: "10px" }}>Apartar producto</span>
            <Button.Group>
              <Button
                icon="minus"
                color="red"
                onClick={() =>
                  apartados < 1
                    ? handleApartadosChange(0)
                    : handleApartadosChange(apartados - 1)
                }
              />
              <Label
                basic
                style={{
                  margin: "0 3px",
                  padding: "10PX",
                  fontSize: "30px",
                  backgroundColor: "snow",
                }}
              >
                {apartados}
              </Label>
              <Button
                icon="plus"
                color="green"
                onClick={() =>
                  apartados > cosmetico?.cantidadTotal - 1
                    ? handleApartadosChange(cosmetico?.cantidadTotal)
                    : handleApartadosChange(apartados + 1)
                }
              />
            </Button.Group>
          </Grid>
        </Header>
        <Grid centered style={{ width: "100vw", margin: "0 auto" }}>
          <Grid.Column mobile={14} tablet={8} computer={6}>
            <Form>
              <Form.Group widths="equal">
                <Form.Input
                  label="Nombre del producto"
                  placeholder="Nombre del producto"
                  required
                  // defaultValue={cosmetico?.producto ?? ""}
                  defaultValue={cosmetico?.producto} // Asigna el valor del estado al input
                  onChange={(e) =>
                    setDatosCosmeticoActualizados({
                      ...datosCosmeticoActualizados,
                      producto: e.target.value,
                    })
                  }
                  autoComplete="nope"
                />
                <Form.TextArea
                  label="Especificaciones"
                  placeholder="Especificaciones del producto"
                  // defaultValue={cosmetico?.especificaciones ?? ""}
                  defaultValue={cosmetico?.especificaciones} // Asigna el valor del estado al input
                  onChange={(e) =>
                    setDatosCosmeticoActualizados({
                      ...datosCosmeticoActualizados,
                      especificaciones: e.target.value,
                    })
                  } // Maneja el cambio del input
                  autoComplete="nope"
                />
              </Form.Group>

              <Form.Select
                label="Categoría"
                options={listaCategorias}
                placeholder="Seleccionar estado"
                required
                // defaultValue={cosmetico?.categoria ?? ""}
                defaultValue={selectedCategoriaId}
                onChange={handleCategoriaChange}
                autoComplete="nope"
              />
              <div>
                {cosmetico?.imagen?.map((src, index) => (
                  <img
                    src={src}
                    onClick={() => openImageViewer(index)}
                    width="100px"
                    height="100px"
                    key={index}
                    style={{
                      margin: "2px",
                      border: "1px solid #000",
                      objectFit: "contain",
                    }}
                    alt=""
                  />
                ))}

                {isViewerOpen && (
                  <ImageViewer
                    src={cosmetico?.imagen}
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
                    Actualizar
                  </Button>
                  <Button type="button" color="red" onClick={handleModalOpen}>
                    Eliminar Producto
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
