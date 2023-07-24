import React, { useContext, useState } from "react";
import { Button, Form, Grid, Header, Image, Segment } from "semantic-ui-react";
import { contexto } from "../../context/ContextProvider";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const { fetchUser, loggedIn } = useContext(contexto);
  const navigate = useNavigate();

  const obtenerTipoUsuario = async () => {
    const respuesta = await fetchUser(nombreUsuario, password);
    if (respuesta === "Admin") {
      navigate("/admin");
    } else if (respuesta === "Moderator") {
      navigate("/user");
    } else {
      toast.error(respuesta);
    }
  };

  //aqui solo escuchamos los cambios de los inputs de usuario
  const handleInputChangeUser = (event) => {
    setNombreUsuario(event.target.value);
  };

  //aqui solo escuchamos los cambios de los inputs de password
  const handleInputChangePassword = (event) => {
    setPassword(event.target.value);
  };

  if (loggedIn) {
    navigate("/");
  } else {
    return (
      <>
        <Toaster />

        <Grid
          textAlign="center"
          style={{ height: "85vh" }}
          verticalAlign="middle"
        >
          <Grid.Column
            style={{ minWidth: 200, maxWidth: 400, margin: "0 40px" }}
          >
            <Header as="h2" color="teal" textAlign="center">
              <Image src="https://react.semantic-ui.com/logo.png" /> Inicia
              Sesión
            </Header>
            <Form size="large">
              <Segment>
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder={"Nombre de usuario"}
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
  }
};

export default Login;
