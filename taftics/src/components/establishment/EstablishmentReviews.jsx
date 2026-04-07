import { Link } from "react-router-dom";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle2,
  ChevronDown,
  Check,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import ReviewEditModal from "./ReviewEditModal";

// Helper for relative date
const getRelativeDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`;

  return date.toLocaleDateString();
};

const getReviewAuthor = (rev) => {
  const userObj = rev.userId || {};
  const fullName = userObj.name || userObj.username || rev.user || "Unknown";
  const username = userObj.username || rev.username || "unknown";
  const avatar =
    userObj.avatar ||
    rev.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`;

  return { fullName, username, avatar };
};

export default function EstablishmentReviews({
  reviews,
  establishment,
  currentUser,
}) {
  // Create local state for reviews so we can modify them (edit/delete)
  const [localReviews, setLocalReviews] = useState(reviews);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("date_desc");
  const [maxRating, setMaxRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null); // Track which review menu is open
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false); // Track sort dropdown

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Sync props to local state if props change (e.g. initial load)
  useEffect(() => {
    setLocalReviews(reviews);
  }, [reviews]);

  // Local state for filtered reviews
  const filteredReviews = localReviews.filter((r) => {
    const author = getReviewAuthor(r);
    const title = (r.title || "").toLowerCase();
    const bodyText = (r.body || r.comment || "").toLowerCase();
    const authorName = (author.fullName || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    const rating = Number(r.rating || 0);

    return (
      (maxRating === 0 || rating == maxRating) &&
      (title.includes(query) ||
        bodyText.includes(query) ||
        authorName.includes(query))
    );
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    const aDate = new Date(a.date).getTime();
    const bDate = new Date(b.date).getTime();
    const aRating = Number(a.rating || 0);
    const bRating = Number(b.rating || 0);
    const aHelpful = a.helpfulVoters ? a.helpfulVoters.length : 0;
    const bHelpful = b.helpfulVoters ? b.helpfulVoters.length : 0;

    switch (sortOption) {
      case "date_asc":
        return aDate - bDate;
      case "rating_desc":
        return bRating - aRating;
      case "rating_asc":
        return aRating - bRating;
      case "helpful_desc":
        return bHelpful - aHelpful;
      case "date_desc":
      default:
        return bDate - aDate;
    }
  });

  const reviewsPerPage = 3;
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const paginatedReviews = sortedReviews.slice(
    startIndex,
    startIndex + reviewsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOption, maxRating]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
      setIsSortDropdownOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleVote = async (rev, type) => {
    if (!currentUser) {
      triggerToast("Please login to vote.");
      return;
    }

    const reviewId = rev._id && rev._id.$oid ? rev._id.$oid : rev._id || rev.id;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}/vote`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUser._id, type }),
        },
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();
      if (data.success) {
        data.review.isOwnReview = rev.isOwnReview;
        setLocalReviews((prev) =>
          prev.map((r) =>
            ((r._id && r._id.$oid) || r._id || r.id) === reviewId
              ? { ...r, ...data.review }
              : r,
          ),
        );
      } else {
        triggerToast(data.message || "Failed to submit vote");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      triggerToast("Failed to connect to server");
    }
  };

  const toggleMenu = (e, id) => {
    e.stopPropagation(); // Prevent closing immediately
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleEditClick = (review) => {
    setEditingReview(review);
    setIsEditModalOpen(true);
    setOpenMenuId(null); // Close the menu
  };

  const handleSaveEdit = async (updatedReview) => {
    try {
      const reviewId = updatedReview._id || updatedReview.id;

      const formData = new FormData();
      formData.append("rating", updatedReview.rating);
      formData.append("title", updatedReview.title);
      formData.append("body", updatedReview.body || updatedReview.comment);

      if (updatedReview.existingImages) {
        updatedReview.existingImages.forEach((url) =>
          formData.append("existingImages", url),
        );
      }
      if (updatedReview.newImages) {
        updatedReview.newImages.forEach((img) =>
          formData.append("images", img.file),
        );
      }

      if (updatedReview.existingVideos) {
        updatedReview.existingVideos.forEach((url) =>
          formData.append("existingVideos", url),
        );
      }
      if (updatedReview.newVideos) {
        updatedReview.newVideos.forEach((vid) =>
          formData.append("videos", vid.file),
        );
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}`,
        {
          method: "PUT",
          body: formData,
        },
      );

      const data = await res.json();
      if (data.success) {
        const finalReview = data.review
          ? { ...updatedReview, ...data.review }
          : updatedReview;
        finalReview.isEdited = true;

        setLocalReviews((prev) =>
          prev.map((r) => ((r._id || r.id) === reviewId ? finalReview : r)),
        );
        triggerToast("Review updated successfully!");
        setOpenMenuId(null);
      } else {
        triggerToast(data.message || "Failed to update review");
      }
    } catch (error) {
      console.error("Failed to update review:", error);
      triggerToast("Failed to connect to server");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reviews/${id}`,
        {
          method: "DELETE",
        },
      );
      const data = await res.json();

      if (data.success) {
        setLocalReviews((prev) => prev.filter((r) => (r._id || r.id) !== id));
        triggerToast("Review deleted successfully!");
        setOpenMenuId(null);
      } else {
        triggerToast(data.message || "Failed to delete review");
      }
    } catch (error) {
      console.error("Failed to delete review:", error);
      triggerToast("Failed to connect to server");
    }
  };

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div
      className="custom-card d-flex flex-column p-3 mt-3 position-relative"
      style={{ minHeight: "200px" }} // Use minHeight instead of fixed height
    >
      {/* TOAST NOTIFICATION */}
      {showToast && (
        <div className="toast-success-custom fw-bold" style={{ zIndex: 9999 }}>
          <CheckCircle2 size={24} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <ReviewEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          review={editingReview}
          onSave={handleSaveEdit}
        />
      )}

      <div className="d-flex flex-column h-100">
        <div className="d-flex flex-row align-items-center justify-content-between mb-3">
          <p className="h3 mb-0 fw-bold">Reviews</p>
          <div className="d-flex flex-column gap-2" style={{ width: "70%" }}>
            <div className="d-flex flex-row align-items-center gap-2">
              <div className="position-relative" style={{ minWidth: "220px" }}>
                <button
                  className="btn d-flex align-items-center justify-content-between w-100"
                  style={{
                    background: "#ffffff",
                    border: "1px solid",
                    borderColor: isSortDropdownOpen ? "#41AB5D" : "#dee2e6",
                    borderRadius: "6px",
                    color: "#444646",
                    fontSize: "14px",
                    padding: "8px 12px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    transition: "all 0.2s ease",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSortDropdownOpen(!isSortDropdownOpen);
                    setOpenMenuId(null);
                  }}
                  onMouseEnter={(e) => {
                    if (!isSortDropdownOpen)
                      e.currentTarget.style.borderColor = "#41AB5D";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSortDropdownOpen)
                      e.currentTarget.style.borderColor = "#dee2e6";
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold" style={{ color: "#444646" }}>
                      Sort by:
                    </span>
                    <span style={{ color: "#6b7280" }}>
                      {sortOption === "date_desc" && "Newest"}
                      {sortOption === "date_asc" && "Oldest"}
                      {sortOption === "rating_desc" && "Highest rating"}
                      {sortOption === "rating_asc" && "Lowest rating"}
                      {sortOption === "helpful_desc" && "Most helpful"}
                    </span>
                  </div>
                  <ChevronDown
                    size={16}
                    style={{
                      color: "#9ca3af",
                      transform: isSortDropdownOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </button>

                {isSortDropdownOpen && (
                  <div
                    className="position-absolute bg-white shadow rounded mt-1 w-100 py-1"
                    style={{
                      zIndex: 20,
                      top: "100%",
                      left: 0,
                      border: "1px solid #e5e7eb",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                  >
                    {[
                      { value: "date_desc", label: "Newest" },
                      { value: "date_asc", label: "Oldest" },
                      { value: "rating_desc", label: "Highest rating" },
                      { value: "rating_asc", label: "Lowest rating" },
                      { value: "helpful_desc", label: "Most helpful" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        className="btn btn-sm w-100 text-start px-3 py-2 border-0 d-flex justify-content-between align-items-center"
                        style={{
                          fontSize: "14px",
                          backgroundColor:
                            sortOption === option.value
                              ? "#f0fdf4"
                              : "transparent",
                          color:
                            sortOption === option.value ? "#166534" : "#444646",
                          fontWeight:
                            sortOption === option.value ? "600" : "normal",
                          transition: "background-color 0.15s ease",
                          borderRadius: "0",
                        }}
                        onMouseEnter={(e) => {
                          if (sortOption !== option.value)
                            e.currentTarget.style.backgroundColor = "#f3f4f6";
                        }}
                        onMouseLeave={(e) => {
                          if (sortOption !== option.value)
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                        }}
                        onClick={() => {
                          setSortOption(option.value);
                          setIsSortDropdownOpen(false);
                        }}
                      >
                        {option.label}
                        {sortOption === option.value && (
                          <Check size={14} color="#166534" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                style={{ fontSize: "14px" }}
              />
            </div>

            <div className="d-flex flex-column align-items-end justify-content-center mt-2 mt-md-0">
              <div className="d-flex flex-row align-items-center gap-1">
                <span
                  className="fw-bold me-2"
                  style={{
                    fontSize: "14px",
                    color: "#444646",
                    whiteSpace: "nowrap",
                  }}
                >
                  Rating
                </span>
                <div className="d-flex align-items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="btn btn-link p-0 border-0 text-decoration-none transition-all"
                      onClick={() => setMaxRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{ outline: "none", boxShadow: "none" }}
                    >
                      <Star
                        size={20}
                        fill={
                          (hoverRating || maxRating) >= star
                            ? "#41AB5D"
                            : "none"
                        }
                        stroke={
                          (hoverRating || maxRating) >= star
                            ? "#41AB5D"
                            : "#ced4da"
                        }
                        className="transition-all"
                        style={{ cursor: "pointer" }}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div
                className="d-flex justify-content-end align-items-center mt-1 w-100"
                style={{
                  minHeight: "18px",
                  opacity: maxRating > 0 ? 1 : 0,
                  transition: "opacity 0.2s ease",
                  pointerEvents: maxRating > 0 ? "auto" : "none",
                }}
              >
                <span
                  className="small fw-bold text-success"
                  style={{
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    paddingRight: "4px",
                  }}
                >
                  {maxRating || 1} Stars
                </span>
                <button
                  className="btn btn-link btn-sm p-0 text-muted text-decoration-none"
                  style={{ fontSize: "12px" }}
                  onClick={() => setMaxRating(0)}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex flex-column flex-grow-1 pe-2">
          {paginatedReviews.length > 0 ? (
            paginatedReviews.map((rev, index) => {
              const author = getReviewAuthor(rev);
              const globalIndex = startIndex + index;
              return (
                <div key={index} className="mb-3 position-relative">
                  <div className="d-flex flex-row align-items-center gap-3">
                    <img
                      src={author.avatar}
                      alt="avatar"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <div className="d-flex flex-column">
                      <Link
                        to={
                          author.username !== "unknown"
                            ? `/profile/${author.username}`
                            : "#"
                        }
                        className="mb-0 text-decoration-none fw-bold"
                        style={{ color: "#444646" }}
                      >
                        {author.fullName}
                      </Link>
                      <div className="d-flex flex-row gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < rev.rating ? "currentColor" : "none"}
                            style={{
                              color: i < rev.rating ? "#41AB5D" : "#9ca3af",
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Date and Menu Container */}
                    <div className="ms-auto d-flex align-items-center gap-2">
                      <div className="text-end">
                        <p
                          className="mb-0"
                          style={{ color: "#9ca3af", fontSize: "12px" }}
                        >
                          {getRelativeDate(rev.date)}
                        </p>
                        {rev.isEdited && (
                          <small
                            className="text-muted d-block"
                            style={{ fontSize: "10px" }}
                          >
                            (edited)
                          </small>
                        )}
                      </div>

                      {/* Edit/Delete Menu for Own Reviews */}
                      {(rev.isOwnReview ||
                        (currentUser &&
                          (rev.userId?._id === currentUser._id ||
                            rev.userId === currentUser._id))) && (
                          <div className="position-relative">
                            <button
                              className="btn btn-sm btn-link text-muted p-0"
                              onClick={(e) => toggleMenu(e, rev._id || rev.id)}
                            >
                              <MoreVertical size={16} />
                            </button>

                            {openMenuId === (rev._id || rev.id) && (
                              <div
                                className="position-absolute bg-white shadow-sm rounded border p-1"
                                style={{
                                  top: "100%",
                                  right: 0,
                                  zIndex: 10,
                                  minWidth: "120px",
                                }}
                              >
                                <button
                                  className="btn btn-sm btn-light w-100 text-start d-flex align-items-center gap-2 mb-1"
                                  onClick={() => handleEditClick(rev)}
                                >
                                  <Edit size={14} /> Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-light w-100 text-start d-flex align-items-center gap-2 text-danger"
                                  onClick={() => handleDelete(rev._id || rev.id)}
                                >
                                  <Trash2 size={14} /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                    </div>
                  </div>

                  <Link
                    to={`/review/${rev._id || rev.id}`}
                    state={{ review: rev, establishment }}
                    className="text-decoration-none d-block mt-2"
                    style={{ color: "inherit" }}
                  >
                    <p
                      className="mb-1 fw-bold text-break" // Added text-break
                      style={{ color: "#000000", fontSize: "16px" }}
                    >
                      {rev.title}
                    </p>
                    <p
                      className="mb-0 text-break" // Added text-break
                      style={{
                        color: "#444646",
                        fontSize: "14px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {rev.body || rev.comment}
                    </p>
                  </Link>

                  {/* Render Images if available */}
                  {rev.images && rev.images.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      {rev.images.map((imgUrl, i) => (
                        <div key={i} style={{ width: "80px", height: "80px" }}>
                          <img
                            src={imgUrl}
                            alt={`review-img-${i}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render Videos if available */}
                  {rev.videos && rev.videos.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      {rev.videos.map((vidUrl, i) => (
                        <div key={i} style={{ width: "160px", height: "90px" }}>
                          <video
                            src={vidUrl}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                            controls
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="d-flex flex-row gap-3 mt-2">
                    <button
                      className="btn btn-sm p-0 border-0 d-flex align-items-center bg-transparent"
                      onClick={() => toggleVote(rev, "helpful")}
                      style={{
                        color:
                          currentUser &&
                            rev.helpfulVoters?.includes(currentUser._id)
                            ? "#41AB5D"
                            : "#9ca3af",
                      }}
                    >
                      <ThumbsUp size={16} />
                      <span className="ms-2" style={{ fontSize: "14px" }}>
                        Helpful ({rev.helpfulVoters?.length || 0})
                      </span>
                    </button>
                    <button
                      className="btn btn-sm p-0 border-0 d-flex align-items-center bg-transparent"
                      onClick={() => toggleVote(rev, "unhelpful")}
                      style={{
                        color:
                          currentUser &&
                            rev.unhelpfulVoters?.includes(currentUser._id)
                            ? "#41AB5D"
                            : "#9ca3af",
                      }}
                    >
                      <ThumbsDown size={16} />
                      <span className="ms-2" style={{ fontSize: "14px" }}>
                        Unhelpful ({rev.unhelpfulVoters?.length || 0})
                      </span>
                    </button>
                  </div>
                  {index < paginatedReviews.length - 1 && (
                    <hr className="my-3" />
                  )}
                </div>
              );
            })
          ) : (
            <p
              className="mb-0 text-center"
              style={{ color: "#9ca3af", fontSize: "14px" }}
            >
              No reviews found
            </p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex flex-row justify-content-center gap-2 mt-3 pt-2 border-top">
            <button
              className="btn btn-sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                background: currentPage === 1 ? "#e0e0e0" : "#41AB5D",
                color: currentPage === 1 ? "#9ca3af" : "white",
                border: "none",
                cursor: currentPage === 1 ? "default" : "pointer",
              }}
            >
              Previous
            </button>
            <span
              style={{
                alignSelf: "center",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {currentPage} / {totalPages}
            </span>
            <button
              className="btn btn-sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                background: currentPage === totalPages ? "#e0e0e0" : "#41AB5D",
                color: currentPage === totalPages ? "#9ca3af" : "white",
                border: "none",
                cursor: currentPage === totalPages ? "default" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
