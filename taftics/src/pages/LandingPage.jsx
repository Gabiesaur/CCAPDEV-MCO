import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-vh-100 bg-white">
      {/* Hero Section */}
      {/* We use pt-5 and mt-5 to prevent the fixed navbar from overlapping the text */}
      <header className="container text-center" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
        <h1 className="fw-bold display-4 mt-5">
          Every <span style={{ color: "#003e1c" }}>Archer</span> needs a strategy.
        </h1>
        <p className="text-muted fs-5">
          Find the best services and essentials around Taft with peer-verified
          reviews.
        </p>
        <div className="input-group mx-auto mt-5" style={{ maxWidth: "1000px" }}>
          <span className="input-group-text bg-light border-0 rounded-start-pill ps-4 py-2">
            <Search size={20} className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control rounded-end-pill py-3 px-4 bg-light border-0"
            placeholder="Search for laundry, printing, groceries..."
          />
        </div>
      </header>

      {/* Category Section */}
      <section className="container text-center" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <h2 className="fw-bold mb-4">
          Browse reviews by <span style={{ color: "#003e1c" }}>category</span>
        </h2>
        <div className="row g-3 justify-content-center">
          {[
            "School Supplies",
            "Laundry",
            "Printing",
            "Groceries",
            "Dorms",
            "Repairs",
          ].map((cat) => (
            <div key={cat} className="col-6 col-md-4 col-lg-2">
              <Link
                className="btn w-100 text-white py-2 rounded-pill fw-semibold"
                style={{ backgroundColor: "#48a868" }}
                to="/browse"
              >
                {cat}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Top Rated Section */}
      <section className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <h2 className="fw-bold text-center mb-5">
          See the <span style={{ color: "#003e1c" }}>top rated</span>{" "}
          establishments
        </h2>
        <div className="row g-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-light">
                <img
                  src="https://via.placeholder.com/300x200"
                  className="card-img-top rounded-3"
                  alt="Establishment"
                />
                <div className="card-body px-0 pb-0">
                  <h5 className="fw-bold mb-1">National Book Store</h5>
                  <p className="text-muted small mb-2">Inside Yuchengco Hall</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold" style={{ color: "#48a868" }}>
                      ★ 4.7{" "}
                      <span className="text-muted fw-normal">• 14 Reviews</span>
                    </span>
                    <a
                      href="#"
                      className="text-dark text-decoration-none small fw-bold"
                    >
                      View ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Review Section */}
      <section className="container text-center" style={{ paddingTop: '80px', paddingBottom: '160px' }}>
        <h2 className="fw-bold mb-5">
          Help others in the <span style={{ color: "#003e1c" }}>DLSU</span>{" "}
          community
        </h2>
        <div
          className="mx-auto bg-light p-4 rounded-4 shadow-sm text-start"
          style={{ maxWidth: "700px" }}
        >
          <div className="d-flex align-items-center mb-3">
            <div
              className="bg-secondary rounded-circle me-3"
              style={{ width: "40px", height: "40px" }}
            ></div>
            <div>
              <p className="mb-0 fw-bold">Leelancze Pacomio</p>
              <small className="text-muted">2 days ago</small>
            </div>
          </div>
          <h5 className="fw-bold">Great service, would recommend!</h5>
          <div className="text-warning mb-2">
            ★★★★★{" "}
            <small className="text-muted text-decoration-underline ms-2">
              National Book Store
            </small>
          </div>
          <p className="text-muted small">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <button className="btn btn-outline-dark rounded-pill px-4 mt-4 fw-bold">
          Write your own review ↗
        </button>
      </section>
    </div>
  );
};

export default LandingPage;
