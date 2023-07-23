import React, { useContext } from "react";
import { contexto } from "../context/ContextProvider";
import { Navigate } from "react-router-dom";

const Adminpage = () => {
  const USER_TYPES = useContext(contexto);
  const { usuario } = useContext(contexto);
  if (usuario === USER_TYPES.ADMIN_USER) {
    return <div>AdminPAGE</div>;
  } else {
    return <Navigate to={"/"} />; // Redirect to homepage
  }
};
export default Adminpage;
