import { Star, MapPin } from "lucide-react";

export default function ProfileReviews({ review }) {
  return (
    <div className="custom-card p-4 mb-3">
      {/* Date & Rating */}
      <div className="d-flex justify-content-between mb-2">
        <div className="d-flex gap-1 text-dlsu-primary">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < review.rating ? "currentColor" : "none"}
              className={
                i < review.rating
                  ? "text-dlsu-primary"
                  : "text-muted opacity-25"
              }
            />
          ))}
        </div>
        <small className="text-muted">{review.date}</small>
      </div>

      {/* Content */}
      <h5 className="fw-bold text-dlsu-dark mb-2">{review.title}</h5>
      <p className="text-secondary small mb-3">{review.body}</p>

      {/* Establishment Mini-Card */}
      <div className="d-flex align-items-center p-3 bg-light rounded border">
        <img
          src={review.establishment.image}
          alt="shop"
          className="rounded-circle me-3 object-cover"
          style={{ width: "40px", height: "40px" }}
        />
        <div>
          <h6 className="fw-bold mb-0 text-dark">
            {review.establishment.name}
          </h6>
          <small className="text-muted d-flex align-items-center gap-1">
            <MapPin size={12} /> {review.establishment.location}
          </small>
        </div>
      </div>
    </div>
  );
}
