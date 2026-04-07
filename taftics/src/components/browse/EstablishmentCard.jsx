import { Link } from "react-router-dom";
import { Star } from "lucide-react";

const parseTimeToMinutes = (timeLabel) => {
  if (!timeLabel) return null;
  const normalized = String(timeLabel).trim().toUpperCase();
  const match = normalized.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3];

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    minutes < 0 ||
    minutes > 59 ||
    hours < 1 ||
    hours > 12
  ) {
    return null;
  }

  if (hours === 12) hours = 0;
  if (period === "PM") hours += 12;
  return hours * 60 + minutes;
};

const getOpenStatusFromBusinessHours = (businessHours) => {
  if (!businessHours)
    return { label: "Hours unavailable", isOpen: false, known: false };

  const normalized = String(businessHours).trim();
  if (normalized.toLowerCase().includes("24/7")) {
    return { label: "Open", isOpen: true, known: true };
  }

  const parts = normalized.split("-").map((part) => part.trim());
  if (parts.length !== 2) {
    return { label: "Hours unavailable", isOpen: false, known: false };
  }

  const openMinutes = parseTimeToMinutes(parts[0]);
  const closeMinutes = parseTimeToMinutes(parts[1]);
  if (openMinutes == null || closeMinutes == null) {
    return { label: "Hours unavailable", isOpen: false, known: false };
  }

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let isOpen;
  if (openMinutes === closeMinutes) {
    isOpen = true;
  } else if (openMinutes < closeMinutes) {
    isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  } else {
    // Overnight schedule: e.g., 8:00 PM - 5:00 AM
    isOpen = currentMinutes >= openMinutes || currentMinutes < closeMinutes;
  }

  return { label: isOpen ? "Open" : "Closed", isOpen, known: true };
};

const EstablishmentCard = ({
  id,
  name,
  category,
  location,
  rating,
  reviewCount,
  image,
  establishment,
}) => {
  const openStatus = getOpenStatusFromBusinessHours(
    establishment?.businessHours,
  );

  return (
    <div
      className="custom-card p-3 mb-5 overflow-hidden mx-auto"
      style={{ width: "720px", height: "auto" }}
    >
      {/* 1. Full-Width Header Image Wrapper */}
      <div className="mx-auto mb-4" style={{ height: "280px" }}>
        <Link to={`/establishment/${id}`} state={{ establishment }}>
          <img
            src={
              image ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00441b&color=fff&size=512&bold=true`
            }
            className="w-100 h-100"
            style={{ objectFit: "cover", borderRadius: "12px" }}
            alt={name}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00441b&color=fff&size=512&bold=true`;
            }}
          />
        </Link>
      </div>

      {/* 2. Content Area */}
      <div style={{ padding: "4px", marginBottom: "-8px" }}>
        <div className="align-items-start mb-4">
          <div>
            <Link
              to={`/establishment/${id}`}
              state={{ establishment }}
              className="d-block text-dark text-decoration-none fw-bold fs-4"
            >
              {name}
            </Link>
            <p className="opacity-50 fs-5">
              {category} • {location}
            </p>
            <div className="d-inline-flex align-items-center gap-2">
              <span
                className="badge text-uppercase rounded-pill"
                style={{
                  backgroundColor: openStatus.known
                    ? openStatus.isOpen
                      ? "#e8f7ed"
                      : "#fdecec"
                    : "#f1f3f5",
                  color: openStatus.known
                    ? openStatus.isOpen
                      ? "#1e7e34"
                      : "#b02a37"
                    : "#6c757d",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  padding: "6px 10px",
                }}
              >
                {openStatus.label}
              </span>
              {establishment?.businessHours ? (
                <small className="text-muted">
                  {establishment.businessHours}
                </small>
              ) : null}
            </div>
          </div>
        </div>

        {/* 3. Rating Row */}
        <div className="d-flex justify-content-between align-items-end mt-1 mb-1">
          <h1 className="fs-5 mb-0 d-flex align-items-start">
            <Star
              size={20}
              fill={"currentColor"}
              className="text-success me-2"
            />
            <span className="text-success fw-bold">{rating}</span>
            <span className="ms-2 opacity-50 fw-normal">
              • {reviewCount} Reviews
            </span>
          </h1>

          <div className="text-end">
            <Link
              to="/create"
              state={{ establishment }}
              className="d-block text-dark text-decoration-none fw-bold fs-5"
            >
              Write a review ↗
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstablishmentCard;
