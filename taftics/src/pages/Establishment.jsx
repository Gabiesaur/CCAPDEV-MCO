import React from "react";
import EstablishmentGallery from "../components/establishment/EstablishmentGallery";
import EstablishmentHeader from "../components/establishment/EstablishmentHeader";
import EstablishmentInfo from "../components/establishment/EstablishmentInfo";
import EstablishmentReviews from "../components/establishment/EstablishmentReviews";
import EstablishmentSidebar from "../components/establishment/EstablishmentSidebar";

function Establishment() {
    const [isBookmarked, setIsBookmarked] = React.useState(false);

    const establishment = {
        name: "De La Salle Laundry",
        rating: 4.5,
        reviews: 120,
        type: "Laundry",
        businessHours: "8:00 AM - 8:00 PM",
        phone: "091-234-5678",
        email: "dlsu@laundry.com",
        address: "2401 Taft Ave, Malate, Manila, 1004 Metro Manila",
        description:
            "Our laundry service offers quick turnaround times, competitive pricing, and exceptional customer service. Experience the convenience of our laundry service today!",
        website: "www.dlsu-laundry.com",
    };

    const reviews = [
        {
            avatar: "https://ui-avatars.com/api/?name=ML",
            user: "Martin Luther",
            rating: 4,
            title: "Pretty nice!",
            comment: "The service was okay but a bit crowded.",
            date: "2024-05-20",
            helpfulVotes: 9,
            unhelpfulVotes: 3,
        },
        {
            avatar: "https://ui-avatars.com/api/?name=JP",
            user: "Jose Protacio",
            rating: 2,
            title: "Bad experience.",
            comment: "Too many people and slow service. Not recommended.",
            date: "2024-05-20",
            helpfulVotes: 3,
            unhelpfulVotes: 12,
        },
        {
            avatar: "https://ui-avatars.com/api/?name=LP",
            user: "Leelancze Pacomio",
            rating: 4,
            title: "Excellent service!",
            comment: "Great service and fast turnaround! Highly recommend.",
            date: "2024-06-01",
            helpfulVotes: 10,
            unhelpfulVotes: 2,
        },
        {
            avatar: "https://ui-avatars.com/api/?name=JD",
            user: "John Doe",
            rating: 5,
            title: "Best laundry in town",
            comment:
                "Quick service and very friendly staff. Will come back again! Also they have free wifi while you wait which is a huge plus for students.",
            date: "2024-05-28",
            helpfulVotes: 8,
            unhelpfulVotes: 1,
        },
        {
            avatar: "https://ui-avatars.com/api/?name=SM",
            user: "Sarah Miller",
            rating: 3,
            title: "Average experience",
            comment: "The service was okay but a bit pricey.",
            date: "2024-05-20",
            helpfulVotes: 5,
            unhelpfulVotes: 3,
        },
    ];

    return (
        <div>
            <div className="d-flex flex-column align-items-center min-vw-100 pb-5">
                <div className="d-flex flex-column align-items-center w-75">
                    {/* Gallery Section */}
                    <EstablishmentGallery />

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
