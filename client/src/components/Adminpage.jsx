import React, { useContext, useState, useEffect } from "react";
import { contexto } from "../context/ContextProvider";
import { Navigate } from "react-router-dom";
import { Header, Image, Button, Container, Icon } from "semantic-ui-react";
import PorEntregar from "../adminComponents/PorEntregar";
import Entregados from "../adminComponents/Entregados";
import BuscarCliente from "../adminComponents/BuscarCliente";

const Adminpage = () => {
  const { loggedIn, usuario } = useContext(contexto);
  const [pestanaActiva, setPestanaActiva] = useState(1);

  useEffect(() => {
    const storedPestanaActiva = localStorage.getItem("pestanaActiva");
    if (storedPestanaActiva) {
      setPestanaActiva(parseInt(storedPestanaActiva));
    }
  }, []);

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

  const cambiarPestana = (numeroPestana) => {
    setPestanaActiva(numeroPestana);
    localStorage.setItem("pestanaActiva", numeroPestana);
  };

  if (loggedIn && usuario.rol === "Admin") {
    const botones = [
      { numero: 1, texto: "Por entregar", icono: "calendar alternate" },
      { numero: 2, texto: "Entregados", icono: "handshake" },
      { numero: 3, texto: "Buscar cliente", icono: "address book" },
      { numero: 4, texto: "Añadir cliente", icono: "add user" },
      { numero: 5, texto: "Añadir producto", icono: "add square" },
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
              active={pestanaActiva === boton.numero}
              toggle
              onClick={() => cambiarPestana(boton.numero)}
              style={{ margin: "3px", width: "170px" }}
            >
              <Icon name={boton.icono} />
              {boton.texto}
            </Button>
          ))}
        </div>
        {pestanaActiva === 1 ? <PorEntregar /> : null}
        {pestanaActiva === 2 ? <Entregados /> : null}
        {pestanaActiva === 3 ? <BuscarCliente /> : null}
        {pestanaActiva === 4 ? <h1>Add cliente</h1> : null}
        {pestanaActiva === 5 ? <h1>Add Producto</h1> : null}
      </div>
    );
  } else {
    return <Navigate to={"/"} />; // Redirige a la página de inicio
  }
};

export default Adminpage;
