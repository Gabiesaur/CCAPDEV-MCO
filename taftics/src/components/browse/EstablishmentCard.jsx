import { Link } from "react-router-dom";
import { Star } from "lucide-react";

const EstablishmentCard = ({ 
  name, 
  category, 
  location, 
  rating, 
  reviewCount, 
  image 
}) => {
  return (
    <div 
      className="border-0 bg-light rounded-5 mb-5 overflow-hidden shadow-sm mx-auto" 
      style={{ width: '100%', height: 'auto' }}
    >
      {/* 1. Full-Width Header Image Wrapper */}
      <div className="mx-auto" style={{ paddingTop: '40px', height: '400px', width: '90%' }}>
        <img 
          src={image} 
          className="w-100 h-100" 
          style={{ objectFit: 'cover', borderRadius: '20px' }} 
          alt={name}
        />
      </div>

      {/* 2. Content Area */}
      <div style={{ padding: '40px', marginBottom: '-8px' }}>
        <div className="align-items-start">
          <div>
            <h1 className="fw-bold fs-2 mb-1">{name}</h1>
            <p className="opacity-50 fs-5">{category} • {location}</p>
          </div>
        </div>

        {/* 3. Rating Row */}
        <div className="d-flex justify-content-between align-items-end mt-2">
          <h1 className="fs-4 mb-0 d-flex align-items-end">
            <Star size={32} fill={"currentColor"} className="text-success me-2"/>
            <span className="text-success fw-bold">{rating}</span> 
            <span className="ms-2 opacity-50 fw-normal">• {reviewCount} Reviews</span>
          </h1>

          <div className="text-end">
            <Link to="/" className="d-block text-dark text-decoration-none fw-bold fs-5 mb-2">
              View establishment ↗
            </Link>
            <Link to="/review" className="d-block text-dark text-decoration-none fw-bold fs-5">
              Write a review ↗
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstablishmentCard;