import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "./components/Homepage.jsx";
import Userpage from "./components/Userpage.jsx";
import NotFoundpage from "./components/NotFoundpage.jsx";
import Adminpage from "./components/Adminpage.jsx";
import PublicElement from "./components/routes/PublicElement.jsx";
import UserElement from "./components/routes/UserElement.jsx";
import ContextProvider, { contexto } from "./context/ContextProvider.jsx";
import AdminElement from "./components/routes/AdminElement.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./components/pages/Login.jsx";
import VerCliente from "./adminComponents/VerCliente.jsx";
import AddCliente from "./adminComponents/AddCliente.jsx";
import AddChumpa from "./adminComponents/AddChumpa.jsx";
import VerProducto from "./userComponents/VerProducto.jsx";
import AddProducto from "./userComponents/AddProducto.jsx";
import AddProductoCompra from "./userComponents/AddProductoCompra.jsx";
import ProductoHistorial from "./userComponents/ProductoHistorial.jsx";
import ReporteProducto from "./userComponents/ReporteProducto.jsx";
import "./userComponents/AddProductoCompraCSS.css";
import EliminarChumpa from "./adminComponents/EliminarChumpa.jsx";

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
          path="/user/verProducto/:id"
          element={
            <UserElement>
              <VerProducto />
            </UserElement>
          }
        />
        <Route
          path="/user/addProducto"
          element={
            <UserElement>
              <AddProducto />
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
        <Route
          path="/admin/deleteChumpa"
          element={
            <AdminElement>
              <EliminarChumpa />
            </AdminElement>
          }
        />
        <Route
          path="/admin/addChumpa"
          element={
            <AdminElement>
              <AddChumpa />
            </AdminElement>
          }
        />
        <Route
          path="/user/addProductoCompra"
          element={
            <AdminElement>
              <AddProductoCompra />
            </AdminElement>
          }
        />
        <Route
          path="/user/ProductoHistorial"
          element={
            <AdminElement>
              <ProductoHistorial />
            </AdminElement>
          }
        />
        <Route
          path="/user/ProductoReporte"
          element={
            <AdminElement>
              <ReporteProducto />
            </AdminElement>
          }
        />

        <Route path="*" element={<NotFoundpage />} />
      </Routes>
    </ContextProvider>
  );
};

export default App;
