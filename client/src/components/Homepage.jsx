import React, { useEffect, useState, useContext } from "react";
import LoadingPage from "./LoadingPage";
import { Header, Card, Image } from "semantic-ui-react";
import { contexto } from "../context/ContextProvider";
import { Navigate } from "react-router-dom";

const Homepage = () => {
  const USER_TYPES = useContext(contexto);
  const { usuario } = useContext(contexto);

  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const posts = async () => {
      try {
        // const res = await fetch("https://dummyjson.com/products");
        const res = await fetch("https://fakestoreapi.com/products");
        const datosJson = await res.json();
        setPost(datosJson);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    posts();
  }, []);

  if (
    usuario === USER_TYPES.MODERATOR_USER ||
    usuario === USER_TYPES.ADMIN_USER
  ) {
    return (
      <>
        {loading ? (
          <LoadingPage />
        ) : (
          <>
            <div>
              <Header size="huge" icon textAlign="center">
                <Header.Content>Chumpas de cuero 100% Natural</Header.Content>
              </Header>
            </div>
            <Card.Group
              centered
              style={{ margin: "0px auto", maxWidth: "1100px" }}
            >
              {post.map((item) => (
                <Card raised as="a" key={item.id} style={{ width: "180px" }}>
                  <Image
                    src={item.image}
                    centered
                    size="small"
                    style={{
                      objectFit: "contain",
                      width: "150px",
                      height: "150px",
                      marginTop: "10px",
                      background: "transparent",
                    }}
                  />

                  <Card.Header
                    style={{
                      width: "150px",
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
                    {item.title}
                  </Card.Header>
                  <Card.Description
                    style={{
                      width: "160px",
                      margin: "5px 15px 15px 15px",
                      overflow: "hidden",
                      display: "-webkit-box",
                      lineClamp: "2",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                      fontSize: "12px",
                    }}
                  >
                    {item.description}
                  </Card.Description>
                </Card>
              ))}
            </Card.Group>
          </>
        )}
      </>
    );
  } else {
    return <Navigate to={"/"} />; // Redirect to homepage
  }
};

export default Homepage;
