import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";

export default function ProfileReviews({ review }) {
  // Ensure we have a valid link, fallback to '#' if no ID
  const establishmentLink = review.establishment?.id
    ? `/establishment/${review.establishment.id}`
    : "#";

  return (
    <div className="custom-card p-4 mb-3">
      {/* User Profile Header (Visible if 'user' data is provided, e.g., on Landing Page) */}
      {review.user && (
        <div className="d-flex align-items-center mb-3">
          <img
            src={review.avatar || "https://ui-avatars.com/api/?name=User&background=random"}
            alt="avatar"
            className="rounded-circle me-3 object-cover"
            style={{ width: "40px", height: "40px" }}
          />
          <div>
            <Link
              to={review.username ? `/profile/${review.username}` : "#"}
              className="fw-bold text-dark text-decoration-none hover-underline"
              style={{ display: 'block', lineHeight: '1.2' }}
            >
              {review.user}
            </Link>
          </div>
        </div>
      )}

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
      <Link to="/review" className="text-decoration-none">
        <h5 className="fw-bold text-dlsu-dark mb-2 hover-underline">{review.title}</h5>
      </Link>
      <p className="text-secondary small mb-3">{review.body}</p>

      {/* Establishment */}
      <Link
        to={establishmentLink}
        className="btn btn-light border rounded-pill d-inline-flex align-items-center pe-3 ps-1 py-1 text-decoration-none"
        style={{ maxWidth: "100%" }}
      >
        <img
          src={review.establishment.image}
          alt="shop"
          className="rounded-circle me-2 object-cover"
          style={{ width: "28px", height: "28px" }}
        />
        <div className="lh-1 text-start">
          <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: "0.8rem" }}>
            {review.establishment.name}
          </h6>
          <small
            className="text-muted d-flex align-items-center gap-1"
            style={{ fontSize: "0.7rem" }}
          >
            <MapPin size={10} /> {review.establishment.location}
          </small>
        </div>
      </Link>
    </div>
  );
}
