import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [selectedItem, setSelectedItem] = useState(0);
  const handleItemClick = (index) => {
    setSelectedItem(index);
  };
  const clickedClass = "nav-item nav-click";
  const oldClass = "nav-item";

  return (
    <div className="navbar-container">
      <div className="logo">
        <Link to="/" onClick={() => handleItemClick(0)}>
          <img
            src="images/signspeak-high-resolution-logo-black-transparent.png"
            alt="logo"
            className="logo-img"
          />
        </Link>
      </div>
      <div className="menu">
        <Link
          to="/"
          className={selectedItem === 0 ? clickedClass : oldClass}
          onClick={() => handleItemClick(0)}
        >
          <p>Home</p>
        </Link>

        <Link
          to="/user"
          className={selectedItem === 1 ? clickedClass : oldClass}
          onClick={() => handleItemClick(1)}
        >
          <p>Signup</p>
        </Link>

        <Link
          to="/info"
          className={selectedItem === 2 ? clickedClass : oldClass}
          onClick={() => handleItemClick(2)}
        >
          <p>Info</p>
        </Link>

        <Link
          to="/team"
          className={selectedItem === 3 ? clickedClass : oldClass}
          onClick={() => handleItemClick(3)}
        >
          <p>Team</p>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
