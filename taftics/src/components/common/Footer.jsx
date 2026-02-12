import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      className="text-white py-5"
      style={{ backgroundColor: "#003e1c" }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h2 className="fw-bold">Taftics</h2>
            <p className="small mb-0">Every Archer needs a strategy.</p>
          </div>
          <div className="col-md-4 mb-4 mb-md-0">
            <h6 className="fw-bold small text-uppercase">Quick Links</h6>
            <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
              <ul className="list-unstyled d-flex flex-column gap-2">
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
                    to="/search"
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
          <div className="col-md-4">
            <h6 className="fw-bold small text-uppercase">Contact Us</h6>
            <p className="small mb-1">Carl Martin D. Manalo</p>
            <p className="small mb-1">carl_martin_manalo@dlsu.edu.ph</p>
            <p className="small">+63-999-777-8888</p>
          </div>
        </div>
        <div className="text-end border-top border-secondary pt-3 mt-3 small">
          © 2026 Taftics Inc.
        </div>
      </div>
    </footer>
  );
}
