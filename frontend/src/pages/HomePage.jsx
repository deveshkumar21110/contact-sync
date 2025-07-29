// HomePage.js
import React from "react";
import Container from "../components/Container";
import Home from "../components/Home";

function HomePage() {
  return (
    <div className="w-full bg-gray-50 p-6 min-h-screen">
      <Container>
        <Home />
      </Container>
    </div>
  );
}

export default HomePage;
