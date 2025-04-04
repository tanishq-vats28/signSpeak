import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./css/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    Cookies.remove("user");
    navigate("/");
  };

  const isLoggedIn = Cookies.get("user");

  return (
    <nav className="navbar-container">
      <div className="logo">
        <Link to="/">
          <img
            src="images/logo/signspeak-high-resolution-logo-black-transparent.png"
            alt="logo"
            className="logo-img"
          />
        </Link>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      <div className={`menu ${isOpen ? "active" : ""}`}>
        {isLoggedIn ? (
          <>
            <Link
              to="/dashboard"
              className="nav-item"
              onClick={() => setIsOpen(false)}
            >
              <p>Dashboard</p>
            </Link>
            <Link
              to="/"
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="nav-item"
              style={{ cursor: "pointer" }}
            >
              <p>Logout</p>
            </Link>
          </>
        ) : (
          <>
            <Link to="/" className="nav-item" onClick={() => setIsOpen(false)}>
              <p>Home</p>
            </Link>
            <Link
              to="/info"
              className="nav-item"
              onClick={() => setIsOpen(false)}
            >
              <p>Info</p>
            </Link>
            <Link
              to="/team"
              className="nav-item"
              onClick={() => setIsOpen(false)}
            >
              <p>Team</p>
            </Link>
            <Link
              to="/user"
              className="nav-item"
              onClick={() => setIsOpen(false)}
            >
              <p>Login</p>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
