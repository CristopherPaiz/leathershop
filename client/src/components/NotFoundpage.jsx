import React from "react";
import { Link } from "react-router-dom";
import { Image, Header, Button } from "semantic-ui-react";

const NotFoundpage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
      }}
    >
      <div
        style={{
          width: "200px" /* Para móviles */,
          maxWidth: "300px" /* Para escritorio */,
          marginBottom: "20px",
        }}
      >
        <Image
          src="https://cdn-icons-png.flaticon.com/512/4826/4826313.png"
          alt="404 Not Found"
          style={{ width: "100%", height: "auto" }}
        />
      </div>
      <Header
        as="h1"
        className="not-found-title"
        style={{ textAlign: "center", fontSize: "20px" }}
      >
        ¡Oops, parece que estás perdido!
      </Header>
      <Button as={Link} to="/" primary>
        Regresar al inicio
      </Button>
    </div>
  );
};

export default NotFoundpage;
