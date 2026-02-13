import { Link } from "react-router-dom";
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
        <Link to="/establishment" className="fw-bold fs-5 text-decoration-none text-dark mb-1">{name}</Link>
        <p className="text-muted small mb-3">{category} • {location}</p>
        <div className="d-flex flex-row align-items-start" style={{ marginBottom: "-8px" }}>
          <Star size={16} fill={"currentColor"} className="text-success me-2"/>
          <h1 className="fs-6 fw-bold text-dlsu-primary">{rating} <span className="text-muted fw-normal">• {reviewCount} Reviews</span></h1>
        </div>
      </div>
    </div>
  );
};

export default EstablishmentCardSmall;