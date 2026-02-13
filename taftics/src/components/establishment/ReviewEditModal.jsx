import React, { useState, useEffect } from "react";
import { Star, X } from "lucide-react";

export default function ReviewEditModal({ isOpen, onClose, review, onSave }) {
    if (!isOpen) return null;

    const [rating, setRating] = useState(review?.rating || 0);
    const [title, setTitle] = useState(review?.title || "");
    const [comment, setComment] = useState(review?.comment || "");

    useEffect(() => {
        if (review) {
            setRating(review.rating);
            setTitle(review.title);
            setComment(review.comment);
        }
    }, [review]);

    const handleSave = () => {
        onSave({ ...review, rating, title, comment, isEdited: true });
        onClose();
    };

    return (
        <>
            {/* GLASS BLUR BACKDROP */}
            <div className="glass-backdrop fade show" onClick={onClose} />

            {/* MODAL CONTENT */}
            <div className="modal d-block" style={{ zIndex: 1060 }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden bg-white">
                        <div className="modal-header bg-dlsu-dark text-white border-0 py-3">
                            <h5 className="modal-title fw-bold">Edit Review</h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={onClose}
                            />
                        </div>

                        <div className="modal-body p-4 text-start">
                            {/* Rating Input */}
                            <div className="mb-3">
                                <label className="form-label fw-bold small text-uppercase text-muted">Rating</label>
                                <div className="d-flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={32}
                                            className={`pointer-cursor ${star <= rating ? "text-dlsu-primary" : "text-muted"}`}
                                            fill={star <= rating ? "currentColor" : "none"}
                                            onClick={() => setRating(star)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Title Input */}
                            <div className="mb-3">
                                <label htmlFor="reviewTitle" className="form-label fw-bold small text-uppercase text-muted">Title</label>
                                <input
                                    type="text"
                                    className="form-control rounded-3 bg-light border-0 py-2"
                                    id="reviewTitle"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            {/* Comment Input */}
                            <div className="mb-3">
                                <label htmlFor="reviewComment" className="form-label fw-bold small text-uppercase text-muted">Comment</label>
                                <textarea
                                    className="form-control rounded-3 bg-light border-0 py-2"
                                    id="reviewComment"
                                    rows="4"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        <div className="modal-footer border-0 p-3 pt-0">
                            <button
                                className="btn btn-light fw-bold px-4 rounded-pill"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-dlsu-dark rounded-pill px-4 fw-bold shadow-sm"
                                onClick={handleSave}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
