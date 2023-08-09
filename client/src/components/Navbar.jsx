import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Button } from "semantic-ui-react";
import { contexto } from "../context/ContextProvider";

const Navbar = () => {
  const USER_TYPES = useContext(contexto);
  const { usuario, setUsuario, loggedIn, setLoggedIn } = useContext(contexto);
  const navigate = useNavigate();

  const logout = async () => {
    if (loggedIn) {
      setLoggedIn(false);
      setUsuario(null);
      localStorage.removeItem("usuarioLS");
      localStorage.removeItem("loggedLS");
      localStorage.removeItem("demasdatosLS");
      navigate("/");
    }
  };

  if (usuario === null) {
    return (
      <>
        <Button
          floated="right"
          icon="user"
          as={Link}
          to="/login"
          style={{
            backgroundColor: "transparent",
            position: "absolute",
            right: "0",
          }}
        />
        <br />
        <br />
      </>
    );
  } else {
    return usuario.rol === USER_TYPES.PUBLIC ? (
      <>
        <Button
          floated="right"
          icon="user"
          as={Link}
          to="/login"
          style={{ backgroundColor: "transparent" }}
        />
        <br />
        <br />
      </>
    ) : (
      <>
        <Menu>
          {/* Condicional para ocultar la pestaña de usuario */}
          {usuario.rol === USER_TYPES.MODERATOR_USER ? (
            <>
              <Menu.Item as={Link} to="/" icon="home" />
              <Menu.Item
                as={Link}
                position="right"
                to="/user"
                name="Cosméticos"
                icon="diamond"
              />
              <Menu.Item as="a" onClick={logout} icon="sign-out" />
            </>
          ) : null}

          {/* Condicional para ocultar la pestaña de admin */}
          {usuario.rol === USER_TYPES.ADMIN_USER ? (
            <>
              <Menu.Item as={Link} to="/" icon="home" />
              <Menu.Item
                as={Link}
                position="right"
                to="/user"
                icon="diamond"
                name="Cosméticos"
              />
              <Menu.Item
                as={Link}
                to="/admin"
                name="Leathershop"
                icon="warehouse"
              />
              <Menu.Item as="a" onClick={logout} icon="sign-out" />
            </>
          ) : null}
        </Menu>
      </>
    );
  }
};

export default Navbar;
