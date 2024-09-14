import React from "react";
import { Routes, Route } from "react-router-dom";
import Footer from "./footer";
import HomePage from "./homepage";
import InfoPage from "./infopage";
import User from "./user";
import TeamPage from "./team";
import Navbar from "./navbar";
function Menu() {
  return (
    <>
      <Navbar />
      <div className="main-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/user" element={<User />} />
          <Route path="/team" element={<TeamPage />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
export default Menu;
