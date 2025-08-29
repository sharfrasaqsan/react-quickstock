import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <aside className="sidenav">
      <nav className="container nav">
        <ul className="nav__list">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `btn ${isActive ? "btn--primary" : "btn--outline"} nav__link`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/add-item"
              className={({ isActive }) =>
                `btn ${isActive ? "btn--primary" : "btn--outline"} nav__link`
              }
            >
              Add Item
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Navbar;
