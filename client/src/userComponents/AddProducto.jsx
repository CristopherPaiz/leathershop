import React, { useEffect, useState, useContext } from "react";
import { Header, Icon, Form, Button, Grid, Label } from "semantic-ui-react";
import { Navigate, useNavigate } from "react-router-dom";
import API_URL from "../config.js";
import toast, { Toaster } from "react-hot-toast";
import { contexto } from "../context/ContextProvider";

const cloudinaryUploadUrl =
  "https://api.cloudinary.com/v1_1/dbkfiarmr/image/upload";
const AddProducto = () => {
  const { loggedIn, usuario } = useContext(contexto);
  const [datosCosmetico, setDatosCosmetico] = useState({
    apartados: 0,
    cantidadTotal: 0,
  });
  const [imagenes, setImagenes] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [showLoadingToast, setShowLoadingToast] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [valorInicial, setValorInicial] = useState(0);

  const navigate = useNavigate();

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      const response = await fetch(cloudinaryUploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
    }
  };

  const handleFormSubmit = async () => {
    try {
      setLoadingImages(true);
      setShowLoadingToast(true);
      // Upload each image to Cloudinary and get the URLs
      const uploadedImages = await Promise.all(
        imagenes.map((file) => uploadImageToCloudinary(file))
      );
      // Format the data including the uploaded image URLs
      const formattedData = {
        ...datosCosmetico,
        cantidadTotal: Number(datosCosmetico.cantidadTotal),
        apartados: Number(datosCosmetico.apartados),
        especificaciones: datosCosmetico.especificaciones,
        producto: datosCosmetico.producto,
        estado: datosCosmetico.estado,
        categoria: selectedCategoriaId,
        imagen: uploadedImages.map((url) => url), // Adding the uploaded image URLs to the data
      };

      const response = await fetch(`${API_URL}/cosmeticos/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
        credentials: "include",
      });

      if (response.ok) {
        setLoadingImages(false);
        setShowLoadingToast(false);

        // Show a success toast if the client was added successfully
        toast.success("Cosmetico añadido correctamente");

        //esperamos 2 segundos
        await new Promise((resolve) => setTimeout(resolve, 2000));
        navigate("/user");
      } else {
        // Show an error toast if there was an issue adding the client
        setLoadingImages(false);
        setShowLoadingToast(false);
        toast.error("Error al añadir el Cosmetico");
      }
    } catch (error) {
      setLoadingImages(false);
      setShowLoadingToast(false);
      toast.error("Error al añadir el Cosmetico", error);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImagenes([...imagenes, ...files]);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...imagenes];
    newImages.splice(index, 1);
    setImagenes(newImages);
  };

  useEffect(() => {
    getCategoria();
    // Muestra el toast "Cargando imágenes" cuando se están subiendo las imágenes
    if (showLoadingToast) {
      toast.loading("Cargando imágenes...", {
        duration: 2000, // Duración del toast en milisegundos
        onClose: () => setShowLoadingToast(false), // Se ejecutará cuando el toast se cierre
      });
    }
  }, [showLoadingToast]);

  const [selectedCategoriaId, setSelectedCategoriaId] = useState();

  // Paso 4: Crear una función para manejar el cambio de la categoría en el Dropdown
  const handleCategoriaChange = (e, { value }) => {
    setSelectedCategoriaId(value);
  };

  const listaCategorias = categorias?.map((categoria) => ({
    key: categoria._id,
    text: categoria.nombre,
    value: categoria._id, // Usamos el _id como valor del Dropdown para filtrar por categoría
  }));

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

  if (
    (loggedIn && usuario.rol === "Admin") ||
    (loggedIn && usuario.rol === "Moderator")
  ) {
    return (
      <>
        <Toaster />{" "}
        <Header as="h2" icon textAlign="center">
          <Icon name="add square" />
          <Header.Content>Añadir Producto</Header.Content>
        </Header>
        <Grid centered style={{ width: "100vw", margin: "0 auto" }}>
          <Grid.Column mobile={15} tablet={8} computer={6}>
            <Form>
              <Form.Group widths="equal">
                <Form.Input
                  label="Nombre producto"
                  placeholder="Nombre"
                  required
                  autoComplete="nope"
                  onChange={(e) =>
                    setDatosCosmetico({
                      ...datosCosmetico,
                      producto: e.target.value,
                    })
                  }
                />
                <Form.Input
                  label="Cantidad Inicial"
                  placeholder="Cantidad Inicial"
                  autoComplete="nope"
                  defaultValue={valorInicial}
                  required
                  onChange={(e) =>
                    setDatosCosmetico({
                      ...datosCosmetico,
                      cantidadTotal: e.target.value,
                    })
                  }
                />
                <Form.Input
                  label="Apartados Inicial"
                  placeholder="Apartados Inicial"
                  autoComplete="nope"
                  defaultValue={valorInicial}
                  required
                  onChange={(e) =>
                    setDatosCosmetico({
                      ...datosCosmetico,
                      apartados: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.TextArea
                label="Especificaciones"
                placeholder="Especificaciones"
                autoComplete="nope"
                onChange={(e) =>
                  setDatosCosmetico({
                    ...datosCosmetico,
                    especificaciones: e.target.value,
                  })
                }
              />
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

              <Form.Field>
                <label>Imágenes</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
              </Form.Field>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  flexDirection: "row",
                }}
              >
                {imagenes.map((file, index) => (
                  <div key={index}>
                    <div
                      style={{
                        marginBottom: "10px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Previsualización ${index}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          margin: "2px",
                        }}
                      />
                      <Button
                        icon="remove"
                        color="red"
                        size="tiny"
                        onClick={() => handleRemoveImage(index)}
                        style={{
                          marginTop: "5px",
                          width: "70px",
                          textAlign: "center",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Grid>
                <Grid.Column textAlign="center">
                  <Button
                    type="submit"
                    color="green"
                    fluid
                    onClick={handleFormSubmit}
                  >
                    Añadir Producto
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

export default AddProducto;
