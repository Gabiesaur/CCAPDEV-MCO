import NavBar from '../components/NavBar'; // Your existing component

const LandingPage = () => {
  return (
    <div className="min-vh-100 bg-white">
      <NavBar />

      {/* Hero Section */}
      {/* We use pt-5 and mt-5 to prevent the fixed navbar from overlapping the text */}
      <header className="container text-center pt-5 mt-5 mb-5">
        <h1 className="fw-bold display-4 mt-5">
          Every <span style={{ color: '#003e1c' }}>Archer</span> needs a strategy.
        </h1>
        <p className="text-muted fs-5">
          Find the best services and essentials around Taft with peer-verified reviews.
        </p>
        <div className="mx-auto mt-4" style={{ maxWidth: '600px' }}>
          <input 
            type="text" 
            className="form-control rounded-pill py-3 px-4 bg-light border-0 shadow-sm" 
            placeholder="Search for laundry, printing, groceries..."
          />
        </div>
      </header>

      {/* Category Section */}
      <section className="container text-center my-5">
        <h2 className="fw-bold mb-4">Browse reviews by <span style={{ color: '#003e1c' }}>category</span></h2>
        <div className="row g-3 justify-content-center">
          {['School Supplies', 'Laundry', 'Printing', 'Groceries', 'Dorms', 'Repairs'].map((cat) => (
            <div key={cat} className="col-6 col-md-4 col-lg-2">
              <button className="btn w-100 text-white py-2 rounded-pill fw-semibold" style={{ backgroundColor: '#48a868' }}>
                {cat}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Top Rated Section */}
      <section className="container my-5 py-5">
        <h2 className="fw-bold text-center mb-5">See the <span style={{ color: '#003e1c' }}>top rated</span> establishments</h2>
        <div className="row g-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-light">
                <img src="https://via.placeholder.com/300x200" className="card-img-top rounded-3" alt="Establishment" />
                <div className="card-body px-0 pb-0">
                  <h5 className="fw-bold mb-1">National Book Store</h5>
                  <p className="text-muted small mb-2">Inside Yuchengco Hall</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold" style={{ color: '#48a868' }}>★ 4.7 <span className="text-muted fw-normal">• 14 Reviews</span></span>
                    <a href="#" className="text-dark text-decoration-none small fw-bold">View ↗</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Review Section */}
      <section className="container text-center my-5 py-5">
        <h2 className="fw-bold mb-5">Help others in the <span style={{ color: '#003e1c' }}>DLSU</span> community</h2>
        <div className="mx-auto bg-light p-4 rounded-4 shadow-sm text-start" style={{ maxWidth: '700px' }}>
          <div className="d-flex align-items-center mb-3">
            <div className="bg-secondary rounded-circle me-3" style={{ width: '40px', height: '40px' }}></div>
            <div>
              <p className="mb-0 fw-bold">Leelancze Pacomio</p>
              <small className="text-muted">2 days ago</small>
            </div>
          </div>
          <h5 className="fw-bold">Great service, would recommend!</h5>
          <div className="text-warning mb-2">★★★★★ <small className="text-muted text-decoration-underline ms-2">National Book Store</small></div>
          <p className="text-muted small">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <button className="btn btn-outline-dark rounded-pill px-4 mt-4 fw-bold">Write your own review ↗</button>
      </section>

      {/* Footer */}
      <footer className="text-white py-5 mt-5" style={{ backgroundColor: '#003e1c' }}>
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
    </div>
  );
};

export default LandingPage;