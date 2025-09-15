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
              to="/items"
              className={({ isActive }) =>
                `btn ${isActive ? "btn--primary" : "btn--outline"} nav__link`
              }
            >
              Items
            </NavLink>
          </li>

          <div className="d-flex align-items-center gap-3">
            {(user?.role === "admin" || user?.role === "manager") && (
              <li>
                <NavLink
                  to="logs"
                  className={({ isActive }) =>
                    `btn ${
                      isActive ? "btn--primary" : "btn--outline"
                    } nav__link`
                  }
                >
                  Logs
                </NavLink>
              </li>
            )}

            <li>
              <NavLink
                to={`/profile/${user.id}`}
                className={({ isActive }) =>
                  `btn ${isActive ? "btn--primary" : "btn--outline"} nav__link`
                }
              >
                Profile
              </NavLink>
            </li>
          </div>
        </ul>
      </nav>
    </aside>
  );
};

export default Navbar;
