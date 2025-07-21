// HomePage.js
import React from "react";
import Header from "../components/header/Header";
import Container from "../components/Container";
import Home from "../components/Home";
import SideBar from "../components/header/SideBar";
function HomePage() {
  return (
    <div className="w-full bg-gray-100 min-h-screen">
      <Header />
      <div className="flex">
        <SideBar />
        <Container>
          <Home />
        </Container>
      </div>
    </div>
  );
}
export default HomePage;