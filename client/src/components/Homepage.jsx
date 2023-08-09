import React, { useEffect, useState, useContext } from "react";
import LoadingPage from "./LoadingPage";
import {
  Header,
  Card,
  Image,
  Pagination,
  Label,
  Modal,
  Button,
  Icon,
  List,
} from "semantic-ui-react";
import API_URL from "../config.js";
import { contexto } from "../context/ContextProvider";
import { Link } from "react-router-dom";
import ProductoHistorial from "../userComponents/ProductoHistorial";

const Homepage = () => {
  const [post, setPost] = useState([""]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const productsPerPage = 10;
  const [open, setOpen] = useState(false);
  const [producto, setProducto] = useState();

  const { setLoggedIn, setUsuario } = useContext(contexto);

  const verificarExpiracionToken = () => {
    const expirationDate = localStorage.getItem("miTokenExpiration");
    if (expirationDate) {
      const now = new Date();
      const expired = now >= new Date(expirationDate);
      if (expired) {
        // El token ha expirado, borrarlo del LocalStorage
        localStorage.removeItem("usuarioLS");
        localStorage.removeItem("loggedLS");
        localStorage.removeItem("demasdatosLS");
        localStorage.removeItem("miTokenExpiration");
      }
    }
  };

  useEffect(() => {
    verificarExpiracionToken();
    const usuarioLS = localStorage.getItem("usuarioLS");
    const loggedLS = localStorage.getItem("loggedLS");
    const demasDatosLS = localStorage.getItem("demasdatosLS");
    if (usuarioLS && loggedLS) {
      setLoggedIn(true);
      setUsuario(JSON.parse(demasDatosLS));
    } else {
      null;
    }
  }, []);

  const posts = async () => {
    try {
      // const res = await fetch("https://dummyjson.com/products");
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

  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <Modal open={open} onClose={handleCloseModal}>
            <Modal.Header>{producto?.nombre ?? ""}</Modal.Header>
            <Modal.Content image scrolling>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                {producto?.imagen.map((imagenSrc, index) => (
                  <Image
                    key={index}
                    centered
                    size="small"
                    style={{
                      objectFit: "contain",
                      width: "140px",
                      height: "140px",
                      marginBottom: "10px",
                    }}
                    src={imagenSrc}
                  />
                ))}
              </div>
              <Modal.Description>
                <div
                  style={{
                    backgroundColor: "snow",
                    padding: "20px",
                    borderRadius: "10px",
                    margin: "5px",
                    border: "1px solid #eeeeee",
                  }}
                >
                  <h3>Precio</h3>
                  <List style={{ marginTop: "-10px" }}>
                    <List.Item>
                      Antes: {"   "}
                      <Label color="red">
                        Q. {producto?.precioAnterior ?? ""}
                      </Label>
                      {"  "}Ahora: {"   "}
                      <Label color="green" style={{ fontSize: "17px" }}>
                        Q. {producto?.precio ?? ""}
                      </Label>
                    </List.Item>
                  </List>
                </div>

                <div
                  style={{
                    backgroundColor: "snow",
                    padding: "20px",
                    borderRadius: "10px",
                    margin: "5px",
                    border: "1px solid #eeeeee",
                  }}
                >
                  <h3>Descripción</h3>
                  <p>{producto?.descripcion ?? ""}</p>
                </div>
                <div
                  style={{
                    backgroundColor: "snow",
                    padding: "20px",
                    borderRadius: "10px",
                    margin: "5px",
                    border: "1px solid #eeeeee",
                  }}
                >
                  <h4>Especificaciones</h4>
                  <p>{producto?.especificaciones ?? ""}</p>
                </div>

                <div
                  style={{
                    backgroundColor: "snow",
                    padding: "20px",
                    borderRadius: "10px",
                    margin: "5px",
                    border: "1px solid #eeeeee",
                  }}
                >
                  <h4>Colores</h4>
                  <Label.Group>
                    {producto?.colores.map((color, index) => (
                      <Label key={index} color={color}>
                        {color}
                      </Label>
                    ))}
                  </Label.Group>

                  <h4>Tallas</h4>
                  <Label.Group>
                    {producto?.tallas.map((tallas, index) => (
                      <Label key={index} color={tallas}>
                        {tallas}
                      </Label>
                    ))}
                  </Label.Group>
                </div>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={handleCloseModal} primary>
                <Icon name="chevron left" /> Regresar
              </Button>
            </Modal.Actions>
          </Modal>

          <div>
            <Header
              size="huge"
              icon
              textAlign="center"
              style={{ marginTop: "-20px" }}
            >
              <Image
                src="https://res.cloudinary.com/dbkfiarmr/image/upload/v1691542644/leathershop_wk2q9j.svg"
                centered
                size="small"
                style={{
                  objectFit: "contain",
                  width: "80px",
                  height: "80px",
                  marginTop: "10px",
                  background: "transparent",
                }}
              />
              <Header.Content>Leather Shop</Header.Content>
              <Header as="h3" style={{ margin: "5px" }}>
                Chumpas de cuero 100% Natural
              </Header>
            </Header>
          </div>
          <Card.Group
            centered
            style={{ margin: "0px auto", maxWidth: "1100px" }}
          >
            {post.map((item) => (
              <Card
                raised
                as="a"
                key={item.id}
                style={{ width: "170px" }}
                onClick={() => handleActiveItem(item)}
              >
                {item.precioAnterior && item.precio ? (
                  <Label color="green" attached="top right" size="mini">
                    ¡
                    {(
                      ((item?.precioAnterior - item?.precio) /
                        item?.precioAnterior) *
                      100
                    ).toFixed(0)}
                    % de descuento!
                  </Label>
                ) : null}

                <Image
                  src={
                    item?.imagen[0] ??
                    "https://i.pinimg.com/736x/7c/1c/a4/7c1ca448be31c489fb66214ea3ae6deb.jpg"
                  }
                  centered
                  size="small"
                  style={{
                    objectFit: "contain",
                    width: "140px",
                    height: "140px",
                    marginTop: "10px",
                    background: "transparent",
                  }}
                />

                <Card.Header
                  style={{
                    width: "145px",
                    fontSize: "16px",
                    fontWeight: "800",
                    margin: "15px 15px 0px 15px",
                    overflow: "hidden",
                    display: "-webkit-box",
                    lineClamp: "1",
                    WebkitLineClamp: "1",
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {item?.nombre ?? ""}
                </Card.Header>

                <Card.Description
                  style={{
                    width: "140px",
                    margin: "5px 15px 15px 15px",
                    overflow: "hidden",
                    display: "-webkit-box",
                    lineClamp: "1",
                    WebkitLineClamp: "1",
                    WebkitBoxOrient: "vertical",
                    fontSize: "12px",
                  }}
                >
                  {item?.descripcion ?? ""}
                </Card.Description>
                <div
                  style={{ margin: "-8px 0px 5px 0px", textAlign: "center" }}
                >
                  <Label.Group>
                    <Label size="mini" color="red" style={{ fontSize: "10px" }}>
                      Antes: Q. {item?.precioAnterior ?? "0"}
                    </Label>
                    <Label
                      size="large"
                      color="blue"
                      style={{ padding: "10px 20px" }}
                    >
                      Ahora: Q. {item?.precio ?? ""}
                    </Label>
                  </Label.Group>
                </div>
              </Card>
            ))}
          </Card.Group>

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
      )}
    </>
  );
};

export default Homepage;
