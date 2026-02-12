import { Star } from "lucide-react";

const EstablishmentCardSmall = ({ 
  name, 
  category,
  location, 
  rating, 
  reviewCount, 
  image 
}) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 bg-light h-100">
      <img
        src={image}
        className="card-img-top rounded-3 w-100 mb-2"
        style={{ height: '280px', objectFit: 'cover', borderRadius: '20px' }}
        alt={name}
      />
      <div className="card-body px-0 pb-0">
        <h5 className="fw-bold mb-1">{name}</h5>
        <p className="text-muted small mb-3">{category} • {location}</p>
        <div className="d-flex justify-content-between align-items-end">
          <span className="fw-bold text-dlsu-primary">
            <Star size={20} fill={"currentColor"} className="text-success me-2"/>
            {rating} <span className="text-muted fw-normal">• {reviewCount} Reviews</span>
          </span>
          <a
            href="#"
            className="text-dark text-decoration-none small fw-bold"
          >
            View ↗
          </a>
        </div>
      </div>
    </div>
  );
};

export default EstablishmentCardSmall;