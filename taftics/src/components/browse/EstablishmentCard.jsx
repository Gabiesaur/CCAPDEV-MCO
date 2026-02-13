import { Link } from "react-router-dom";
import { Star } from "lucide-react";

const EstablishmentCard = ({
  id,
  name,
  category,
  location,
  rating,
  reviewCount,
  image
}) => {
  return (
    <div
      className="custom-card p-3 mb-5 overflow-hidden mx-auto"
      style={{ width: '720px', height: 'auto' }}
    >
      {/* 1. Full-Width Header Image Wrapper */}
      <div className="mx-auto mb-4" style={{ height: '280px' }}>
        <Link to={`/establishment/${id}`}>
          <img
            src={image}
            className="w-100 h-100"
            style={{ objectFit: 'cover', borderRadius: '12px' }}
            alt={name}
          />
        </Link>
      </div>

      {/* 2. Content Area */}
      <div style={{ padding: '4px', marginBottom: '-8px' }}>
        <div className="align-items-start mb-4">
          <div>
            <Link to={`/establishment/${id}`} className="d-block text-dark text-decoration-none fw-bold fs-4">{name}</Link>
            <p className="opacity-50 fs-5">{category} • {location}</p>
          </div>
        </div>

        {/* 3. Rating Row */}
        <div className="d-flex justify-content-between align-items-end mt-1 mb-1">
          <h1 className="fs-5 mb-0 d-flex align-items-start">
            <Star size={20} fill={"currentColor"} className="text-success me-2" />
            <span className="text-success fw-bold">{rating}</span>
            <span className="ms-2 opacity-50 fw-normal">• {reviewCount} Reviews</span>
          </h1>

          <div className="text-end">
            <Link to={`/establishment/${id}`} className="d-block text-dark text-decoration-none fw-bold fs-5">
              Write a review ↗
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstablishmentCard;