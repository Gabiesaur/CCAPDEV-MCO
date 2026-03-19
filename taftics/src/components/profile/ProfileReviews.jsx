import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";

export default function ProfileReviews({ review }) {
  // Unpack live MongoDB references or fallback to mock data names
  const establishmentData = review.establishmentId || review.establishment || {};
  const userData = review.userId || review.user || null;

  const getRelativeTime = (dateString) => {
    if (!dateString) return "Just now";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Fallback if it's already "3 days ago"

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `Just now`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };

  const displayDate = getRelativeTime(review.date);

  // Ensure we have a valid link, fallback to '#' if no ID
  const establishmentLink = establishmentData._id || establishmentData.id
    ? `/establishment/${establishmentData._id || establishmentData.id}`
    : "#";

  return (
    <div className="custom-card p-4 mb-3">
      {/* User Profile Header (Visible if 'user' data is provided, e.g., on Landing Page) */}
      {userData && (
        <div className="d-flex align-items-center mb-3">
          <img
            src={userData.avatar || review.avatar || "https://ui-avatars.com/api/?name=User&background=random"}
            alt="avatar"
            className="rounded-circle me-3 object-cover"
            style={{ width: "40px", height: "40px" }}
          />
          <div>
            <Link
              to={userData.username ? `/profile/${userData.username}` : review.username ? `/profile/${review.username}` : "#"}
              className="fw-bold text-dark text-decoration-none hover-underline"
              style={{ display: 'block', lineHeight: '1.2' }}
            >
              {typeof userData === 'string' ? userData : userData.name || userData.username}
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
        <small className="text-muted">{displayDate}</small>
      </div>

      {/* Content */}
      <Link to={`/review/${review._id}`} className="text-decoration-none">
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
          src={establishmentData.image || "https://images.unsplash.com/photo-1554118811-1e0d58224f24"}
          alt="shop"
          className="rounded-circle me-2 object-cover"
          style={{ width: "28px", height: "28px" }}
        />
        <div className="lh-1 text-start">
          <h6 className="fw-bold mb-0 text-dark text-truncate" style={{ fontSize: "0.8rem", maxWidth: "150px" }}>
            {establishmentData.name || "Unknown Establishment"}
          </h6>
          <small
            className="text-muted d-flex align-items-center gap-1 text-truncate"
            style={{ fontSize: "0.7rem", maxWidth: "150px" }}
          >
            <MapPin size={10} className="flex-shrink-0" /> {establishmentData.location || "Philippines"}
          </small>
        </div>
      </Link>
    </div>
  );
}
