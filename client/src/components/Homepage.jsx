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
  Container,
  Divider,
} from "semantic-ui-react";
import API_URL from "../config.js";
import { contexto } from "../context/ContextProvider";

const Homepage = () => {
  const [post, setPost] = useState([""]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const productsPerPage = 12;
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
      const res = await fetch(`${API_URL}/chumpas/getall?page=${currentPage}&limit=${productsPerPage}`);
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
          <Modal open={open} onClose={handleCloseModal} style={{ color: "black" }}>
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
                      <Label color="red">Q. {producto?.precioAnterior ?? ""}</Label>
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
                      <Label key={index}>{color}</Label>
                    ))}
                  </Label.Group>

                  <h4>Tallas</h4>
                  <Label.Group>
                    {producto?.tallas.map((tallas, index) => (
                      <Label key={index}>{tallas}</Label>
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
            <Header size="huge" icon textAlign="center" style={{ marginTop: "-20px" }}>
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
          <Container>
            <Card.Group doubling itemsPerRow={6}>
              {post.map((item, idx) => (
                <React.Fragment key={idx}>
                  <Card
                    key={idx}
                    style={{
                      borderRadius: "10px",
                      boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        margin: "0 auto",
                        border: "0px solid transparent",
                      }}
                    >
                      <Image
                        src={item?.imagen[0]}
                        alt={item?.nombre}
                        width="100%"
                        height="180px !important"
                        style={{
                          objectFit: "cover",
                          borderRadius: "10px 10px 0px 0px",
                        }}
                      />

                      {item.precioAnterior && item.precio ? (
                        <div
                          style={{
                            position: "absolute",
                            top: "-10px",
                            right: "-10px",
                            background: "red",
                            color: "white",
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            display: "flex",
                            justifyContent: "center",
                            border: "1px solid snow",
                            alignItems: "center",
                            fontSize: "10px",
                            fontWeight: "bold",
                          }}
                        >
                          -{(((item?.precioAnterior - item?.precio) / item?.precioAnterior) * 100).toFixed(0)}%
                        </div>
                      ) : null}

                      <Button
                        size="tiny"
                        color="black"
                        circular
                        style={{
                          width: "85px",
                          position: "absolute",
                          bottom: "-10%",
                          left: "50%",
                          transform: "translateX(-50%)",
                          border: "1px solid snow",
                        }}
                        onClick={() => {
                          handleActiveItem(item);
                        }}
                      >
                        Ver más
                      </Button>
                    </div>

                    <Card.Content style={{ paddingTop: "30px" }}>
                      <Card.Header textAlign="center" style={{ fontSize: "16px" }}>
                        {item.nombre}
                      </Card.Header>
                      <Divider />
                      <div
                        className="price"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div>
                          {item.precioAnterior && (
                            <span
                              className="old-price"
                              style={{
                                textDecoration: "line-through",
                                color: "red",
                                fontSize: "10px",
                                margin: "5px",
                              }}
                            >
                              Q. {item?.precioAnterior}
                              {"  "}
                            </span>
                          )}
                          <span
                            className="new-price"
                            style={{
                              fontWeight: "1000",
                              color: "black",
                              fontSize: "20px",
                            }}
                          >
                            Q. {item.precio}
                          </span>
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                </React.Fragment>
              ))}
            </Card.Group>
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
      )}
    </>
  );
};

export default Homepage;
