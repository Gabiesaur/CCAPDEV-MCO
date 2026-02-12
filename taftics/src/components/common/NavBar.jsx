import { useLocation, Link } from "react-router-dom";
import { Search } from "lucide-react";
import logo from "/logo_white.svg?url";

function NavBar({ user }) {
  const location = useLocation();
  const showSearchBar = location.pathname !== "/" && location.pathname !== "/browse";

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top bg-dlsu-dark shadow-sm"
      style={{ height: "80px" }}
    >
      <div
        className="container-fluid position-relative d-flex align-items-center"
        style={{ paddingLeft: "80px", paddingRight: "80px" }}
      >
        {/* LEFT: Brand Logo */}
        <Link className="navbar-brand text-white fw-bold fs-2" to="/">
          <img
            src={logo}
            alt="Logo"
            style={{ height: "40px", width: "40px" }}
          />
          Taftics
        </Link>

        {/* CENTER: Search Bar */}
        {showSearchBar && (
          <div
            className="position-absolute start-50 translate-middle-x d-none d-md-flex"
            style={{ width: "450px" }}
          >
            <div className="input-group">
              <span className="input-group-text bg-light border-0 rounded-start-pill ps-3 py-2">
                <Search size={20} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control bg-light border-0 rounded-end-pill py-2 fs-6"
                placeholder="Search Taftics..."
                style={{ height: "40px" }}
              />
            </div>
          </div>
        )}

        {/* RIGHT: Navigation Items */}
        <div className="ms-auto d-flex align-items-center">
          <ul className="navbar-nav flex-row align-items-center gap-3">
            <li className="nav-item">
              <Link
                className="nav-link text-white fw-semibold px-4 fs-6"
                to="/browse"
              >
                Browse
              </Link>
            </li>

            {user ? (
              <li className="nav-item">
                <Link
                  to="/profile/me"
                  className="d-flex align-items-center gap-2 text-decoration-none"
                >
                  <div className="text-end d-none d-lg-block">
                    <small className="d-block fw-bold text-white lh-1">
                      {user.username}
                    </small>
                    <small
                      className="text-dlsu-light"
                      style={{ fontSize: "0.8rem" }}
                    >
                      View Profile
                    </small>
                  </div>
                  <img
                    src={user.avatar}
                    alt="My Profile"
                    className="rounded-circle border border-2 border-white object-cover shadow-sm"
                    style={{ width: "40px", height: "40px" }}
                  />
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <button
                  className="btn btn-light rounded-pill px-4 py-2 fw-bold fs-6 shadow-sm"
                  style={{ height: "40px" }}
                  type="button"
                >
                  Sign In
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
