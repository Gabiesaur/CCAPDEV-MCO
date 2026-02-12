import React, { useState } from 'react';

const RatingFilter = () => {
  // 1. Create a state to track the selected rating
  const [selectedRating, setSelectedRating] = useState(null);

  return (
    <div className="filter-section mb-3">
      <label className="small opacity-50 fw-bold mb-1 text-uppercase d-block" style={{ letterSpacing: '1px' }}>
        Rating
      </label>
      
      <div className="d-flex flex-column gap-2">
        {/* Star Level Options */}
        {[4, 3, 2, 1, 0].map((stars) => (
          <button 
            key={stars}
            // 2. Dynamically change text color based on selection
            className={`btn btn-link text-decoration-none p-0 d-flex align-items-center hover-opacity ${
              selectedRating === stars ? 'text-success' : 'text-dark'
            }`}
            style={{ width: 'fit-content' }}
            // 3. Update the state when clicked
            onClick={() => setSelectedRating(stars)}
          >
            <div className="me-2" style={{ color: '#48a868', fontSize: '1.2rem' }}>
              {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
            </div>
            <span className={`small ${selectedRating === stars ? 'fw-bold' : 'fw-semibold'}`}>
              & Up
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RatingFilter;