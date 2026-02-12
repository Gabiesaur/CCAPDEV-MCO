import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      className="d-flex space-between text-white bg-dlsu-dark"
      style={{ paddingTop: '36px', paddingBottom: '24px', height: 'auto' }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <h2 className="fw-bold" style={{ fontSize: '64px' }}>Taftics</h2>
            <p className="small" style={{ paddingLeft: '16px', marginTop: '-20px' }}>Every Archer needs a strategy.</p>
          </div>
          <div className="col-md-3">
            <h6 className="fw-bold small opacity-50 text-uppercase">Quick Links</h6>
            <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
              <ul className="list-unstyled d-flex flex-column">
                <li>
                  <Link
                    to="/register"
                    className="text-white text-decoration-none small hover-underline"
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link
                    to="/browse"
                    className="text-white text-decoration-none small hover-underline"
                  >
                    Establishments
                  </Link>
                </li>
                <li>
                  {/* Updated to About Us */}
                  <Link
                    to="/about"
                    className="text-white text-decoration-none small hover-underline"
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-3">
            <h6 className="fw-bold small opacity-50 text-uppercase">Contact Us</h6>
            <p className="small mb-1">Carl Martin D. Manalo</p>
            <p className="small mb-1">carl_martin_manalo@dlsu.edu.ph</p>
            <p className="small">+63-999-777-8888</p>
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <p className="small">© 2026 Taftics Inc.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
