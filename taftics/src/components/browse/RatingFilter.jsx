import { useState } from 'react';
import { Star } from 'lucide-react';

const RatingFilter = () => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="filter-section mb-4">
      <label className="small opacity-50 fw-bold mb-2 text-uppercase d-block" style={{ letterSpacing: '1px' }}>
        Minimum Rating
      </label>
      
      <div className="d-flex align-items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="btn btn-link p-0 border-0 text-decoration-none transition-all"
            onClick={() => setSelectedRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            style={{ outline: 'none', boxShadow: 'none' }}
          >
            <Star
              size={24}
              // Fill if star is <= selected OR <= hovered
              fill={(hoverRating || selectedRating) >= star ? "#48a868" : "none"}
              // Stroke color changes based on selection
              stroke={(hoverRating || selectedRating) >= star ? "#48a868" : "#ced4da"}
              className="transition-all"
              style={{ cursor: 'pointer' }}
            />
          </button>
        ))}

        {/* Dynamic Label for Clarity */}
        {selectedRating > 0 && (
          <span className="ms-2 small fw-bold text-success animate-fade-in">
            {selectedRating}+ Stars
          </span>
        )}
      </div>
      
      {/* Reset Option */}
      {selectedRating > 0 && (
        <button 
          className="btn btn-link btn-sm p-0 mt-2 text-muted small text-decoration-none"
          onClick={() => setSelectedRating(0)}
        >
          Clear Filter
        </button>
      )}
    </div>
  );
};

export default RatingFilter;