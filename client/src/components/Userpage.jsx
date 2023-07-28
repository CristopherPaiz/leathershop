import React, { useContext, useState } from "react";
import { contexto } from "../context/ContextProvider";
import { Navigate, Link } from "react-router-dom";
import { Header, Image, Button, Icon } from "semantic-ui-react";
import VerProductos from "../userComponents/VerProductos";
import CategoriaProductos from "../userComponents/CategoriaProductos";

const Userpage = () => {
  const { loggedIn, usuario } = useContext(contexto);
  const [pestanaActivaUser, setPestanaActivaUser] = useState(1);

  //saludar
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

  const cambiarPestanauser = (numeroPestana) => {
    setPestanaActivaUser(numeroPestana);
    localStorage.setItem("pestanaActivauser", numeroPestana);
  };

  if (
    (loggedIn && usuario.rol === "Admin") ||
    (loggedIn && usuario.rol === "Moderator")
  ) {
    const botones = [
      { numero: 1, texto: "Productos", icono: "th" },
      { numero: 2, texto: "Categorías", icono: "tags" },
      { numero: 3, texto: "Buscar Producto", icono: "search" },
    ];

    return (
      <div>
        <Header as="h4" textAlign="center">
          <Image circular src={usuario.imagen} />¡{getSaludo(usuario.nombre)}!
        </Header>
        <div style={{ textAlign: "center" }}>
          {botones.map((boton) => (
            <Button
              key={boton.numero}
              active={pestanaActivaUser === boton.numero}
              toggle
              onClick={() => cambiarPestanauser(boton.numero)}
              style={{ margin: "3px", width: "170px" }}
            >
              <Icon name={boton.icono} />
              {boton.texto}
            </Button>
          ))}
        </div>
        {pestanaActivaUser === 1 ? <VerProductos /> : null}
        {pestanaActivaUser === 2 ? <CategoriaProductos /> : null}
        {pestanaActivaUser === 3 ? <h1>Pestaña3</h1> : null}
      </div>
    );
  } else {
    return <Navigate to={"/login"} />; // Redirige a la página de inicio
  }
};

export default Userpage;
