import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Search } from "lucide-react";

import RatingFilter from "../components/browse/RatingFilter";
import EstablishmentCard from "../components/browse/EstablishmentCard";

const BrowsePage = () => {
  // 1. Initialize states for each filter group
  const [activeCategory, setActiveCategory] = useState('Any');
  const [activeHour, setActiveHour] = useState('Any');
  const [activePrice, setActivePrice] = useState('Any');

  const categories = ['Any', 'School Supplies', 'Laundry', 'Groceries', 'Dorms/Condos', 'Repairs', 'Printing', 'Fitness', "Food", "Coffee"];
  const hours = ['Any', 'Open Now', '24/7'];
  const prices = ['Any', 'P', 'PP', 'PPP'];

  const establishments = [
    {
      name: "National Book Store",
      category: categories[1],
      location: "Inside Yuchengco Hall",
      rating: 4.7,
      reviewCount: 14,
      image: "https://images.summitmedia-digital.com/spotph/images/2020/08/24/nbs-statement-closure-640-1598256966.jpg"
    },
    {
      name: "Anytime Fitness",
      category: categories[7],
      location: "Inside R Square",
      rating: 4.2,
      reviewCount: 9,
      image: "https://classpass-res.cloudinary.com/image/upload/f_auto/q_auto,w_1125/media_venue/a84kycuvqo9jblnfro8r.jpg"
    },
    {
      name: "Ate Rica's Bacsilog",
      category: categories[8],
      location: "Agno Food Court",
      rating: 4.8,
      reviewCount: 16,
      image: "https://pbs.twimg.com/media/GAeKw8KaYAAis3s.jpg"
    },
    {
      name: "Green Residences",
      category: categories[4],
      location: "Right beside DLSU",
      rating: 4.4,
      reviewCount: 12,
      image: "https://www.preselling.com.ph/wp-content/uploads/2017/05/Green-Residences-Facade.jpg"
    },
    {
      name: "ZUS Coffee",
      category: categories[9],
      location: "Inside Green Mall",
      rating: 4.9,
      reviewCount: 17,
      image: "https://www.sunwayvelocitymall.com/static/shops/21a1980b9e338ce99e2c272e85b548c5/w768.jpg"
    }
  ];

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
              <label className="small opacity-50 fw-bold mb-2 text-uppercase d-block">Categories</label>
              <div className="d-flex flex-wrap gap-2">
                {categories.map((item) => (
                  <button 
                    key={item} 
                    onClick={() => setActiveCategory(item)} // Updates state on click
                    className={`btn rounded-pill btn-sm px-3 fw-semibold transition-all ${
                      activeCategory === item 
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
                    className={`btn rounded-pill btn-sm px-3 fw-semibold transition-all ${
                      activeHour === item 
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
                    className={`btn rounded-pill btn-sm px-3 fw-semibold transition-all ${
                      activePrice === item 
                        ? 'btn-success border-0 shadow-sm' 
                        : 'btn-outline-dark border-dark opacity-50'
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
              style={{ top: '128px', zIndex: 1020, width: '720px', height: 'fit-content' }}
            >
              <span className="input-group-text bg-light border-0 rounded-start-4 ps-4 py-2">
                <Search size={20} className="text-muted" />
              </span>
              <input 
                type="text" 
                className="form-control border-0 bg-light rounded-end-4 py-3 px-4"
                placeholder="Search for establishments to fit your needs" 
              />
            </div>

            {/* Establishment Cards Container */}
            <div style={{ paddingTop: '24px', paddingBottom: '80px', width: '720px' }}>
              {establishments.map((store) => (
                <EstablishmentCard 
                  key={store.id}
                  name={store.name}
                  category={store.category}
                  location={store.location}
                  rating={store.rating}
                  reviewCount={store.reviewCount}
                  image={store.image}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;