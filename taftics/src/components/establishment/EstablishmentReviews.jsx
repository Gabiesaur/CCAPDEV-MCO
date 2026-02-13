import { Link } from "react-router-dom";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import React, { useState, useEffect } from "react";

export default function EstablishmentReviews({ reviews }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [helpfulStatus, setHelpfulStatus] = useState({}); // Track status per review

    // Local state for filtered reviews
    const filteredReviews = reviews.filter(
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

    const toggleHelpful = (index, type) => {
        setHelpfulStatus((prev) => ({
            ...prev,
            [index]: prev[index] === type ? null : type,
        }));
    };

    return (
        <div
            className="custom-card d-flex flex-column p-3 mt-3"
            style={{ minHeight: "200px" }} // Use minHeight instead of fixed height
        >
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
                                <div key={index} className="mb-3">
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
                                                to="/profile/me"
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
                                        <p
                                            className="mb-0 mt-2 ms-auto"
                                            style={{ color: "#9ca3af", fontSize: "12px" }}
                                        >
                                            {rev.date}
                                        </p>
                                    </div>

                                    <Link
                                        to="/review"
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
