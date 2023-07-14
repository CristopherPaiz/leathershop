import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { contexto } from "../context/ContextProvider";

const Navbar = () => {
  const usuario = useContext(contexto);
  return (
    <Menu>
      <Menu.Item as={Link} to="/" name="home" />

      {/* Condicional para ocultar la pestaña de usuario */}
      {usuario.CURRENT_USER === usuario.NORMAL_USER ||
      usuario.CURRENT_USER === usuario.ADMIN_USER ? (
        <Menu.Item as={Link} position="right" to="/user" name="User" />
      ) : null}

      {/* Condicional para ocultar la pestaña de admin */}
      {usuario.CURRENT_USER === usuario.ADMIN_USER ? (
        <Menu.Item as={Link} to="/admin" name="Admin" />
      ) : null}
    </Menu>
  );
};

export default Navbar;
