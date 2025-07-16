// HomePage.js
import React from "react";
import Header from "../components/header/Header";
import Container from "../components/Container";
import Home from "../components/Home";

function HomePage() {
  return (
    <div className="w-full">
      <Header />
      <Container>
        <Home />
      </Container>
    </div>
  );
}

export default HomePage;
