import React, { useEffect, useState, useContext } from "react";
import { Header, Icon, Form, Button, Grid, Label } from "semantic-ui-react";
import { Navigate, useNavigate } from "react-router-dom";
import API_URL from "../config.js";
import toast, { Toaster } from "react-hot-toast";
import { contexto } from "../context/ContextProvider";
import { fromBlob } from "image-resize-compress";

const cloudinaryUploadUrl =
  "https://api.cloudinary.com/v1_1/dbkfiarmr/image/upload";
const AddChumpa = () => {
  const { loggedIn, usuario } = useContext(contexto);
  const [datosChumpa, setdatosChumpa] = useState({});
  const [imagenes, setImagenes] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [showLoadingToast, setShowLoadingToast] = useState(false);

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
        ...datosChumpa,
        precio: Number(datosChumpa.precio),
        precioAnterior: Number(datosChumpa.precioAnterior),
        colores: datosChumpa.colores
          ? datosChumpa.colores.split(",").map((color) => color.trim())
          : [],
        tallas: datosChumpa.tallas
          ? datosChumpa.tallas.split(",").map((talla) => talla.trim())
          : [],
        imagen: uploadedImages.map((url) => url), // Adding the uploaded image URLs to the data
      };
      const response = await fetch(`${API_URL}/chumpas/add`, {
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
        toast.success("Producto añadido correctamente");

        //esperamos 2 segundos
        await new Promise((resolve) => setTimeout(resolve, 2000));
        navigate("/admin");
      } else {
        // Show an error toast if there was an issue adding the client
        setLoadingImages(false);
        setShowLoadingToast(false);
        toast.error("Error al añadir el producto");
      }
    } catch (error) {
      setLoadingImages(false);
      setShowLoadingToast(false);
      toast.error("Error al añadir el producto", error);
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);

    // Create an array to store the compressed images
    const compressedImages = [];

    for (const file of files) {
      // Compress the image using image-resize-compress library
      try {
        const compressedImage = await fromBlob(file, 80, 0, 0, "webp"); // Comprimir la imagen con calidad 80 y formato webp
        compressedImages.push(compressedImage);
      } catch (error) {
        console.error("Error compressing image:", error);
        // If there's an error in compression, add the original image
        compressedImages.push(file);
      }
    }

    // Set the compressed images to the state
    setImagenes([...imagenes, ...compressedImages]);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...imagenes];
    newImages.splice(index, 1);
    setImagenes(newImages);
  };

  useEffect(() => {
    // Muestra el toast "Cargando imágenes" cuando se están subiendo las imágenes
    if (showLoadingToast) {
      toast.loading("Cargando imágenes...", {
        duration: 2000, // Duración del toast en milisegundos
        onClose: () => setShowLoadingToast(false), // Se ejecutará cuando el toast se cierre
      });
    }
  }, [showLoadingToast]);

  if (loggedIn && usuario.rol === "Admin") {
    return (
      <>
        <Toaster />{" "}
        <Header as="h2" icon textAlign="center">
          <Icon name="suitcase" circular />
          <Header.Content>Añadir chumpa o producto</Header.Content>
        </Header>
        <Grid centered style={{ width: "100vw", margin: "0 auto" }}>
          <Grid.Column mobile={15} tablet={8} computer={6}>
            <Form>
              <Form.Group widths="equal">
                <Form.Input
                  label="Nombre"
                  placeholder="Nombre"
                  required
                  autoComplete="nope"
                  onChange={(e) =>
                    setdatosChumpa({
                      ...datosChumpa,
                      nombre: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group widths="equal"></Form.Group>
              <Form.Group widths="equal">
                <Form.Input
                  label="Precio"
                  type="number"
                  placeholder="0.00"
                  autoComplete="nope"
                  required
                  onChange={(e) =>
                    setdatosChumpa({
                      ...datosChumpa,
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
                  label="Precio Anterior"
                  type="number"
                  required
                  placeholder="0.00"
                  autoComplete="nope"
                  onChange={(e) =>
                    setdatosChumpa({
                      ...datosChumpa,
                      precioAnterior: e.target.value,
                    })
                  }
                >
                  <Label basic size="big">
                    Q
                  </Label>
                  <input />
                </Form.Input>
              </Form.Group>
              <Form.TextArea
                label="Descripción"
                placeholder="Descripción"
                required
                autoComplete="nope"
                onChange={(e) =>
                  setdatosChumpa({
                    ...datosChumpa,
                    descripcion: e.target.value,
                  })
                }
              />
              <Form.TextArea
                label="Especificaciones"
                placeholder="Especificaciones"
                autoComplete="nope"
                onChange={(e) =>
                  setdatosChumpa({
                    ...datosChumpa,
                    especificaciones: e.target.value,
                  })
                }
              />
              <Form.Input
                label="Colores"
                placeholder="Colores"
                autoComplete="nope"
                onChange={(e) =>
                  setdatosChumpa({
                    ...datosChumpa,
                    colores: e.target.value,
                  })
                }
              />
              <Form.Input
                label="Tallas"
                placeholder="Tallas ej: S, M, L"
                autoComplete="nope"
                onChange={(e) =>
                  setdatosChumpa({
                    ...datosChumpa,
                    tallas: e.target.value,
                  })
                }
              />
              <Form.Select
                label="Estado"
                options={[
                  { key: "false", text: "Habilitado", value: false },
                  { key: "true", text: "Deshabilitado", value: true },
                ]}
                placeholder="Seleccionar estado"
                required
                defaultValue={false}
                autoComplete="nope"
                onChange={(e, { value }) =>
                  setdatosChumpa({
                    ...datosChumpa,
                    estado: value,
                  })
                }
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
                    Añadir Chumpa o producto
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

export default AddChumpa;
