import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

import RatingFilter from "../components/browse/RatingFilter";

const BrowsePage = () => {
  // 1. Initialize states for each filter group
  const [activeCategory, setActiveCategory] = useState('Any');
  const [activeHour, setActiveHour] = useState('Any');
  const [activePrice, setActivePrice] = useState('Any');

  const categories = ['Any', 'School Supplies', 'Laundry', 'Groceries', 'Dorms/Condos', 'Repairs', 'Printing', 'Fitness'];
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
            {/* Categories Filter */}
            <div className="filter-section mb-4">
              <label className="text-muted small fw-bold mb-2 text-uppercase d-block">Categories</label>
              <div className="d-flex flex-wrap gap-2">
                {categories.map((item) => (
                  <button 
                    key={item} 
                    onClick={() => setActiveCategory(item)} // Updates state on click
                    className={`btn rounded-pill btn-sm px-3 fw-semibold transition-all ${
                      activeCategory === item 
                        ? 'btn-success border-0 shadow-sm' 
                        : 'btn-outline-dark border-dark'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <RatingFilter />

            {/* Hours Filter */}
            <div className="filter-section mb-4">
              <label className="text-muted small fw-bold mb-2 text-uppercase d-block">Hours</label>
              <div className="d-flex gap-2">
                {hours.map((item) => (
                  <button 
                    key={item} 
                    onClick={() => setActiveHour(item)}
                    className={`btn rounded-pill btn-sm px-3 fw-semibold transition-all ${
                      activeHour === item 
                        ? 'btn-success border-0 shadow-sm' 
                        : 'btn-outline-dark border-dark'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Prices Filter */}
            <div className="filter-section mb-5">
              <label className="text-muted small fw-bold mb-2 text-uppercase d-block">Prices</label>
              <div className="d-flex gap-2">
                {prices.map((item) => (
                  <button 
                    key={item} 
                    onClick={() => setActivePrice(item)}
                    className={`btn rounded-pill btn-sm px-3 fw-semibold transition-all ${
                      activePrice === item 
                        ? 'btn-success border-0 shadow-sm' 
                        : 'btn-outline-dark border-dark'
                    }`}
                  >
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
              style={{ top: '128px', zIndex: 1020, width: '100%', maxWidth: '800px', height: 'fit-content' }}
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
            <div style={{ paddingTop: '24px', paddingBottom: '80px', width: '100%', maxWidth: '800px' }}>
              {[1, 2, 3, 4, 5, 6].map((card) => (
                <div key={card} 
                  className="border-0 bg-light rounded-5 mb-5 overflow-hidden shadow-sm mx-auto" 
                  style={{ width: '100%', height: 'auto' }}
                >
                  {/* 1. Full-Width Header Image Wrapper */}
                  <div className="mx-auto" style={{ paddingTop: '40px', height: '400px', width: '90%' }}>
                    <img 
                      src="https://images.summitmedia-digital.com/spotph/images/2020/08/24/nbs-statement-closure-640-1598256966.jpg" 
                      className="w-100 h-100" 
                      style={{ objectFit: 'cover', borderRadius: '20px' }} 
                      alt="National Book Store"
                    />
                  </div>

                  {/* 2. Content Area */}
                  <div style={{ padding: '40px', marginBottom: '-8px' }}>
                    <div className="align-items-start">
                      <div>
                        <h1 className="fw-bold fs-2 mb-1">National Book Store</h1>
                        <p className="text-muted fs-5">Inside Yuchengco Hall</p>
                      </div>
                    </div>

                    {/* 3. Rating Row */}
                    <div className="d-flex justify-content-between align-items-end mt-4">
                      <h1 className="fs-4 pt-1 mb-0 d-flex align-items-center">
                        <span className="me-2" style={{ color: '#48a868', fontSize: '2.5rem', lineHeight: '1' }}>★</span>
                        <span className="fw-bold">4.7</span> 
                        <span className="ms-2 text-muted fw-normal">• 14 Reviews</span>
                      </h1>

                      <div className="text-end">
                        <Link to="/" className="d-block text-dark text-decoration-none fw-bold fs-5 mb-2">
                          View establishment ↗
                        </Link>
                        <Link to="/" className="d-block text-dark text-decoration-none fw-bold fs-5">
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