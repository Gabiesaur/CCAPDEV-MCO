import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Search } from "lucide-react";
import { useLocation } from "react-router-dom";

import RatingFilter from "../components/browse/RatingFilter";
import EstablishmentCard from "../components/browse/EstablishmentCard";

// ❌ REMOVED: import { ESTABLISHMENTS } from "../data/mockData";

const categories = ['Any', 'School Supplies', 'Laundry', 'Groceries', 'Dorms/Condos', 'Repairs', 'Printing', 'Fitness', "Food", "Coffee"];

const BrowsePage = () => {
  const location = useLocation();

  // 1. Initialize states for each filter group
  const selectedCategoryFromState = location.state?.selectedCategory;
  const selectedSearchFromState = location.state?.searchQuery;
  const initialCategory = categories.includes(selectedCategoryFromState) ? selectedCategoryFromState : 'Any';
  const initialSearchQuery = typeof selectedSearchFromState === 'string' ? selectedSearchFromState : '';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeHour, setActiveHour] = useState('Any');
  const [activePrice, setActivePrice] = useState('Any');
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  // 2. NEW: State to hold the fetched establishments
  const [establishments, setEstablishments] = useState([]);
  const [loading, setLoading] = useState(true);

  const hours = ['Any', 'Open Now', '24/7'];
  const prices = ['Any', 'P', 'PP', 'PPP'];

  useEffect(() => {
    if (categories.includes(selectedCategoryFromState)) {
      setActiveCategory(selectedCategoryFromState);
    }
  }, [selectedCategoryFromState, categories]);

  useEffect(() => {
    if (typeof selectedSearchFromState === 'string') {
      setSearchQuery(selectedSearchFromState);
    }
  }, [selectedSearchFromState]);

  // 3. NEW: Fetch establishments from the database on component mount
  useEffect(() => {
    fetch('http://localhost:5000/api/establishments')
      .then(res => res.json())
      .then(data => {
        setEstablishments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch establishments:", err);
        setLoading(false);
      });
  }, []);

  // Filter establishments based on active filters, search query, AND the live database state
  const filteredEstablishments = establishments.filter(est => {
    // Category filter
    if (activeCategory !== 'Any' && est.category !== activeCategory) return false;

    // Search query filter
    if (searchQuery && !est.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

    return true; // Pass if all active filters match
  });

  return (
    <div className="bg-white min-vh-100">
      <div className="container-fluid px-5">
        <div className="row">

          {/* LEFT SIDEBAR: User Info & Filters */}
          <aside
            className="col-lg-3 pe-lg-5"
            style={{ paddingTop: '48px' }}
          >
            <div
              className="sticky-top"
              style={{ top: '128px', alignSelf: 'start', height: 'fit-content' }}
            >
            {/* Categories Filter */}
            <div className="filter-section mb-4">
              <label className="small opacity-50 fw-bold mb-2 text-uppercase d-block">Categories</label>
              <div className="d-flex flex-wrap gap-2">
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveCategory(item)} // Updates state on click
                    className={`btn rounded-pill btn-sm px-3 fw-semibold transition-all ${activeCategory === item
                        ? 'btn-success border-0 shadow-sm'
                        : 'btn-outline-dark border-dark opacity-50'
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
              <label className="small opacity-50 fw-bold mb-2 text-uppercase d-block">Hours</label>
              <div className="d-flex gap-2">
                {hours.map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveHour(item)}
                    className={`btn rounded-pill btn-sm px-3 fw-semibold transition-all ${activeHour === item
                        ? 'btn-success border-0 shadow-sm'
                        : 'btn-outline-dark border-dark opacity-50'
                      }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Prices Filter */}
            <div className="filter-section mb-5">
              <label className="small opacity-50 fw-bold mb-2 text-uppercase d-block">Prices</label>
              <div className="d-flex gap-2">
                {prices.map((item) => (
                  <button
                    key={item}
                    onClick={() => setActivePrice(item)}
                    className={`btn rounded-pill btn-sm px-3 fw-semibold transition-all ${activePrice === item
                        ? 'btn-success border-0 shadow-sm'
                        : 'btn-outline-dark border-dark opacity-50'
                      }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            </div>
          </aside>

          {/* MAIN CONTENT: Search & Results */}
          <main className="col-lg-9" style={{ paddingTop: '48px' }}>
            {/* Search Bar */}
            <div
              className="input-group mb-4 sticky-top"
              style={{ top: '128px', zIndex: 1020, width: '720px', height: 'fit-content' }}
            >
              <span className="input-group-text bg-light border-0 rounded-start-4 ps-4 py-2">
                <Search size={20} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-0 bg-light rounded-end-4 py-3 px-4"
                placeholder="Search for establishments to fit your needs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Establishment Cards Container */}
            <div style={{ paddingTop: '24px', paddingBottom: '80px', width: '720px', minHeight: '100vh' }}>
              {loading ? (
                <div className="text-center py-5">
                  <p className="text-muted fs-5">Loading establishments...</p>
                </div>
              ) : filteredEstablishments.length > 0 ? (
                filteredEstablishments.map((store) => (
                  <EstablishmentCard
                    key={store._id}       // ✅ CHANGED: MongoDB uses _id
                    id={store._id}        // ✅ CHANGED: Passing the MongoDB ID to the card
                    establishment={store}
                    name={store.name}
                    category={store.category}
                    location={store.location}
                    rating={store.rating}
                    reviewCount={store.reviewCount}
                    image={store.image}
                  />
                ))
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted fs-5">No establishments found matching your criteria.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;