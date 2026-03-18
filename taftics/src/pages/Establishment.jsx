import React, { useEffect, useState } from "react";
import { useParams, Link, useOutletContext, useNavigate, useLocation } from "react-router-dom";
import EstablishmentGallery from "../components/establishment/EstablishmentGallery";
import EstablishmentHeader from "../components/establishment/EstablishmentHeader";
import EstablishmentInfo from "../components/establishment/EstablishmentInfo";
import EstablishmentReviews from "../components/establishment/EstablishmentReviews";
import EstablishmentSidebar from "../components/establishment/EstablishmentSidebar";

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
    const [isBookmarked, setIsBookmarked] = useState(false);
    
    // States for UI handling
    const [loading, setLoading] = useState(!establishmentFromState);
    const [error, setError] = useState("");

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
                    ? fetch(`http://localhost:5000/api/establishments/${id}`).then((res) => {
                        if (!res.ok) {
                            throw new Error("Establishment not found");
                        }
                        return res.json();
                    })
                    : Promise.resolve(establishmentFromState);

                const reviewsPromise = fetch(`http://localhost:5000/api/establishments/${id}/reviews`).then((res) => {
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

                            <EstablishmentReviews reviews={reviews} establishment={establishment} />
                        </div>

                        {/* Right Column: Sidebar */}
                        <div style={{ width: "32%" }}>
                            <EstablishmentSidebar establishment={establishment} reviews={reviews} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Establishment;