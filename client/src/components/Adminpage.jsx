import React, { useContext } from "react";
import { contexto } from "../context/ContextProvider";

const Adminpage = () => {
  const usuario = useContext(contexto);
  if (usuario.CURRENT_USER === usuario.ADMIN_USER) {
    return <div>AdminPAGE</div>;
  } else {
    return (
      <div>
        <h3>
          No tienes acceso a este nivel, actualmente eres:
          <b>{usuario.CURRENT_USER}</b>
        </h3>
      </div>
    );
  }
};
export default Adminpage;
