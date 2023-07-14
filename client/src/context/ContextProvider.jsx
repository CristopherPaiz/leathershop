import React, { createContext } from "react";

export const contexto = createContext();

const ContextProvider = ({ children }) => {
  const USER_TYPES = {
    PUBLIC: "Public",
    NORMAL_USER: "Normal",
    ADMIN_USER: "Admin",
    CURRENT_USER: "Admin",
  };
  return <contexto.Provider value={USER_TYPES}>{children}</contexto.Provider>;
};

export default ContextProvider;
