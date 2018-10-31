import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a class="navbar-brand" href="#">
          inHabit
        </a>
        <ul className="nav justify-content-end">
          <li className="nav-item">
            <a className="nav-link" href="#">
              Link #1
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Link #2
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Link #3
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
