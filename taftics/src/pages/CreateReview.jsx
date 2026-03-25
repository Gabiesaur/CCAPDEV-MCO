import React from "react";
import { Star, CheckCircle2, ChevronDown } from "lucide-react";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";

function CreateReview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser } = useOutletContext() || {};
  const stars = Array(5).fill(0);
  const [rating, setRating] = React.useState(0);
  const [hover, setHover] = React.useState(0);
  const [titleText, setTitleText] = React.useState("");
  const [reviewText, setReviewText] = React.useState("");

  // Toast State
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const initialEstablishment = location.state?.establishment || null;
  const selectedReviews = Array.isArray(location.state?.reviews)
    ? location.state.reviews
    : [];
  const [selectedEstablishment, setSelectedEstablishment] =
    React.useState(initialEstablishment);
  const [establishments, setEstablishments] = React.useState(
    initialEstablishment ? [initialEstablishment] : [],
  );
  const [establishmentReviews, setEstablishmentReviews] =
    React.useState(selectedReviews);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    let ignore = false;

    const loadEstablishments = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/establishments",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch establishments");
        }

        const data = await response.json();
        if (ignore) return;

        const fetchedList = Array.isArray(data) ? data : [];
        if (
          initialEstablishment &&
          !fetchedList.some((est) => est?._id === initialEstablishment._id)
        ) {
          setEstablishments([initialEstablishment, ...fetchedList]);
        } else {
          setEstablishments(fetchedList);
        }
      } catch {
        if (!ignore) {
          setEstablishments(initialEstablishment ? [initialEstablishment] : []);
        }
      }
    };

    loadEstablishments();

    return () => {
      ignore = true;
    };
  }, [initialEstablishment]);

  React.useEffect(() => {
    let ignore = false;

    const loadEstablishmentReviews = async () => {
      if (!selectedEstablishment?._id) {
        setEstablishmentReviews([]);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/api/establishments/${selectedEstablishment._id}/reviews`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch establishment reviews");
        }

        const data = await response.json();
        if (!ignore) {
          setEstablishmentReviews(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!ignore) {
          const sameAsInitial =
            selectedEstablishment?._id &&
            initialEstablishment?._id &&
            selectedEstablishment._id === initialEstablishment._id;
          setEstablishmentReviews(sameAsInitial ? selectedReviews : []);
        }
      }
    };

    loadEstablishmentReviews();

    return () => {
      ignore = true;
    };
  }, [selectedEstablishment?._id, initialEstablishment?._id]);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEstablishmentChange = (selectedId) => {
    const nextEstablishment =
      establishments.find((est) => est?._id === selectedId) || null;
    setSelectedEstablishment(nextEstablishment);
    setIsDropdownOpen(false);
  };

  const fallbackData = {
    name: "Select an establishment",
    type: "Establishment",
    rating: 0,
    totalReviews: 0,
  };

  const establishmentData = selectedEstablishment
    ? {
        name: selectedEstablishment.name || "Unknown Establishment",
        type: selectedEstablishment.category || "Establishment",
        rating: selectedEstablishment.rating ?? 0,
        totalReviews: selectedEstablishment.reviewCount ?? 0,
        image: selectedEstablishment.image || "",
      }
    : fallbackData;

  const handleClick = (index) => {
    setRating(index + 1);
  };

  const handleMouseEnter = (index) => {
    setHover(index + 1);
  };

  const handleMouseLeave = () => {
    setHover(0);
  };

  const fileInputRef = React.useRef(null);
  const [images, setImages] = React.useState([]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 6);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => {
      const combined = [...prev, ...newImages];
      return combined.slice(0, 6);
    });
    e.target.value = null;
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const copy = prev.slice();
      URL.revokeObjectURL(copy[index].url);
      copy.splice(index, 1);
      return copy;
    });
  };

  const starCounts = establishmentReviews.reduce(
    (acc, rev) => {
      const normalizedRating = Math.round(Number(rev?.rating || 0));
      if (normalizedRating >= 1 && normalizedRating <= 5) {
        acc[5 - normalizedRating] += 1;
      }
      return acc;
    },
    [0, 0, 0, 0, 0],
  );

  const totalReviews =
    establishmentReviews.length || establishmentData.totalReviews || 0;

  const average =
    establishmentReviews.length > 0
      ? establishmentReviews.reduce(
          (sum, rev) => sum + Number(rev?.rating || 0),
          0,
        ) / establishmentReviews.length
      : Number(establishmentData.rating || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Basic Validation
    if (rating === 0) {
      alert("Please provide a rating.");
      return;
    }
    if (!currentUser) {
      alert("You must be logged in to post a review.");
      return;
    }
    if (!selectedEstablishment?._id) {
      alert("Please choose an establishment before submitting this review.");
      return;
    }

    // 2. Prepare FormData (required for file uploads)
    const formData = new FormData();
    formData.append("userId", currentUser._id);
    formData.append("establishmentId", selectedEstablishment._id);
    formData.append("rating", rating);
    formData.append("title", titleText);
    formData.append("body", reviewText);

    // Append each selected image file
    images.forEach((imgObj) => {
      formData.append("images", imgObj.file);
    });

    try {
      const response = await fetch("http://localhost:3000/api/reviews", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errResult = await response.json().catch(() => ({}));
        throw new Error(errResult.message || "Failed to submit review.");
      }

      const result = await response.json();

      triggerToast("Review submitted successfully! Redirecting...");
      setTimeout(() => {
        navigate(`/establishment/${selectedEstablishment._id}`);
      }, 2000);
    } catch (err) {
      console.error("Submission error:", err);
      alert(
        err.message || "Something went wrong while submitting your review.",
      );
    }
  };

  return (
    <div className="position-relative">
      {/* Success Toast (Matching MyProfilePage style) */}
      {showToast && (
        <div className="toast-success-custom fw-bold" style={{ zIndex: 9999 }}>
          <CheckCircle2 size={24} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="d-flex flex-column align-items-center min-vw-100">
        <div className="d-flex flex-column align-items-left w-75">
          <h1 className="mb-4 fs-1 fw-semibold pt-4">Create Review</h1>
          <div className="mb-4" style={{ maxWidth: "420px" }}>
            <div className="position-relative" ref={dropdownRef}>
              <button
                type="button"
                className="btn w-100 border rounded-4 bg-white shadow-sm p-2 text-start d-flex align-items-center justify-content-between"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              >
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={
                      selectedEstablishment?.image ||
                      "https://ui-avatars.com/api/?name=Establishment"
                    }
                    alt={selectedEstablishment?.name || "establishment"}
                    style={{
                      width: "48px",
                      height: "48px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                  <div className="d-flex flex-column lh-sm">
                    <span className="fw-bold text-dark">
                      {selectedEstablishment?.name || "Select an establishment"}
                    </span>
                    <small className="text-muted">
                      {selectedEstablishment?.location ||
                        "Choose where to post your review"}
                    </small>
                  </div>
                </div>
                <ChevronDown size={18} className="text-muted" />
              </button>

              {isDropdownOpen && (
                <div
                  className="position-absolute w-100 bg-white border rounded-4 shadow-sm mt-2"
                  style={{ zIndex: 20, maxHeight: "280px", overflowY: "auto" }}
                >
                  {establishments.map((est) => (
                    <button
                      key={est._id}
                      type="button"
                      className="btn w-100 text-start px-2 py-2 border-0 rounded-0"
                      style={{
                        backgroundColor:
                          selectedEstablishment?._id === est._id
                            ? "#f1f8f4"
                            : "transparent",
                      }}
                      onClick={() => handleEstablishmentChange(est._id)}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={
                            est.image ||
                            "https://ui-avatars.com/api/?name=Establishment"
                          }
                          alt={est.name || "establishment"}
                          style={{
                            width: "48px",
                            height: "48px",
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
                        />
                        <div className="d-flex flex-column lh-sm">
                          <span className="fw-bold text-dark">
                            {est.name || "Unknown Establishment"}
                          </span>
                          <small className="text-muted">
                            {est.location || "Unknown location"}
                          </small>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="d-flex flex-row justify-content-between w-75">
          <div
            className="custom-card border p-3 d-flex align-items-center justify-content-center mb-5"
            style={{ width: "60%", height: "700px" }}
          >
            <div style={{ width: "95%", height: "95%" }}>
              <p className="fw-bold small opacity-75">QUALITY SCORE</p>
              <div
                className="textBox p-3 d-flex flex-row justify-content-between align-items-center"
                style={{ width: "52%" }}
              >
                <div className="d-flex flex-row gap-1">
                  {stars.map((_, index) => {
                    return (
                      <Star
                        key={index}
                        size={26}
                        fill={
                          index < (hover || rating) ? "currentColor" : "none"
                        }
                        style={{
                          cursor: "pointer",
                          color:
                            index < (hover || rating) ? "#41AB5D" : "#9ca3af",
                        }}
                        onClick={() => handleClick(index)}
                        onMouseOver={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                      />
                    );
                  })}
                </div>
                <p className="mb-0 small text-muted">Select Rating</p>
              </div>
              <p className="mt-4 fw-bold small opacity-75">TITLE</p>
              <textarea
                className="border-0 fs-5"
                placeholder="Summarize your experience..."
                rows={1}
                style={{
                  backgroundColor: "transparent",
                  color: "#2d3436",
                  width: "100%",
                  height: "30px",
                  outline: "none",
                  resize: "none",
                  overflow: "hidden",
                }}
                value={titleText}
                onChange={(e) => setTitleText(e.target.value)}
              />
              <hr
                className="border-2 opacity-100 mt-0"
                style={{ color: "#A0ACC9" }}
              />
              <p className="mt-4 fw-bold small opacity-75">DETAILS</p>
              <div className="mb-3">
                <textarea
                  className="form-control border-0 rounded-4 p-4 shadow-sm"
                  placeholder="Tell us your experience. How was the service?"
                  rows={8}
                  style={{
                    backgroundColor: "#f1f2f6",
                    color: "#2d3436",
                    resize: "none",
                  }}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
              </div>
              <p className="mt-4 fw-bold small opacity-75">MEDIA (PHOTOS)</p>
              <div className="mb-3">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFilesChange}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  className="btn btn-outline-success rounded-pill px-4 btn-sm mb-2"
                  onClick={handleUploadClick}
                >
                  Upload Photos
                </button>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="position-relative"
                      style={{ width: 80, height: 80 }}
                    >
                      <img
                        src={img.url}
                        alt={`preview-${i}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 12,
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute rounded-circle shadow"
                        style={{
                          top: -8,
                          right: -8,
                          width: 24,
                          height: 24,
                          padding: 0,
                        }}
                        onClick={() => removeImage(i)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className="custom-card border shadow-sm"
            style={{ width: "35%", height: "fit-content" }}
          >
            <div
              className="custom-bg pt-4 ps-4 pe-4 pb-2"
              style={{
                height: "150px",
                borderRadius: "20px 20px 0 0",
                backgroundImage: establishmentData.image
                  ? `linear-gradient(rgba(0, 24, 12, 0.55), rgba(0, 24, 12, 0.55)), url(${establishmentData.image})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="d-flex flex-column h-100 justify-content-end">
                <div
                  className="category-box d-inline-flex justify-content-center align-items-center mb-2"
                  style={{ width: "fit-content", padding: "4px 12px" }}
                >
                  <p
                    className="text-white mb-0 fw-bold"
                    style={{ fontSize: 12 }}
                  >
                    {(establishmentData.type || "ESTABLISHMENT").toUpperCase()}
                  </p>
                </div>
                <h3 className="text-white fw-bold mb-3">
                  {establishmentData.name}
                </h3>
              </div>
            </div>
            <div className="p-4 d-flex flex-column gap-3 sticky-top">
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex flex-row align-items-center gap-2">
                  <div className="fw-bold fs-3 text-dlsu-dark">
                    {average ? average.toFixed(1) : "0.0"}
                  </div>
                  <div className="text-muted">({totalReviews} reviews)</div>
                </div>

                <div className="d-flex align-items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      fill={i < Math.round(average) ? "#41AB5D" : "none"}
                      style={{
                        color: i < Math.round(average) ? "#41AB5D" : "#9ca3af",
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="d-flex flex-column gap-2 mt-2">
                {[5, 4, 3, 2, 1].map((num) => {
                  const starsCount = starCounts[5 - num];
                  const percent = (starsCount / (totalReviews || 1)) * 100 || 0;
                  return (
                    <div
                      key={num}
                      className="d-flex flex-row align-items-center"
                    >
                      <span
                        className="me-2 small fw-bold"
                        style={{ width: "15px" }}
                      >
                        {num}
                      </span>
                      <div
                        className="progress flex-grow-1"
                        style={{ height: "8px", backgroundColor: "#f1f2f6" }}
                      >
                        <div
                          className="progress-bar bg-success"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <span
                        className="ms-2 small text-muted"
                        style={{ width: "36px", textAlign: "right" }}
                      >
                        {starsCount}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div
                className="bg-light p-3 rounded-4 mt-3"
                style={{ fontSize: 13, border: "1px dashed #ced4da" }}
              >
                <p className="mb-0 text-muted italic">
                  "Your reviews help establishments build trust and receive
                  valuable feedback."
                </p>
              </div>

              <button
                onClick={handleSubmit}
                className="btn btn-dlsu-dark w-100 py-3 rounded-pill fw-bold mt-2 shadow-sm"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateReview;
