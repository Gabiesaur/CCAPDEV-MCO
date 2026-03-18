import React from "react";
import { Star, CheckCircle2 } from "lucide-react";
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

    const selectedEstablishment = location.state?.establishment;

    const establishmentData = selectedEstablishment
        ? {
              name: selectedEstablishment.name || "Unknown Establishment",
              type: selectedEstablishment.category || "Establishment",
              rating: selectedEstablishment.rating ?? 0,
              totalReviews: selectedEstablishment.reviewCount ?? 0,
              fiveStar: selectedEstablishment.fiveStar ?? 0,
              fourStar: selectedEstablishment.fourStar ?? 0,
              threeStar: selectedEstablishment.threeStar ?? 0,
              twoStar: selectedEstablishment.twoStar ?? 0,
              oneStar: selectedEstablishment.oneStar ?? 0,
          }
        : fallbackData;

    const handleClick = (index) => {
        setRating(index + 1);
    }

    const handleMouseEnter = (index) => {
        setHover(index + 1);
    }

    const handleMouseLeave = () => {
        setHover(0);
    }

    const fileInputRef = React.useRef(null);
    const [images, setImages] = React.useState([]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    }

    const handleFilesChange = (e) => {
        const files = Array.from(e.target.files || []).slice(0, 6);
        const newImages = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
        setImages((prev) => {
            const combined = [...prev, ...newImages];
            return combined.slice(0, 6);
        });
        e.target.value = null;
    }

    const removeImage = (index) => {
        setImages((prev) => {
            const copy = prev.slice();
            URL.revokeObjectURL(copy[index].url);
            copy.splice(index, 1);
            return copy;
        });
    }

    const totalReviews = establishmentData.totalReviews || 0;
    const starCounts = [
        establishmentData.oneStar || 0,
        establishmentData.twoStar || 0,
        establishmentData.threeStar || 0,
        establishmentData.fourStar || 0,
        establishmentData.fiveStar || 0,
    ];

    const average = establishmentData.rating || (() => {
        if (!totalReviews) return 0;
        const sum = 5 * starCounts[4] + 4 * starCounts[3] + 3 * starCounts[2] + 2 * starCounts[1] + 1 * starCounts[0];
        return sum / totalReviews;
    })();

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
        formData.append("text", reviewText);

        // Append each selected image file
        images.forEach((imgObj) => {
            formData.append("images", imgObj.file);
        });

        try {
            const response = await fetch("http://localhost:5000/api/reviews", {
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
            alert(err.message || "Something went wrong while submitting your review.");
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
                    <h5 className="text-dlsu-dark pt-5">CREATE REVIEW</h5>
                    <h1 className="mb-4">Tell us your story</h1>
                </div>
                <div className="d-flex flex-row justify-content-between w-75">
                    <div className="custom-card border p-3 d-flex align-items-center justify-content-center mb-5" style={{ width: "60%", height: "700px" }}>
                        <div style={{ width: "95%", height: "95%" }}>
                            <p className="fw-bold small opacity-75">QUALITY SCORE</p>
                            <div className="textBox p-3 d-flex flex-row justify-content-between align-items-center" style={{ width: "52%" }}>
                                <div className="d-flex flex-row gap-1">
                                    {stars.map((_, index) => {
                                        return (
                                            <Star
                                                key={index}
                                                size={26}
                                                fill={index < (hover || rating) ? "currentColor" : "none"}
                                                style={{
                                                    cursor: "pointer",
                                                    color: index < (hover || rating) ? "#41AB5D" : "#9ca3af",
                                                }}
                                                onClick={() => handleClick(index)}
                                                onMouseOver={() => handleMouseEnter(index)}
                                                onMouseLeave={handleMouseLeave}
                                            />
                                        )
                                    })}
                                </div>
                                <p className="mb-0 small text-muted">Select Rating</p>
                            </div>
                            <p className="mt-4 fw-bold small opacity-75">TITLE</p>
                            <textarea
                                className="border-0 fs-5"
                                placeholder="Summarize your experience..."
                                rows={1}
                                style={{ backgroundColor: "transparent", color: "#2d3436", width: "100%", height: "30px", outline: "none", resize: "none", overflow: "hidden" }}
                                value={titleText}
                                onChange={(e) => setTitleText(e.target.value)}
                            />
                            <hr className="border-2 opacity-100 mt-0" style={{ color: "#A0ACC9" }} />
                            <p className="mt-4 fw-bold small opacity-75">DETAILS</p>
                            <div className="mb-3">
                                <textarea
                                    className="form-control border-0 rounded-4 p-4 shadow-sm"
                                    placeholder="Tell us your experience. How was the service?"
                                    rows={8}
                                    style={{ backgroundColor: "#f1f2f6", color: "#2d3436", resize: "none" }}
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
                                <button type="button" className="btn btn-outline-success rounded-pill px-4 btn-sm mb-2" onClick={handleUploadClick}>
                                    Upload Photos
                                </button>
                                <div className="d-flex flex-wrap gap-2 mt-2">
                                    {images.map((img, i) => (
                                        <div key={i} className="position-relative" style={{ width: 80, height: 80 }}>
                                            <img src={img.url} alt={`preview-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
                                            <button type="button" className="btn btn-sm btn-danger position-absolute rounded-circle shadow" style={{ top: -8, right: -8, width: 24, height: 24, padding: 0 }} onClick={() => removeImage(i)}>×</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="custom-card border shadow-sm" style={{ width: "35%", height: "fit-content" }}>
                        <div className="custom-bg pt-4 ps-4 pe-4 pb-2" style={{ height: "150px", borderRadius: "20px 20px 0 0" }}>
                            <div className="d-flex flex-column h-100 justify-content-end">
                                <div className="category-box d-inline-flex justify-content-center align-items-center mb-2" style={{ width: "fit-content", padding: "4px 12px" }}>
                                    <p className="text-white mb-0 fw-bold" style={{ fontSize: 12 }}>{(establishmentData.type || "ESTABLISHMENT").toUpperCase()}</p>
                                </div>
                                <h3 className="text-white fw-bold mb-3">{establishmentData.name}</h3>
                            </div>
                        </div>
                        <div className="p-4 d-flex flex-column gap-3 sticky-top">
                            <div className="d-flex align-items-center gap-3">
                                <div className="d-flex flex-row align-items-center gap-2">
                                    <div className="fw-bold fs-3 text-dlsu-dark">{average ? average.toFixed(1) : "0.0"}</div>
                                    <div className="text-muted">({totalReviews} reviews)</div>
                                </div>

                                <div className="d-flex align-items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={20}
                                            fill={i < Math.round(average) ? "#41AB5D" : "none"}
                                            style={{ color: i < Math.round(average) ? "#41AB5D" : "#9ca3af" }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="d-flex flex-column gap-2 mt-2">
                                {[5, 4, 3, 2, 1].map(num => {
                                    const starsCount = starCounts[5 - num];
                                    const percent = (starsCount / (totalReviews || 1) * 100) || 0;
                                    return (
                                        <div key={num} className="d-flex flex-row align-items-center">
                                            <span className="me-2 small fw-bold" style={{ width: "15px" }}>{num}</span>
                                            <div className="progress flex-grow-1" style={{ height: "8px", backgroundColor: "#f1f2f6" }}>
                                                <div className="progress-bar bg-success" style={{ width: `${percent}%` }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="bg-light p-3 rounded-4 mt-3" style={{ fontSize: 13, border: "1px dashed #ced4da" }}>
                                <p className="mb-0 text-muted italic">"Your reviews help establishments build trust and receive valuable feedback."</p>
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
};

export default CreateReview;