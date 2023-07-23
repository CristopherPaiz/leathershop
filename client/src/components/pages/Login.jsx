import React, { useContext, useState } from "react";
import { Button, Form, Grid, Header, Image, Segment } from "semantic-ui-react";
import { contexto } from "../../context/ContextProvider";
import { Toaster, toast } from "react-hot-toast";

const Login = () => {
  const [nombreUsuario, setNombreUsuario] = useState(""); //para capturar el nombre de usuario
  const [password, setPassword] = useState(""); //para capturar el nombre de usuario
  const [error, setError] = useState(""); //para capturar el nombre de usuario

  const { fetchUser } = useContext(contexto);

  const obtenerTipoUsuario = async () => {
    const errores = await fetchUser(nombreUsuario, password);
    if (!errores === null) {
      toast.error(errores);
    }
  };

  const handleInputChangeUser = (event) => {
    setNombreUsuario(event.target.value);
  };

  const handleInputChangePassword = (event) => {
    setPassword(event.target.value);
  };

  return (
    <>
      <Toaster />

      <Grid
        textAlign="center"
        style={{ height: "85vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ minWidth: 200, maxWidth: 400, margin: "0 40px" }}>
          <Header as="h2" color="teal" textAlign="center">
            <Image src="https://react.semantic-ui.com/logo.png" /> Inicia Sesión
          </Header>
          <Form size="large">
            <Segment>
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="Nombre de usuario"
                value={nombreUsuario}
                onChange={handleInputChangeUser}
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Contraseña"
                type="password"
                onChange={handleInputChangePassword}
                value={password}
              />

              <Button
                color="teal"
                fluid
                size="large"
                onClick={obtenerTipoUsuario}
              >
                Iniciar Sesión
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    </>
  );
};

export default Login;
