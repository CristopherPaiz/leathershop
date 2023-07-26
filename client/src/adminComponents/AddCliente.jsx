import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { contexto } from "../context/ContextProvider";

const AddCliente = () => {
  const { loggedIn, usuario } = useContext(contexto);
  if (loggedIn && usuario.rol === "Admin") {
    return (
      <div>
        <h1>Jolines</h1>
      </div>
    );
  } else {
    return <Navigate to="/login" />;
  }
};

export default AddCliente;
