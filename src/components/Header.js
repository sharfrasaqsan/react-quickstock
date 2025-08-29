import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="app-header">
      <div className="container app-header__inner">
        <div className="logo">
          Quick<span style={{ color: "var(--brand)" }}>Stock</span>
          <div className="tagline">Track stock in real time</div>
        </div>
        <nav>
          <ul
            style={{
              display: "flex",
              gap: "1rem",
              listStyle: "none",
              margin: 0,
            }}
          >
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "btn btn--primary" : "btn btn--outline"
                }
              >
                Login
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? "btn btn--primary" : "btn btn--outline"
                }
              >
                Register
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
