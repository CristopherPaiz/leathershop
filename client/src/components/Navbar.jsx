import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { contexto } from "../context/ContextProvider";

const Navbar = () => {
  const USER_TYPES = useContext(contexto);
  const { usuario } = useContext(contexto);

  if (usuario === undefined) {
    return null;
  }

  return usuario === USER_TYPES.PUBLIC ? null : (
    <>
      <Menu>
        {/* Condicional para ocultar la pestaña de usuario */}
        {usuario === USER_TYPES.MODERATOR_USER ||
        usuario === USER_TYPES.ADMIN_USER ? (
          <>
            <Menu.Item as={Link} to="/home" name="home" />
            <Menu.Item as={Link} position="right" to="/user" name="User" />
          </>
        ) : null}

        {/* Condicional para ocultar la pestaña de admin */}
        {usuario === USER_TYPES.ADMIN_USER ? (
          <Menu.Item as={Link} to="/admin" name="Admin" />
        ) : null}
      </Menu>
    </>
  );
  // }
};

export default Navbar;
