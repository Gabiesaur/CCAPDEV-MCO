import { Link } from "react-router-dom";
import { Star, ThumbsUp, ThumbsDown, MoreVertical, Edit, Trash2, CheckCircle2 } from "lucide-react";
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

export default function EstablishmentReviews({ reviews }) {
    // Create local state for reviews so we can modify them (edit/delete)
    const [localReviews, setLocalReviews] = useState(reviews);

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [helpfulStatus, setHelpfulStatus] = useState({}); // Track status per review
    const [openMenuId, setOpenMenuId] = useState(null); // Track which review menu is open

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
    const filteredReviews = localReviews.filter(
        (r) =>
            r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.user.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sorting
    filteredReviews.sort(
        (a, b) =>
            b.helpfulVotes - b.unhelpfulVotes - (a.helpfulVotes - a.unhelpfulVotes)
    );

    const reviewsPerPage = 3;
    const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const paginatedReviews = filteredReviews.slice(
        startIndex,
        startIndex + reviewsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setOpenMenuId(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const toggleHelpful = (index, type) => {
        setHelpfulStatus((prev) => ({
            ...prev,
            [index]: prev[index] === type ? null : type,
        }));
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

    const handleSaveEdit = (updatedReview) => {
        setLocalReviews((prev) =>
            prev.map((r) => (r.id === updatedReview.id ? updatedReview : r))
        );
        triggerToast("Review updated successfully!");
        setOpenMenuId(null);
    };

    const handleDelete = (id) => {
        setLocalReviews((prev) => prev.filter((r) => r.id !== id));
        triggerToast("Review deleted successfully!");
        setOpenMenuId(null);
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
                    <input
                        type="text"
                        placeholder="Search reviews..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="form-control"
                        style={{ fontSize: "14px", width: "50%" }}
                    />
                </div>

                <div className="d-flex flex-column flex-grow-1 pe-2">
                    {paginatedReviews.length > 0 ? (
                        paginatedReviews.map((rev, index) => {
                            const globalIndex = startIndex + index;
                            return (
                                <div key={index} className="mb-3 position-relative">
                                    <div className="d-flex flex-row align-items-center gap-3">
                                        <img
                                            src={rev.avatar}
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
                                                to={rev.username !== "unknown" ? `/profile/${rev.username}` : "#"}
                                                className="mb-0 text-decoration-none fw-bold"
                                                style={{ color: "#444646" }}
                                            >
                                                {rev.user}
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
                                                    <small className="text-muted d-block" style={{ fontSize: '10px' }}>(edited)</small>
                                                )}
                                            </div>

                                            {/* Edit/Delete Menu for Own Reviews */}
                                            {rev.isOwnReview && (
                                                <div className="position-relative">
                                                    <button
                                                        className="btn btn-sm btn-link text-muted p-0"
                                                        onClick={(e) => toggleMenu(e, rev.id)}
                                                    >
                                                        <MoreVertical size={16} />
                                                    </button>

                                                    {openMenuId === rev.id && (
                                                        <div
                                                            className="position-absolute bg-white shadow-sm rounded border p-1"
                                                            style={{
                                                                top: "100%",
                                                                right: 0,
                                                                zIndex: 10,
                                                                minWidth: "120px"
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
                                                                onClick={() => handleDelete(rev.id)}
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
                                        to="/review" // Ideally this would link to specific review detail if available
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
                                            {rev.comment}
                                        </p>
                                    </Link>

                                    <div className="d-flex flex-row gap-3 mt-2">
                                        <button
                                            className="btn btn-sm p-0 border-0 d-flex align-items-center bg-transparent"
                                            onClick={() => toggleHelpful(globalIndex, "helpful")}
                                            style={{
                                                color:
                                                    helpfulStatus[globalIndex] === "helpful"
                                                        ? "#41AB5D"
                                                        : "#9ca3af",
                                            }}
                                        >
                                            <ThumbsUp size={16} />
                                            <span className="ms-2" style={{ fontSize: "14px" }}>
                                                Helpful ({rev.helpfulVotes})
                                            </span>
                                        </button>
                                        <button
                                            className="btn btn-sm p-0 border-0 d-flex align-items-center bg-transparent"
                                            onClick={() => toggleHelpful(globalIndex, "unhelpful")}
                                            style={{
                                                color:
                                                    helpfulStatus[globalIndex] === "unhelpful"
                                                        ? "#41AB5D"
                                                        : "#9ca3af",
                                            }}
                                        >
                                            <ThumbsDown size={16} />
                                            <span className="ms-2" style={{ fontSize: "14px" }}>
                                                Unhelpful ({rev.unhelpfulVotes})
                                            </span>
                                        </button>
                                    </div>
                                    {index < paginatedReviews.length - 1 && <hr className="my-3" />}
                                </div>
                            );
                        })
                    ) : (
                        <p className="mb-0 text-center" style={{ color: "#9ca3af", fontSize: "14px" }}>
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
