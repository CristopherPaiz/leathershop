import React from "react";

const LoadingPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "97vh",
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          border: "5px solid #ccc",
          borderTopColor: "#000",
          animation: "spin 1s infinite linear",
        }}
      ></div>
      <h2>Cargando...</h2>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;
