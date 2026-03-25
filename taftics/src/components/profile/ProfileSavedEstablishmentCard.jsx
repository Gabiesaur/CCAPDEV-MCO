import { Link } from "react-router-dom";
import { Star, MapPin, Navigation } from "lucide-react";

export default function ProfileSavedEstablishmentCard({ establishment }) {
  const averageRating = establishment.reviews && establishment.reviews.length > 0 
        ? (establishment.reviews.reduce((sum, rev) => sum + Number(rev.rating || 0), 0) / establishment.reviews.length).toFixed(1)
        : (establishment.rating || 0).toFixed(1);

  return (
    <div className="custom-card mb-3 p-3 overflow-hidden d-flex flex-row align-items-center gap-3">
      {/* Establishment Cover Image */}
      <img
        src={establishment.image || "https://images.unsplash.com/photo-1554118811-1e0d58224f24"}
        alt={establishment.name}
        className="rounded-3 shadow-sm"
        style={{ width: "120px", height: "120px", objectFit: "cover", flexShrink: 0 }}
      />
      
      {/* Details Vector */}
      <div className="d-flex flex-column flex-grow-1 justify-content-center h-100">
        <Link to={`/establishment/${establishment._id || establishment.id}`} className="text-decoration-none text-dark hover-underline">
           <h5 className="fw-bold mb-1 fs-5">{establishment.name}</h5>
        </Link>
        
        <div className="d-flex align-items-center mb-2 gap-2 text-muted">
           <div className="bg-dlsu-light text-dlsu-dark px-2 py-0 rounded-pill small fw-bold">
              {establishment.category || "General"}
           </div>
           <small className="d-flex align-items-center gap-1">
              <Star size={14} fill="#41AB5D" style={{ color: "#41AB5D" }} />
              <span className="fw-bold text-dark">{averageRating}</span>
              <span>({establishment.reviews?.length || 0} reviews)</span>
           </small>
        </div>

        <p className="text-muted d-flex align-items-start gap-1 mb-2 small text-truncate" style={{ maxWidth: "100%" }}>
           <MapPin size={14} className="mt-1 flex-shrink-0" /> 
           {establishment.location || establishment.address}
        </p>

        {/* Action Button */}
        <div>
           <Link to={`/establishment/${establishment._id || establishment.id}`} className="btn btn-outline-dlsu btn-sm d-inline-flex align-items-center gap-1">
              <Navigation size={14} /> Visit Page
           </Link>
        </div>
      </div>
    </div>
  );
}
