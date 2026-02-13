import React, { useEffect, useState } from "react";
import { useParams, Link, useOutletContext } from "react-router-dom";
import EstablishmentGallery from "../components/establishment/EstablishmentGallery";
import EstablishmentHeader from "../components/establishment/EstablishmentHeader";
import EstablishmentInfo from "../components/establishment/EstablishmentInfo";
import EstablishmentReviews from "../components/establishment/EstablishmentReviews";
import EstablishmentSidebar from "../components/establishment/EstablishmentSidebar";

import { ESTABLISHMENTS, REVIEWS, USERS } from "../data/mockData";

function Establishment() {
    const { id } = useParams();
    // Use Outlet context to get current user, fallback to empty object if undefined
    const { user: currentUser } = useOutletContext() || {};
    const [establishment, setEstablishment] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isBookmarked, setIsBookmarked] = React.useState(false);

    useEffect(() => {
        // 1. Resolve ID (default to 6 'De La Salle Laundry' if no ID provided for backward compatibility)
        const establishmentId = id ? parseInt(id) : 6;

        // 2. Fetch Establishment
        const foundEst = ESTABLISHMENTS.find(e => e.id === establishmentId);
        setEstablishment(foundEst || null);

        // 3. Fetch Reviews
        if (foundEst) {
            const foundReviews = REVIEWS.filter(r => r.establishmentId === establishmentId).map(review => {
                // Enrich review with user data
                const reviewAuthor = USERS.find(u => u.id === review.userId);
                return {
                    ...review,
                    // Use user's name if found, otherwise fallback
                    user: reviewAuthor ? reviewAuthor.name : "Unknown User",
                    avatar: reviewAuthor ? reviewAuthor.avatar : "https://ui-avatars.com/api/?name=Unknown",
                    username: reviewAuthor ? reviewAuthor.username : "unknown",
                    // Check if current user is the author
                    isOwnReview: currentUser ? currentUser.id === review.userId : false
                };
            });
            setReviews(foundReviews);
        }
    }, [id, currentUser]);

    if (!establishment) {
        return (
            <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center">
                <h2>Establishment not found</h2>
                <Link to="/browse" className="btn btn-primary mt-3">Back to Browse</Link>
            </div>
        );
    }

    return (
        <div>
            <div className="d-flex flex-column align-items-center min-vw-100 pb-5">
                <div className="d-flex flex-column align-items-center w-75">
                    {/* Gallery Section */}
                    {/* Pass image from establishment data */}
                    <EstablishmentGallery image={establishment.image} />

                    {/* Main Content Row */}
                    <div className="d-flex flex-row justify-content-between align-items-start w-75 mt-4 gap-4">
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
