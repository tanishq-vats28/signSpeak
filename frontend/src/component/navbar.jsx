import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("user");
    navigate("/");
  };

  const isLoggedIn = Cookies.get("user");

  return (
    <div className="navbar-container">
      <div className="logo">
        <Link to="/">
          <img
            src="images/logo/signspeak-high-resolution-logo-black-transparent.png"
            alt="logo"
            className="logo-img"
          />
        </Link>
      </div>
      <div className="menu">
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="nav-item">
              <p>Dashboard</p>
            </Link>
            <Link
              to="/"
              onClick={handleLogout}
              className="nav-item"
              style={{ cursor: "pointer" }}
            >
              <p>Logout</p>
            </Link>
          </>
        ) : (
          <>
            <Link to="/" className="nav-item">
              <p>Home</p>
            </Link>
            <Link to="/info" className="nav-item">
              <p>Info</p>
            </Link>
            <Link to="/team" className="nav-item">
              <p>Team</p>
            </Link>
            <Link to="/user" className="nav-item">
              <p>Login</p>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
