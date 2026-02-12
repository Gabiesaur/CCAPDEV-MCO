import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Search, LogOut, User, ChevronDown } from "lucide-react";
// Ensure this path matches your file structure
import logo from "/logo_white.svg?url";

function NavBar({ user, onLogoutClick }) {
  const location = useLocation();
  const showSearchBar =
    location.pathname !== "/" && location.pathname !== "/browse";

  // 1. STATE: Manually track if the menu is open
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 2. TOGGLE: Flip the state
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // 3. CLOSE: Force close (used when clicking links)
  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg fixed-top bg-dlsu-dark shadow-sm"
        style={{ height: "80px", zIndex: 1030 }}
      >
        <div
          className="container-fluid position-relative d-flex align-items-center"
          style={{ paddingLeft: "80px", paddingRight: "80px" }}
        >
          {/* LEFT: Brand Logo */}
          <Link
            className="navbar-brand text-white fw-bold fs-2 d-flex align-items-center gap-2"
            to="/"
          >
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
                /* --- MANUAL DROPDOWN START --- */
                <li className="nav-item dropdown position-relative">
                  {/* Trigger Area */}
                  <div
                    className="nav-link d-flex align-items-center gap-2 pointer-cursor"
                    role="button"
                    onClick={toggleDropdown}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    <div className="text-end d-none d-lg-block">
                      <small className="d-block fw-bold text-white lh-1">
                        {user.username}
                      </small>
                      <small
                        className="text-dlsu-light d-flex align-items-center justify-content-end gap-1"
                        style={{ fontSize: "0.75rem" }}
                      >
                        Account <ChevronDown size={12} />
                      </small>
                    </div>
                    <img
                      src={user.avatar}
                      alt="My Profile"
                      className="rounded-circle border border-2 border-white object-cover shadow-sm"
                      style={{ width: "40px", height: "40px" }}
                    />
                  </div>

                  {/* Dropdown Menu (Conditionally Rendered) */}
                  <ul
                    className={`dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2 rounded-3 p-2 ${
                      isDropdownOpen ? "show" : ""
                    }`}
                    style={{
                      position: "absolute",
                      right: 0,
                      left: "auto",
                      display: isDropdownOpen ? "block" : "none", // Force display
                    }}
                  >
                    <li>
                      <Link
                        className="dropdown-item d-flex align-items-center gap-2 rounded-2 py-2"
                        to="/profile/me"
                        onClick={closeDropdown}
                      >
                        <User size={16} /> View Profile
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider opacity-50 my-1" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item d-flex align-items-center gap-2 rounded-2 py-2 text-danger fw-bold"
                        onClick={() => {
                          closeDropdown();
                          onLogoutClick();
                        }}
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                /* --- MANUAL DROPDOWN END --- */
                <li className="nav-item">
                  <Link to="/login">
                    <button
                      className="btn btn-light rounded-pill px-4 py-2 fw-bold fs-6 shadow-sm"
                      style={{ height: "40px" }}
                      type="button"
                    >
                      Sign In
                    </button>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* 4. INVISIBLE OVERLAY: Closes menu if you click outside */}
      {isDropdownOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1020, // Below Navbar (1030) but above content
            cursor: "default",
          }}
          onClick={closeDropdown}
        />
      )}
    </>
  );
}

export default NavBar;
