import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/add-item">Add Item</NavLink>
        </li>
        <li>
          <NavLink to="/items">All Items</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
