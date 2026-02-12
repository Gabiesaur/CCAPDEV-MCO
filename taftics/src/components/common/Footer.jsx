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
            <ul className="list-unstyled small">
              <li>Register</li>
              <li>Establishments</li>
              <li>Review</li>
            </ul>
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
