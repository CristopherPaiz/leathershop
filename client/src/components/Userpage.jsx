import React, { useContext } from "react";
import { contexto } from "../context/ContextProvider";
import { Navigate } from "react-router-dom";

const Userpage = () => {
  const usuario = useContext(contexto);
  if (
    usuario.CURRENT_USER === usuario.NORMAL_USER ||
    usuario.CURRENT_USER === usuario.ADMIN_USER
  ) {
    return <div>UserPAGE</div>;
  } else {
    return <Navigate to={"/"} />; // Redirect to homepage
  }
};

export default Userpage;
