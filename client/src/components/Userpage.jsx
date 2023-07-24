import React, { useContext } from "react";
import { contexto } from "../context/ContextProvider";
import { Navigate } from "react-router-dom";
import { Header, Image, Button } from "semantic-ui-react";

const Userpage = () => {
  const { loggedIn, usuario } = useContext(contexto);
  const getSaludo = (nombre) => {
    const hora = new Date().getHours();

    if (hora >= 0 && hora < 12) {
      return `Buenos días, ${nombre}`;
    } else if (hora >= 12 && hora < 18) {
      return `Buenas tardes, ${nombre}`;
    } else {
      return `Buenas noches, ${nombre}`;
    }
  };

  if (
    (loggedIn && usuario.rol === "Admin") ||
    (loggedIn && usuario.rol === "Moderator")
  ) {
    return (
      <div>
        <Header as="h4" textAlign="center">
          <Image circular src={usuario.imagen} />¡{getSaludo(usuario.nombre)}!
        </Header>
        <h2>Esta es la página de usuario.</h2>
      </div>
    );
  } else {
    return <Navigate to={"/"} />; // Redirige a la página de inicio
  }
};

export default Userpage;
