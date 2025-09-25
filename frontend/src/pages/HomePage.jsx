// HomePage.js
import React from "react";
import Container from "../components/Container";
import Home from "../components/Home";

function HomePage() {
  return (
    <Container className="min-h-screen bg-pink-200 md:bg-white">
      <Home />
    </Container>
  );
}

export default HomePage;
