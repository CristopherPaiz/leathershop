import React, { createContext, useState } from "react";
import API_URL from "../config.js";
import md5 from "md5";

export const contexto = createContext();

const ContextProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null); // setear el tipo de usuario activo
  const [loggedIn, setLoggedIn] = useState(false); // indicar si el usuario ha iniciado sesión

  const fetchUser = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/user/getbyusername`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include", // Asegúrate de incluir esta opción
      });

      if (!response.ok) {
        // Si la respuesta no es exitosa, obtenemos el mensaje de error del servidor
        setUsuario({ rol: "Public" });
        setLoggedIn(false);
        const errorData = await response.json();
        return errorData.message;
      } else {
        const user = await response.json();

        if (!user) {
          setUsuario({ rol: "Public" });
          setLoggedIn(false);
          return "Public";
        } else {
          setLoggedIn(true);
          setUsuario(user);
          return user.rol;
        }
      }
    } catch (error) {
      console.log("Error en la solicitud:", error.message);
    }
  };

  const USER_TYPES = {
    PUBLIC: "Public",
    MODERATOR_USER: "Moderator",
    ADMIN_USER: "Admin",
  };

  return (
    <contexto.Provider
      value={{
        ...USER_TYPES,
        usuario,
        fetchUser,
        loggedIn,
        setLoggedIn,
        setUsuario,
      }}
    >
      {children}
    </contexto.Provider>
  );
};

export default ContextProvider;
