import React from "react";
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
import Login from "./components/pages/Login.jsx";
import VerCliente from "./adminComponents/VerCliente.jsx";
import AddCliente from "./adminComponents/AddCliente.jsx";

const App = () => {
  return (
    <ContextProvider>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <UserElement>
              <Homepage />
            </UserElement>
          }
        />
        <Route
          path="/login"
          element={
            <PublicElement>
              <Login />
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
        <Route
          path="/admin/vercliente/:id"
          element={
            <AdminElement>
              <VerCliente />
            </AdminElement>
          }
        />
        <Route
          path="/admin/addcliente"
          element={
            <AdminElement>
              <AddCliente />
            </AdminElement>
          }
        />
        <Route path="*" element={<NotFoundpage />} />
      </Routes>
    </ContextProvider>
  );
};

export default App;
