import React, { useEffect, useState, useContext } from "react";
import {
  Header,
  Icon,
  Form,
  Grid,
  Radio,
  Pagination,
  Accordion,
} from "semantic-ui-react";
import { Navigate } from "react-router-dom";
import API_URL from "../config.js";
import toast, { Toaster } from "react-hot-toast";
import { contexto } from "../context/ContextProvider";

const ProductoHistorial = () => {
  const { loggedIn, usuario } = useContext(contexto);
  const [value, setValue] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const productsPerPage = 10;
  const [historial, setHistorial] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  const handleChangeState = (event, data) => {
    setValue(data.value);
  };

  const handlePaginationChange = (e, { activePage }) => {
    setCurrentPage(activePage);
  };

  //useEffect para controlar el value y determinar que tipo de historial se va a mostrar
  useEffect(() => {
    setLoading(true); // Habilitar el estado de carga
    if (value === "todos") {
      getAllHistory();
    } else if (value === "menor") {
      getUnidadHistory();
    } else if (value === "mayor") {
      getMayoreoHistory();
    }
  }, [value, currentPage]);

  // Función para manejar la búsqueda de productos
  const getAllHistory = async () => {
    try {
      const response = await fetch(
        `${API_URL}/CompraCosmetico/getall?page=${currentPage}&limit=${productsPerPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        setLoading(false);
        toast.error("Error al obtener el historial de compras");
        throw new Error("Error al obtener el historial de compras");
      }

      const data = await response.json();
      setTotalPages(data.totalPages);
      setHistorial(data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Error al obtener el historial de compras");
      console.error("Error al obtener el historial de compras:", error);
    }
  };

  // Función para manejar la búsqueda de productos
  const getUnidadHistory = async () => {
    try {
      const response = await fetch(
        `${API_URL}/CompraCosmetico/getunidad?page=${currentPage}&limit=${productsPerPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        setLoading(false);
        toast.error("Error al obtener el historial de compras");
        throw new Error("Error al obtener el historial de compras");
      }

      const data = await response.json();
      setTotalPages(data.totalPages);
      setHistorial(data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Error al obtener el historial de compras");
      console.error("Error al obtener el historial de compras:", error);
    }
  };

  // Función para manejar la búsqueda de productos
  const getMayoreoHistory = async () => {
    try {
      const response = await fetch(
        `${API_URL}/CompraCosmetico/getmayoreo?page=${currentPage}&limit=${productsPerPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        setLoading(false);
        toast.error("Error al obtener el historial de compras");
        throw new Error("Error al obtener el historial de compras");
      }

      const data = await response.json();
      setTotalPages(data.totalPages);
      setHistorial(data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Error al obtener el historial de compras");
      console.error("Error al obtener el historial de compras:", error);
    }
  };

  const handleClick = (index) => {
    // Función para manejar el evento onClick y cambiar el estado del índice activo
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (loggedIn && usuario.rol === "Admin") {
    return (
      <>
        <Toaster />
        <Header as="h2" icon textAlign="center">
          <Icon name="history" />
          <Header.Content>Historial de compras</Header.Content>
        </Header>
        <Grid centered style={{ margin: "20px" }}>
          <Grid.Column mobile={15} tablet={8} computer={6}>
            <Form>
              <Form.Field>
                <label>Primero seleccione el tipo:</label>
              </Form.Field>
            </Form>
          </Grid.Column>
          <Form>
            <Form.Field>
              <Radio
                label="Todos"
                name="radioGroup"
                value="todos"
                checked={value === "todos"}
                onChange={handleChangeState}
              />
              <span style={{ color: "transparent" }}>spa</span>
              <Radio
                label="Por Unidad"
                name="radioGroup"
                value="menor"
                checked={value === "menor"}
                onChange={handleChangeState}
              />
              <span style={{ color: "transparent" }}>spa</span>
              <Radio
                label="Por Mayoreo"
                name="radioGroup"
                value="mayor"
                checked={value === "mayor"}
                onChange={handleChangeState}
              />
            </Form.Field>
          </Form>
          {loading ? (
            <h1>Cargando...</h1>
          ) : (
            <>
              {value === "todos" && (
                <>
                  <h2>Todos</h2>
                  <Accordion styled>
                    {historial.map((item, index) => (
                      <React.Fragment key={item._id}>
                        <Accordion.Title
                          active={activeIndex === index}
                          index={index}
                          onClick={() => handleClick(index)}
                          key={index}
                        >
                          <Icon name="dropdown" />
                          {item?.nombreProducto} - {item?.createdAtFormatted}
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === index}>
                          <p>
                            Tipo de compra:
                            <strong style={{ fontSize: "20px" }}>
                              {item.Tipo}
                            </strong>
                          </p>
                          <p>
                            Cantidad Ingreso: {item.cantidadIngresoR}
                            <br />
                            Costo Unitario: Q. {item.costoUnitarioR}
                            <br />
                            Costo Total: Q. {item.costoTotalR}
                            <br />
                            Precio de Venta: Q. {item.costoDeVentaR}
                            <br />
                            Utilidad Generada: Q. {item.utilidadR}
                            <br />
                            Observaciones: {item.observacionesR}
                          </p>
                        </Accordion.Content>
                      </React.Fragment>
                    ))}
                  </Accordion>
                </>
              )}
              {value === "menor" && (
                <>
                  <h2>Por Unidad</h2>
                  <Accordion styled>
                    {historial.map((item, index) => (
                      <React.Fragment key={item._id}>
                        <Accordion.Title
                          active={activeIndex === index}
                          index={index}
                          onClick={() => handleClick(index)}
                        >
                          <Icon name="dropdown" />
                          {item?.nombreProducto} - {item?.createdAtFormatted}
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === index}>
                          <p>
                            Tipo de compra:{" "}
                            <strong style={{ fontSize: "20px" }}>
                              {" "}
                              {item.Tipo}{" "}
                            </strong>
                          </p>
                          <p>
                            Cantidad Ingreso: {item.cantidadIngresoR}
                            <br />
                            Costo Unitario: Q. {item.costoUnitarioR}
                            <br />
                            Costo Total: Q. {item.costoTotalR}
                            <br />
                            Precio de Venta: Q. {item.costoDeVentaR}
                            <br />
                            Utilidad Generada: Q. {item.utilidadR}
                            <br />
                            Observaciones: {item.observacionesR}
                          </p>
                        </Accordion.Content>
                      </React.Fragment>
                    ))}
                  </Accordion>
                </>
              )}
              {value === "mayor" && (
                <>
                  <h2>Por Mayoreo</h2>
                  <>
                    <Accordion styled>
                      {historial.map((item, index) => (
                        <React.Fragment key={item._id}>
                          <Accordion.Title
                            active={activeIndex === index}
                            index={index}
                            onClick={() => handleClick(index)}
                          >
                            <Icon name="dropdown" />
                            {item?.nombreProducto} - {item?.createdAtFormatted}
                          </Accordion.Title>
                          <Accordion.Content active={activeIndex === index}>
                            <p>
                              Tipo de compra:{" "}
                              <strong style={{ fontSize: "20px" }}>
                                {" "}
                                {item.Tipo}{" "}
                              </strong>
                            </p>
                            <p>
                              Cantidad Ingreso: {item.cantidadIngresoR}
                              <br />
                              Costo Unitario: Q. {item.costoUnitarioR}
                              <br />
                              Costo Total: Q. {item.costoTotalR}
                              <br />
                              Precio de Venta: Q. {item.costoDeVentaR}
                              <br />
                              Utilidad Generada: Q. {item.utilidadR}
                              <br />
                              Observaciones: {item.observacionesR}
                            </p>
                          </Accordion.Content>
                        </React.Fragment>
                      ))}
                    </Accordion>
                  </>
                </>
              )}
            </>
          )}
        </Grid>
        <Grid centered>
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
        </Grid>
      </>
    );
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProductoHistorial;
