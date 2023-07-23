import React, { createContext, useEffect, useState } from "react";
import API_URL from "../config.js";
import toast from "react-hot-toast";

export const contexto = createContext();

const ContextProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(); //setear el tipo de usuario activo

  const fetchUser = async (username, password) => {
    console.log(username, password);
    try {
      const response = await fetch(`${API_URL}/user/getbyusername`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        // Si la respuesta no es exitosa, obtenemos el mensaje de error del servidor
        const errorData = await response.json();
        return errorData.message;
      }

      const user = await response.json();

      if (!user) {
        setUsuario("Public");
        return null;
      } else {
        setUsuario(user.rol);
        return null;
      }
    } catch (error) {
      console.log("Error en la solicitud:", error.message);
      return null;
    }
  };

  const USER_TYPES = {
    PUBLIC: "Public",
    MODERATOR_USER: "Moderator",
    ADMIN_USER: "Admin",
  };

  return (
    <contexto.Provider value={{ ...USER_TYPES, usuario, fetchUser }}>
      {children}
    </contexto.Provider>
  );
};

export default ContextProvider;
