import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { contexto } from "../context/ContextProvider";

const Navbar = () => {
  const USER_TYPES = useContext(contexto);
  const { usuario, setUsuario, loggedIn, setLoggedIn } = useContext(contexto);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(usuario);
  }, [usuario]);

  const logout = async () => {
    if (loggedIn) {
      setLoggedIn(false);
      setUsuario(null);
      localStorage.removeItem("usuarioLS");
      localStorage.removeItem("loggedLS");
      navigate("/");
    }
  };

  if (usuario === null) {
    return (
      <Menu>
        <Menu.Item
          as={Link}
          position="right"
          to="/login"
          name="Iniciar Sesión"
        />
      </Menu>
    );
  } else {
    return usuario.rol === USER_TYPES.PUBLIC ? (
      <Menu>
        <Menu.Item
          as={Link}
          position="right"
          to="/login"
          name="Iniciar Sesión"
        />
      </Menu>
    ) : (
      <>
        <Menu>
          {/* Condicional para ocultar la pestaña de usuario */}
          {usuario.rol === USER_TYPES.MODERATOR_USER ? (
            <>
              <Menu.Item as={Link} to="/" name="home" />
              <Menu.Item as={Link} position="right" to="/user" name="User" />
              <Menu.Item as="a" onClick={logout} name="Salir" />
            </>
          ) : null}

          {/* Condicional para ocultar la pestaña de admin */}
          {usuario.rol === USER_TYPES.ADMIN_USER ? (
            <>
              <Menu.Item as={Link} to="/" name="home" />
              <Menu.Item as={Link} position="right" to="/user" name="User" />
              <Menu.Item as={Link} to="/admin" name="Admin" />
              <Menu.Item as="a" onClick={logout} name="Salir" />
            </>
          ) : null}
        </Menu>
      </>
    );
  }
};

export default Navbar;
