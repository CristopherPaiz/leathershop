import React, { useEffect, useState, useContext } from "react";
import {
  Header,
  Pagination,
  Modal,
  Button,
  Icon,
  Container,
  Item,
} from "semantic-ui-react";
import API_URL from "../config.js";
import { contexto } from "../context/ContextProvider";
import { Navigate, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const EliminarChumpa = () => {
  const [post, setPost] = useState([""]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const productsPerPage = 15;
  const [open, setOpen] = useState(false);
  const [producto, setProducto] = useState();

  const { loggedIn, usuario } = useContext(contexto);
  const navigate = useNavigate();

  const posts = async () => {
    try {
      const res = await fetch(
        `${API_URL}/chumpas/getall?page=${currentPage}&limit=${productsPerPage}`
      );
      const datosJson = await res.json();
      setPost(datosJson.data);
      setLoading(false);
      setTotalPages(datosJson.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    posts();
  }, [currentPage]);

  const handlePaginationChange = (e, { activePage }) => {
    setCurrentPage(activePage);
  };

  const handleActiveItem = (item) => {
    setProducto(item);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleYes = () => {
    console.log(producto);
    fetch(`${API_URL}/chumpas/delete/${producto._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        toast.success("Chumpa eliminada con éxito");
        navigate("/admin");
        return res.json();
      })
      .then((data) => {
        console.log(data);
      });
  };

  if (loggedIn && usuario.rol === "Admin") {
    return (
      <>
        {loading ? (
          <h1>Cargando...</h1>
        ) : post > 0 ? (
          <>
            <Toaster />
            <Modal
              size="tiny"
              open={open}
              onClose={handleCloseModal}
              dimmer={"blurring"}
            >
              <Modal.Header>Desea borrar {producto?.nombre}</Modal.Header>
              <Modal.Content>
                <p>¿Está seguro que desea eliminar?</p>
              </Modal.Content>
              <Modal.Actions>
                <Button negative onClick={handleCloseModal}>
                  No
                </Button>
                <Button positive onClick={handleYes}>
                  Yes
                </Button>
              </Modal.Actions>
            </Modal>
            <Header as="h2" icon textAlign="center">
              <Icon name="delete" circular />
              <Header.Content style={{ padding: "20px" }}>
                Eliminar chumpa o producto de la página principal
              </Header.Content>
            </Header>
            <Container>
              <div className="card">
                {post.map((item, idx) => (
                  <div className="divhijo" key={idx}>
                    <div className="column" key={idx}>
                      <img
                        className="iamgenunica"
                        src={item?.imagen[0]}
                        alt={item?.nombre}
                      />
                    </div>
                    <div className="column">
                      <h2>{item?.nombre}</h2>
                      <p>Precio anterior: Q. {item?.precio}</p>
                      <p>Precio actual: Q. {item?.precioAnterior}</p>
                    </div>
                    <div className="column">
                      <button
                        className="delete-button"
                        onClick={() => {
                          handleActiveItem(item);
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Container>

            {totalPages > 1 && (
              <div style={{ margin: "10px auto", textAlign: "center" }}>
                <Pagination
                  boundaryRange={0}
                  defaultActivePage={currentPage}
                  ellipsisItem={null}
                  firstItem={totalPages > 3 ? 1 : null}
                  lastItem={totalPages > 3 ? totalPages : null}
                  siblingRange={1}
                  totalPages={totalPages}
                  onPageChange={handlePaginationChange}
                />
              </div>
            )}
            <br />
          </>
        ) : (
          <h3
            style={{
              margin: "0 auto",
              textAlign: "center",
              marginTop: "230px",
            }}
          >
            No hay productos para eliminar, agrega primero algunos y luego
            regresa nuevamente :D
          </h3>
        )}
      </>
    );
  } else {
    return <Navigate to="/login" />;
  }
};
import "./EliminarCSS.css";
export default EliminarChumpa;
