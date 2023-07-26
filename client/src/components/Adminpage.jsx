import React, { useContext, useState, useEffect } from "react";
import { contexto } from "../context/ContextProvider";
import { Navigate, Link } from "react-router-dom";
import { Header, Image, Button, Icon } from "semantic-ui-react";
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
          <Button
            key={4}
            as={Link}
            toggle
            style={{ margin: "3px", width: "170px" }}
            to={`/admin/addcliente`}
          >
            <Icon name="add user" />
            Añadir cliente
          </Button>
          <Button
            key={5}
            as={Link}
            toggle
            style={{ margin: "3px", width: "170px" }}
            to={`/admin/addcliente`}
          >
            <Icon name="add square" />
            Añadir producto
          </Button>
        </div>
        {pestanaActiva === 1 ? <PorEntregar /> : null}
        {pestanaActiva === 2 ? <Entregados /> : null}
        {pestanaActiva === 3 ? <BuscarCliente /> : null}
      </div>
    );
  } else {
    return <Navigate to={"/login"} />; // Redirige a la página de inicio
  }
};

export default Adminpage;
