import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  if (!user) return null;

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

          {(user.role === "admin" || user.role === "manager") && (
            <li>
              <NavLink
                to="logs"
                className={({ isActive }) =>
                  `btn ${isActive ? "btn--primary" : "btn--outline"} nav__link`
                }
              >
                Logs
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Navbar;
