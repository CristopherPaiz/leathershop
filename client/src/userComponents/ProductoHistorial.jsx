import React, { useEffect, useState, useContext } from "react";
import { Header, Icon, Form, Grid, Radio } from "semantic-ui-react";
import { Navigate } from "react-router-dom";
import API_URL from "../config.js";
import toast, { Toaster } from "react-hot-toast";
import { contexto } from "../context/ContextProvider";

const ProductoHistorial = () => {
  const [value, setValue] = useState("todos");
  const [loading, setLoading] = useState(true); // Estado para controlar la carga de datos

  const handleChangeState = (event, data) => {
    setValue(data.value);
  };

  //useEffect para controlar el value y determinar que tipo de historial se va a mostrar
  useEffect(() => {
    setLoading(true); // Habilitar el estado de carga
    if (value === "todos") {
      console.log("todos");
    } else if (value === "menor") {
      console.log("menor");
    } else if (value === "mayor") {
      console.log("mayor");
    }

    // Simulamos una solicitud de API con un retraso de 2 segundos
    setTimeout(() => {
      setLoading(false); // Deshabilitar el estado de carga después de 2 segundos
    }, 2000);
  }, [value]);

  const { loggedIn, usuario } = useContext(contexto);
  if (loggedIn && usuario.rol === "Admin") {
    return (
      <>
        <Toaster />
        <Header as="h2" icon textAlign="center">
          <Icon name="history" />
          <Header.Content>Historial de compras</Header.Content>
        </Header>
        <Grid centered style={{ margin: "20px" }}>
          <Grid.Column mobile={15} tablet={8} computer={6}>
            <Form>
              <Form.Field>
                <label>Primero seleccione el tipo:</label>
              </Form.Field>
            </Form>
          </Grid.Column>
          <Form>
            <Form.Field>
              <Radio
                label="Todos"
                name="radioGroup"
                value="todos"
                checked={value === "todos"}
                onChange={handleChangeState}
              />
              <span style={{ color: "transparent" }}>spa</span>
              <Radio
                label="Por Unidad"
                name="radioGroup"
                value="menor"
                checked={value === "menor"}
                onChange={handleChangeState}
              />
              <span style={{ color: "transparent" }}>spa</span>
              <Radio
                label="Por Mayoreo"
                name="radioGroup"
                value="mayor"
                checked={value === "mayor"}
                onChange={handleChangeState}
              />
            </Form.Field>
          </Form>
          {loading ? (
            <h1>Cargando...</h1>
          ) : (
            <>
              {value === "todos" && (
                <>
                  <h1>Todos</h1>
                </>
              )}
              {value === "menor" && (
                <>
                  <h1>Por unidad</h1>
                </>
              )}
              {value === "mayor" && (
                <>
                  <h1>Por Mayoreo</h1>
                </>
              )}
            </>
          )}
        </Grid>
      </>
    );
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProductoHistorial;
