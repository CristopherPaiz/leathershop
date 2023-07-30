import React, { useEffect, useState } from "react";
import { Dropdown, Header, Icon, Pagination } from "semantic-ui-react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import API_URL from "../config";

const CategoriaProductos = () => {
  const [categorias, setCategorias] = useState([]);
  const [idcategorias, setIdCategorias] = useState(null); // Cambiamos el valor inicial a null
  const [cosmeticos, setCosmeticos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const productsPerPage = 10;

  useEffect(() => {
    getCategoria();
    setMensaje("Primero selecciona una categoría...");
  }, []); // Solo cargamos las categorías al inicio

  const getCategoria = async () => {
    try {
      const response = await fetch(`${API_URL}/cosmeticos/categorias`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        toast.error("Error al obtener la lista de categorías");
        throw new Error("Error al obtener la lista de categorías");
      }

      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      toast.error("Error al obtener la lista de categorías");
      console.error("Error al obtener la lista de categorías:", error);
    }
  };

  const listaCategorias = categorias?.map((categoria) => ({
    key: categoria._id,
    text: categoria.nombre,
    value: categoria._id, // Usamos el _id como valor del Dropdown para filtrar por categoría
  }));

  const handlePaginationChange = (e, { activePage }) => {
    setCurrentPage(activePage);
  };

  const handleCategoriaChange = async (e, { value }) => {
    setIdCategorias(value);
    setCurrentPage(1); // Volver a la primera página cuando se cambia la categoría
    setCosmeticos([]); // Limpiar los productos cargados previamente al seleccionar una categoría
  };

  useEffect(() => {
    if (idcategorias) {
      // Llamar a getCosmetico solo si hay una categoría seleccionada
      getCosmetico();
    }
  }, [currentPage, idcategorias]);

  const getCosmetico = async () => {
    try {
      let url = `${API_URL}/cosmeticos/getall?page=${currentPage}&limit=${productsPerPage}`;
      if (idcategorias) {
        // Si se ha seleccionado una categoría, filtrar por el _id de la categoría
        url = `${API_URL}/cosmeticos/getall?categoria=${idcategorias}&page=${currentPage}&limit=${productsPerPage}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        toast.error("Error al obtener la lista de productos");
        throw new Error("Error al obtener la lista de productos");
      }

      const data = await response.json();
      setTotalPages(data.totalPages);
      setCosmeticos(data.data);
      setMensaje("Parece que no hay productos disponibles =(");
    } catch (error) {
      toast.error("Error al obtener la lista de productos");
      console.error("Error al obtener la lista de productos:", error);
    }
  };

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    margin: "15px auto",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    flexDirection: "row",
    maxWidth: "600px",
    minWidth: "300px",
    boxShadow:
      "rgba(0, 0, 0, 0.07) 0px 1px 1px, rgba(0, 0, 0, 0.07) 0px 2px 2px, rgba(0, 0, 0, 0.07) 0px 2px 2px, rgba(0, 0, 0, 0.07) 0px 4px 4px, rgba(0, 0, 0, 0.07) 0px 8px 8px",
    textDecoration: "none",
    color: "black",
  };

  const imageStyle = {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    marginRight: "10px",
    minWidth: "100px",
    maxWidth: "100px",
    margin: "5px 20px 5px 5px",
  };

  const titleStyle = {
    fontSize: "18px",
    fontWeight: "bold",
  };

  const spanStyle = {
    display: "block",
    marginTop: "3px",
  };

  return (
    <>
      <Toaster />
      <div style={{ margin: "0 auto", textAlign: "center" }}>
        <div style={{ margin: "15px" }}>
          <Header size="tiny" dividing>
            <Icon name="th" />
            <Header.Content>Todos los productos disponibles</Header.Content>
          </Header>
        </div>
        Seleccione:
        <Dropdown
          placeholder="Categoría"
          search
          selection
          options={listaCategorias}
          onChange={handleCategoriaChange}
        />
        {cosmeticos?.length > 0 ? (
          <div style={{ padding: "10px" }}>
            {cosmeticos?.map((cosmetico) => (
              <Link
                style={containerStyle}
                to={`/user/verProducto/${cosmetico._id}`}
                state={{ cosmetico }}
              >
                <img
                  src={
                    cosmetico?.imagen[0] ??
                    "https://cdn-icons-png.flaticon.com/512/7734/7734301.png"
                  }
                  alt={cosmetico?.producto ?? ""}
                  style={imageStyle}
                />
                <div style={{ textAlign: "left" }}>
                  <div style={titleStyle}>{cosmetico?.producto ?? ""}</div>
                  <div>{cosmetico?.especificaciones ?? ""}</div>
                  <span style={spanStyle}>
                    <strong>Disponibles: </strong>
                    {cosmetico?.cantidadTotal ?? ""}
                  </span>
                  <span style={spanStyle}>
                    <strong>Apartados: </strong>
                    {cosmetico?.apartados ?? ""}
                  </span>
                </div>
              </Link>
            ))}
            <Pagination
              boundaryRange={0}
              defaultActivePage={currentPage}
              ellipsisItem={null}
              firstItem={null}
              lastItem={null}
              siblingRange={1}
              totalPages={totalPages}
              onPageChange={handlePaginationChange}
            />
          </div>
        ) : (
          <h3>{mensaje}</h3>
        )}
      </div>
    </>
  );
};

export default CategoriaProductos;
