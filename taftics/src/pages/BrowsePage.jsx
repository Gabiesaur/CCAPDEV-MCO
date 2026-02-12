import { Link } from "react-router-dom";

import { Search } from "lucide-react";

const BrowsePage = () => {
  const categories = ['Any', 'School Supplies', 'Laundry', 'Groceries', 'Dorms/Condos', 'Repairs', 'Printing', 'Fitness'];
  const ratings = ['Any'];
  const hours = ['Any', 'Open Now', '24/7'];
  const prices = ['Any', 'P', 'PP', 'PPP'];

  return (
    <div className="bg-white min-vh-100">
      <div className="container-fluid px-5">
        <div className="row">
          
          {/* LEFT SIDEBAR: User Info & Filters */}
          <aside 
            className="col-lg-3 pe-lg-5 sticky-top" 
            style={{ top: '128px', alignSelf: 'start', height: 'fit-content' }}
          >

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
          <main className="col-lg-9" style={{ paddingTop: '48px' }}>
            {/* Search Bar */}
            <div 
              className="input-group mb-4 sticky-top"
              style={{ top: '128px', alignSelf: 'start', width: '800px', height: 'fit-content' }}
            >
              <span className="input-group-text bg-light border-0 rounded-start-pill ps-4 py-2">
                <Search size={20} className="text-muted" />
              </span>
              <input 
                type="text" 
                className="form-control border-0 bg-light rounded-end-pill py-3 px-4"
                placeholder="Search for establishments to fit your needs" 
              />
            </div>

            {/* Establishment Cards Container */}
            <div style={{ paddingTop: '24px', paddingBottom: '80px'}}>
              {[1, 2, 3, 4, 5, 6].map((card) => (
                <div key={card} 
                  className="border-0 bg-light rounded-5 mb-5 overflow-hidden" 
                  style={{ width: '800px', height: 'auto' }}
                >
                  {/* 1. Full-Width Header Image */}
                  <div className="mx-auto" style={{ paddingTop: '40px', height: '400px', width: '90%' }}>
                    <img 
                      src="https://images.summitmedia-digital.com/spotph/images/2020/08/24/nbs-statement-closure-640-1598256966.jpg" 
                      className="w-100 h-100" 
                      style={{ objectFit: 'cover', borderRadius: '20px 20px' }} 
                      alt="National Book Store"
                    />
                  </div>

                  {/* 2. Content Area */}
                  <div style={{ padding: '40px', marginBottom: '-8px' }}>
                    <div className="align-items-start">
                      {/* Left: Titles */}
                      <div>
                        <h1 className="fw-bold fs-2">National Book Store</h1>
                        <p className="text-muted fs-5">Inside Yuchengco Hall</p>
                      </div>
                    </div>

                    {/* 3. Rating Row */}
                    <div className="d-flex justify-content-between align-items-end">
                      {/* Left: Star Rating */}
                      <h1 className="fs-4 pt-1 mb-0"> {/* Added mb-0 to prevent default margin from pushing it up */}
                        <span className="me-2" style={{ color: '#48a868', fontSize: '2.5rem' }}>★</span>
                        <span className="fw-bold">4.7</span> • 14 Reviews
                      </h1>

                      {/* Right: Actions */}
                      <div className="text-end">
                        <Link 
                          className="d-block text-dark text-decoration-none fw-bold fs-5 mb-2"
                          to="/">
                          View establishment ↗
                        </Link>
                        <Link 
                          className="d-block text-dark text-decoration-none fw-bold fs-5"
                          to="/">
                          Write a review ↗
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;