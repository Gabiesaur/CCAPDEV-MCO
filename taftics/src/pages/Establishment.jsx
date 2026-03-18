import React, { useEffect, useState } from "react";
import { useParams, Link, useOutletContext, useNavigate } from "react-router-dom";
import EstablishmentGallery from "../components/establishment/EstablishmentGallery";
import EstablishmentHeader from "../components/establishment/EstablishmentHeader";
import EstablishmentInfo from "../components/establishment/EstablishmentInfo";
import EstablishmentReviews from "../components/establishment/EstablishmentReviews";
import EstablishmentSidebar from "../components/establishment/EstablishmentSidebar";

// ❌ REMOVED: import { ESTABLISHMENTS, REVIEWS, USERS } from "../data/mockData";

function Establishment() {
    const { id } = useParams(); // This will now be the MongoDB _id (e.g., "65f00...")
    const navigate = useNavigate();
    
    // Use Outlet context to get current user
    const { user: currentUser } = useOutletContext() || {};
    
    // States for live data
    const [establishment, setEstablishment] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isBookmarked, setIsBookmarked] = useState(false);
    
    // States for UI handling
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // If someone navigates to /establishment without an ID, send them back to browse
        if (!id) {
            navigate('/browse');
            return;
        }

        const fetchEstablishmentData = async () => {
            try {
                // Fetch the Establishment and its Reviews at the same time!
                const [estRes, reviewsRes] = await Promise.all([
                    fetch(`http://localhost:5000/api/establishments/${id}`),
                    fetch(`http://localhost:5000/api/establishments/${id}/reviews`)
                ]);

                if (!estRes.ok) {
                    throw new Error("Establishment not found");
                }

                const estData = await estRes.json();
                const reviewsData = await reviewsRes.json();

                setEstablishment(estData);
                setReviews(reviewsData); // Assumes the backend populates the user data into the review!
                setLoading(false);

            } catch (err) {
                console.error("Failed to fetch establishment data:", err);
                setError("Could not load establishment. It may have been removed.");
                setLoading(false);
            }
        };

        fetchEstablishmentData();
    }, [id, navigate]);

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
    return (
        <div className="bg-white min-vh-100">
            <div className="container-fluid" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
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
                            <EstablishmentHeader
                                establishment={establishment}
                                isBookmarked={isBookmarked}
                                onBookmarkToggle={() => setIsBookmarked(!isBookmarked)}
                            />

                            <EstablishmentInfo description={establishment.description} />

                            <EstablishmentReviews reviews={reviews} />
                        </div>

                        {/* Right Column: Sidebar */}
                        <div style={{ width: "32%" }}>
                            <EstablishmentSidebar establishment={establishment} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Establishment;