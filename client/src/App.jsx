import React, { createContext } from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "./components/Homepage.jsx";
import Userpage from "./components/Userpage.jsx";
import NotFoundpage from "./components/NotFoundpage.jsx";
import Adminpage from "./components/Adminpage.jsx";
import PublicElement from "./components/routes/PublicElement.jsx";
import UserElement from "./components/routes/UserElement.jsx";
import ContextProvider from "./context/ContextProvider.jsx";
import AdminElement from "./components/routes/AdminElement.jsx";
import Navbar from "./components/Navbar.jsx";

const App = () => {
  return (
    <ContextProvider>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <PublicElement>
              <Homepage />
            </PublicElement>
          }
        />
        <Route
          path="/user"
          element={
            <UserElement>
              <Userpage />
            </UserElement>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminElement>
              <Adminpage />
            </AdminElement>
          }
        />
        <Route path="*" element={<NotFoundpage />} />
      </Routes>
    </ContextProvider>
  );
};

export default App;
