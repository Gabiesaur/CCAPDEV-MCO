import React, { useEffect, useState } from "react";
import { useParams, Link, useOutletContext, useNavigate, useLocation } from "react-router-dom";
import { Star, BookMarked } from "lucide-react";
import addressIcon from "../assets/address.png";
import EstablishmentGallery from "../components/establishment/EstablishmentGallery";
import EstablishmentReviews from "../components/establishment/EstablishmentReviews";

// ❌ REMOVED: import { ESTABLISHMENTS, REVIEWS, USERS } from "../data/mockData";

function Establishment() {
    const { id } = useParams(); // This will now be the MongoDB _id (e.g., "65f00...")
    const navigate = useNavigate();
    const location = useLocation();
    
    // Use Outlet context to get current user
    const { user: currentUser } = useOutletContext() || {};
    
    const establishmentFromState = location.state?.establishment;

    // States for live data
    const [establishment, setEstablishment] = useState(establishmentFromState || null);
    const [reviews, setReviews] = useState([]);
    
    // States for UI handling
    const [loading, setLoading] = useState(!establishmentFromState);
    const [error, setError] = useState("");

    // Bookmark Check & Handler
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        if (currentUser && currentUser.savedEstablishments) {
            const savedIds = currentUser.savedEstablishments.map(e => e._id || e);
            if (savedIds.includes(id)) {
                setIsBookmarked(true);
            }
        }
    }, [currentUser, id]);

    const handleBookmark = async () => {
        if (!currentUser) return alert("Please log in to bookmark.");
        try {
            const res = await fetch(`http://localhost:3000/api/users/${currentUser._id}/bookmark`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ establishmentId: id })
            });
            const data = await res.json();
            if (data.success) setIsBookmarked(data.isBookmarked);
        } catch (err) {
            console.error("Failed to bookmark", err);
        }
    };

    useEffect(() => {
        // If someone navigates to /establishment without an ID, send them back to browse
        if (!id) {
            navigate('/browse', { replace: true });
            return;
        }

        let isMounted = true;

        const fetchEstablishmentData = async () => {
            try {
                const shouldFetchEstablishment =
                    !establishmentFromState || String(establishmentFromState._id) !== String(id);

                const establishmentPromise = shouldFetchEstablishment
                    ? fetch(`http://localhost:3000/api/establishments/${id}`).then((res) => {
                        if (!res.ok) {
                            throw new Error("Establishment not found");
                        }
                        return res.json();
                    })
                    : Promise.resolve(establishmentFromState);

                const reviewsPromise = fetch(`http://localhost:3000/api/establishments/${id}/reviews`).then((res) => {
                    if (!res.ok) {
                        return [];
                    }
                    return res.json();
                });

                const [estData, reviewsData] = await Promise.all([
                    establishmentPromise,
                    reviewsPromise,
                ]);

                if (!isMounted) {
                    return;
                }

                setEstablishment(estData);
                setReviews(Array.isArray(reviewsData) ? reviewsData : []);
                setError("");

            } catch (err) {
                console.error("Failed to fetch establishment data:", err);
                if (isMounted) {
                    setError("Could not load establishment. It may have been removed.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchEstablishmentData();

        return () => {
            isMounted = false;
        };
    }, [id, navigate, establishmentFromState]);

    // --- Loading & Error UI ---
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <h3 className="text-muted">Loading establishment details...</h3>
            </div>
        );
    }

    if (error || !establishment) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
                <h3 className="text-danger">{error}</h3>
                <Link to="/browse" className="btn btn-dark mt-3">Back to Browse</Link>
            </div>
        );
    }

    // --- Main UI ---
    const averageRating = reviews.length > 0 
        ? (reviews.reduce((sum, rev) => sum + Number(rev.rating || 0), 0) / reviews.length).toFixed(1)
        : "0.0";

    return (
        <div className="bg-white min-vh-100">
            <div className="container-fluid" style={{ paddingTop: '30px', paddingBottom: '100px' }}>
                <div className="d-flex flex-column align-items-center w-75 mx-auto">
                    {/* Gallery Section */}
                    <EstablishmentGallery image={establishment.image} />

                    {/* Main Content Row */}
                    <div className="d-flex flex-row justify-content-between align-items-start w-100 mt-4 gap-4">
                        {/* Left Column: Header, Info, Reviews */}
                        <div
                            className="d-flex flex-column"
                            style={{ width: "66%", gap: "1rem" }}
                        >
                            {/* --- HEADER COMPONENT --- */}
                            <div
                                className="custom-card d-flex flex-row p-3 justify-content-between"
                                style={{ height: "100px" }}
                            >
                                <div className="d-flex flex-row align-items-end justify-content-between">
                                    <div className="d-flex flex-column">
                                        <p className="h3 mb-0 fw-bold">{establishment.name}</p>
                                        <div
                                            className="d-flex flex-row align-items-center me-2"
                                            style={{ height: "30px" }}
                                        >
                                            <div className="rating-box p-1" style={{ width: "60px" }}>
                                                <p
                                                    className="mb-0 text-center fw-bold d-flex align-items-center justify-content-center"
                                                    style={{ color: "#00441B" }}
                                                >
                                                    <Star size={20} fill="#41AB5D" style={{ color: "#41AB5D" }} />
                                                    <span className="ms-2">{averageRating}</span>
                                                </p>
                                            </div>
                                            <span className="mx-3">&bull;</span>
                                            <p
                                                className="mb-0 fw-bold"
                                                style={{ color: "#444646", fontSize: "20px" }}
                                            >
                                                {reviews.length} reviews
                                            </p>
                                            <span className="mx-3">&bull;</span>
                                            <p
                                                className="mb-0 fw-bold"
                                                style={{ color: "#444646", fontSize: "20px" }}
                                            >
                                                {establishment.category}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="btn p-0 border-0 bg-transparent"
                                    onClick={handleBookmark}
                                    style={{ cursor: "pointer" }}
                                >
                                    <BookMarked
                                        size={30}
                                        fill={isBookmarked ? "#41AB5D" : "none"}
                                        style={{ color: isBookmarked ? "#00441B" : "#000000" }}
                                    />
                                </button>
                            </div>

                            {/* --- INFO COMPONENT --- */}
                            <div
                                className="custom-card d-flex flex-column p-3 h-auto"
                                style={{ minHeight: "100px" }}
                            >
                                <div className="d-flex flex-column">
                                    <p className="h3 mb-2 fw-bold">About us</p>
                                    <p
                                        className="mb-0 fw-bold text-wrap text-break"
                                        style={{ color: "#444646", fontSize: "14px", lineHeight: "1.5" }}
                                    >
                                        {establishment.description}
                                    </p>
                                </div>
                            </div>

                            <EstablishmentReviews reviews={reviews} establishment={establishment} currentUser={currentUser} />
                        </div>

                        {/* Right Column: Sidebar */}
                        <div style={{ width: "32%" }}>
                            {/* --- SIDEBAR COMPONENT --- */}
                            <div
                                className="custom-card d-flex flex-column p-4"
                                style={{ width: "100%", minHeight: "500px" }}
                            >
                                <div className="d-flex flex-row align-items-center mb-3">
                                    <div
                                        className="rating-box p-1 d-flex align-items-center justify-content-center"
                                        style={{ width: "70px", height: "30px" }}
                                    >
                                        <p
                                            className="mb-0 text-center fw-bold"
                                            style={{ color: "#00441B" }}
                                        >
                                            OPEN
                                        </p>
                                    </div>
                                    <p
                                        className="mb-0 ms-1 fw-bold"
                                        style={{ color: "#444646", fontSize: "16px" }}
                                    >
                                        {establishment.businessHours}
                                    </p>
                                </div>

                                <p
                                    className="mb-0 fw-bold"
                                    style={{ color: "#444646", fontSize: "16px" }}
                                >
                                    Contact Information:
                                </p>
                                <p
                                    className="mb-0 mt-2 fw-bold"
                                    style={{ color: "#444646", fontSize: "14px" }}
                                >
                                    {establishment.contactNumber}
                                </p>
                                <p
                                    className="mb-0 mt-2 fw-bold text-break" 
                                    style={{ color: "#444646", fontSize: "14px" }}
                                >
                                    {establishment.email}
                                </p>

                                <div
                                    className="w-100 my-2"
                                    style={{
                                        height: "150px", 
                                        overflow: "hidden",
                                        borderRadius: "5px",
                                    }}
                                >
                                    <img
                                        src={addressIcon}
                                        alt="address"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                </div>

                                <p
                                    className="mb-0 fw-bold text-wrap" 
                                    style={{ color: "#444646", fontSize: "14px", lineHeight: "1.4" }}
                                >
                                    {establishment.address}
                                </p>

                                <a
                                    href={establishment.website ? (establishment.website.startsWith('http') ? establishment.website : `http://${establishment.website}`) : '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mb-0 mt-2 text-break" 
                                    style={{ color: "#0b08bd", fontSize: "14px" }}
                                >
                                    {establishment.website}
                                </a>

                                <Link
                                    to="/create"
                                    state={{ establishment, reviews }}
                                    className="button btn mt-auto d-flex align-items-center justify-content-center py-2" 
                                    style={{ background: "#00441B", border: "none", color: "white" }}
                                >
                                    <Star size={20} fill="#41AB5D" style={{ color: "#41AB5D" }} />
                                    <span className="ms-2">Create a review</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Establishment;