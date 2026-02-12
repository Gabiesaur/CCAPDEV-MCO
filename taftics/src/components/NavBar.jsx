function NavBar() {
  return (
    <nav 
      className="navbar navbar-expand-lg fixed-top bg-dlsu-dark" 
      style={{ height: '80px' }}
    >
      <div 
        className="container-fluid"
        style={{ paddingLeft: '80px', paddingRight: '80px' }}
      >
        {/* Brand Logo */}
        <a className="navbar-brand text-white fw-bold fs-2" href="/">
          Taftics
        </a>

        {/* Right-aligned items */}
        <div className="ms-auto d-flex align-items-center">
          <ul className="navbar-nav flex-row align-items-center">
            <li className="nav-item">
              <a className="nav-link text-white fw-semibold px-4 fs-6" href="#browse">
                Browse
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white fw-semibold px-4 fs-6" href="#review">
                Review
              </a>
            </li>
            <li className="nav-item ms-2">
              <button 
                className="btn btn-light rounded-pill px-3 py-1 fw-bold fs-6 shadow-sm"
                type="button"
              >
                Sign In
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;