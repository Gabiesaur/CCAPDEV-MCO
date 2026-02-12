import NavBar from '../components/common/NavBar';

const BrowsePage = () => {
  const categories = ['Any', 'School Supplies', 'Laundry', 'Groceries', 'Dorms/Condos', 'Repairs', 'Printing', 'Fitness'];
  const ratings = ['Any'];
  const hours = ['Any', 'Open Now', '24/7'];
  const prices = ['Any', 'P', 'PP', 'PPP'];

  return (
    <div className="bg-white min-vh-100">
      <NavBar />
      
      {/* Spacer for Fixed Navbar */}
      <div style={{ height: '90px' }}></div>

      <div className="container-fluid px-5 mt-4">
        <div className="row">
          
          {/* LEFT SIDEBAR: User Info & Filters */}
          <aside className="col-lg-3 pe-lg-5">
            {/* User Profile Summary */}
            <div className="d-flex align-items-center mb-5">
              <div className="bg-primary rounded-circle me-3" style={{ width: '60px', height: '60px' }}>
                {/* Profile Img Placeholder */}
              </div>
              <div>
                <h6 className="fw-bold mb-0">Leelancze Pacomio</h6>
                <p className="text-muted small mb-0">@leelanczer</p>
                <span className="badge rounded-pill bg-success px-3">124</span>
              </div>
            </div>

            {/* Filter Groups */}
            <div className="filter-section mb-4">
              <label className="text-muted small fw-bold mb-2 text-uppercase d-block">Categories</label>
              <div className="d-flex flex-wrap gap-2">
                {categories.map((item, idx) => (
                  <button key={item} className={`btn rounded-pill btn-sm px-3 border-dark fw-semibold ${idx === 0 ? 'btn-success border-0' : 'btn-outline-dark'}`}>
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section mb-4">
              <label className="text-muted small fw-bold mb-2 text-uppercase d-block">Rating</label>
              <button className="btn btn-success rounded-pill btn-sm px-4 border-0">Any</button>
            </div>

            <div className="filter-section mb-4">
              <label className="text-muted small fw-bold mb-2 text-uppercase d-block">Hours</label>
              <div className="d-flex gap-2">
                {hours.map((item, idx) => (
                  <button key={item} className={`btn rounded-pill btn-sm px-3 border-dark fw-semibold ${idx === 0 ? 'btn-success border-0' : 'btn-outline-dark'}`}>
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section mb-5">
              <label className="text-muted small fw-bold mb-2 text-uppercase d-block">Prices</label>
              <div className="d-flex gap-2">
                {prices.map((item, idx) => (
                  <button key={item} className={`btn rounded-pill btn-sm px-3 border-dark fw-semibold ${idx === 0 ? 'btn-success border-0' : 'btn-outline-dark'}`}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT: Search & Results */}
          <main className="col-lg-9">
            {/* Search Bar */}
            <div className="mb-4">
              <input 
                type="text" 
                className="form-control border-0 bg-light rounded-pill py-3 px-4 shadow-sm" 
                placeholder="Search for establishments to fit your needs" 
              />
            </div>

            {/* Establishment Cards */}
            {[1, 2, 3].map((card) => (
              <div key={card} className="card border-0 bg-light rounded-5 p-4 mb-4 shadow-sm">
                <div className="row g-0">
                  <div className="col-md-5">
                    <img 
                      src="https://via.placeholder.com/400x250" 
                      className="img-fluid rounded-4 h-100" 
                      style={{ objectFit: 'cover' }} 
                      alt="National Book Store" 
                    />
                  </div>
                  <div className="col-md-7 ps-md-4 d-flex flex-column justify-content-between py-2">
                    <div>
                      <h2 className="fw-bold mb-1">National Book Store</h2>
                      <p className="text-muted mb-0">Inside Yuchengco Hall</p>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-end">
                      <div className="d-flex align-items-center gap-2">
                         <span className="text-success fs-3">★</span>
                         <span className="fw-bold">4.7 • 14 Reviews</span>
                      </div>
                      <div className="text-end">
                        <a href="#" className="d-block text-dark text-decoration-none fw-bold mb-1">View Establishment ↗</a>
                        <a href="#" className="d-block text-dark text-decoration-none fw-bold">Write a Review ↗</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </main>
          
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;