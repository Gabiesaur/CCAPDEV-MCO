import { Link } from "react-router-dom";

import { Bold } from "lucide-react";
import React, { use } from "react";
import { 
    Star,
    BookMarked,
    ThumbsUp,
    ThumbsDown, } from "lucide-react";
import addressIcon from '../assets/address.png';


function Establishment() {
    const [isBookmarked, setIsBookmarked] = React.useState(false);
    const [helpfulStatus, setHelpfulStatus] = React.useState(null);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [currentPage, setCurrentPage] = React.useState(1);

    const establishment = {
        name: "De La Salle Laundry",
        rating: 4.5,
        reviews: 120,
        type: "Laundry",
        businessHours: "8:00 AM - 8:00 PM",
        phone: "091-234-5678",
        email: "dlsu@laundry.com",
        address: "2401 Taft Ave, Malate, Manila, 1004 Metro Manila",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
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
            unhelpfulVotes: 3
        },
        {
            avatar: "https://ui-avatars.com/api/?name=JP",
            user: "Jose Protacio",
            rating: 2,
            title: "Bad experience.",
            comment: "Too many people and slow service. Not recommended.",
            date: "2024-05-20",
            helpfulVotes: 3,
            unhelpfulVotes: 12
        },
        {
            avatar: "https://ui-avatars.com/api/?name=LP",
            user: "Leelancze Pacomio",
            rating: 4,
            title: "Excellent service!",
            comment: "Great service and fast turnaround! Highly recommend.",
            date: "2024-06-01",
            helpfulVotes: 10,
            unhelpfulVotes: 2
        },
        {
            avatar: "https://ui-avatars.com/api/?name=JD",
            user: "John Doe",
            rating: 5,
            title: "Best laundry in town",
            comment: "Quick service and very friendly staff. Will come back again!",
            date: "2024-05-28",
            helpfulVotes: 8,
            unhelpfulVotes: 1
        },
        {
            avatar: "https://ui-avatars.com/api/?name=SM",
            user: "Sarah Miller",
            rating: 3,
            title: "Average experience",
            comment: "The service was okay but a bit pricey.",
            date: "2024-05-20",
            helpfulVotes: 5,
            unhelpfulVotes: 3
        }
    ];

    let filteredReviews = reviews.filter(r => 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.user.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filteredReviews.sort((a, b) => 
        (b.helpfulVotes - b.unhelpfulVotes) - (a.helpfulVotes - a.unhelpfulVotes)
    );

    const reviewsPerPage = 3;
    const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const paginatedReviews = filteredReviews.slice(startIndex, startIndex + reviewsPerPage);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    return (
        <div>
            <div className="d-flex flex-column align-items-center min-vw-100">
                <div className="d-flex flex-column align-items-center w-75">
                    <div className="d-flex flex-row justify-content-between w-75 mt-4">
                        <div className="establishment-image" style={{height: "300px", width: "49.5%", borderRadius: "10px 0 0 10px"}}>
                        </div>
                        <div className="d-flex flex-column justify-content-between" style={{width: "24.5%", height: "300px"}}>
                            <div className="establishment-image" style={{height: "49%"}}>
                            </div>
                            <div className="establishment-image" style={{height: "49%"}}>
                            </div>
                        </div>
                        <div className="d-flex flex-column justify-content-between" style={{width: "24.5%", height: "300px"}}>
                            <div className="establishment-image" style={{height: "49%", borderRadius: "0 10px 0 0"}}>
                            </div>
                            <div className="establishment-image" style={{height: "49%", borderRadius: "0 0 10px 0"}}>
                            </div>
                        </div>
                        
                    </div>
                    <div className="d-flex flex-row justify-content-between align-items-start w-75 mt-4">
                        <div className="d-flex flex-column" style={{width: "66%", height: "550px"}}>
                            <div className="custom-card d-flex flex-row p-3 justify-content-between" style={{height: "100px"}}>
                                <div className="d-flex flex-row align-items-end justify-content-between">
                                    <div className="d-flex flex-column">
                                        <p className="h3 mb-0" style={{fontWeight: "bold"}}>{establishment.name}</p>
                                        <div className="d-flex flex-row align-items-left me-2" style={{height: "30px"}}>
                                            <div className="rating-box p-1" style={{width: "60px"}}>
                                                <p className="mb-0 text-center" style={{color: "#00441B", fontWeight: "bold"}}>
                                                    <Star
                                                    size={20}
                                                    fill="#41AB5D"
                                                    style={{ color: "#41AB5D" }}
                                                    />
                                                    <span className="ms-2">{establishment.rating}</span>
                                                </p>
                                            </div>
                                            <span className="mx-3 mt-1">&bull;</span>
                                            <p className="mb-0" style={{color: "#444646", fontWeight: "bold", fontSize: "20px"}}>{establishment.reviews} reviews</p>
                                            <span className="mx-3 mt-1">&bull;</span>
                                            <p className="mb-0" style={{color: "#444646", fontWeight: "bold", fontSize: "20px"}}>{establishment.type}</p>
                                        </div>
                                    </div>
                                    
                                </div>
                                <button
                                    className="btn p-0 border-0"
                                    onClick={() => setIsBookmarked(!isBookmarked)}
                                    style={{background: "none", cursor: "pointer"}}
                                >
                                    <BookMarked
                                        size={30}
                                        fill={isBookmarked ? "#41AB5D" : "none"}
                                        style={{ color: isBookmarked ? "#00441B" : "#000000" }}
                                    />
                                </button>
                            </div>

                            <div className="custom-card d-flex flex-column p-3 mt-3" style={{height: "100px"}}>
                                <div className="d-flex flex-column">
                                    <p className="h3 mb-0" style={{fontWeight: "bold"}}>About us</p>
                                    <p className="mb-0" style={{color: "#444646", fontSize: "14px", fontWeight: "bold"}}>{establishment.description}</p>
                                </div>
                            </div>

                            <div className="custom-card d-flex flex-column p-3 mt-3" style={{height: "350px", overflowY: "auto"}}>
                                <div className="d-flex flex-column">
                                    <div className="d-flex flex-row align-items-center justify-content-between mb-3">
                                        <p className="h3 mb-0" style={{fontWeight: "bold"}}>Reviews</p>
                                        <input 
                                            type="text" 
                                            placeholder="Search reviews..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="form-control mb-3"
                                            style={{fontSize: "14px", width: "50%"}}
                                        />
                                    </div>
    
                                    <div className="d-flex flex-column">
                                        {paginatedReviews.length > 0 ? (
                                            paginatedReviews.map((rev, index) => (
                                                <div key={index}>
                                                    <div className="d-flex flex-row align-items-center gap-3">
                                                        <img src={rev.avatar} alt="avatar" style={{width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover"}} />
                                                        <div className="d-flex flex-column">
                                                            <p className="mb-0" style={{color: "#444646", fontWeight: "bold"}}>{rev.user}</p>
                                                            <div className="d-flex flex-row gap-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        size={14}
                                                                        fill={i < rev.rating ? "currentColor" : "none"}
                                                                        style={{ color: i < rev.rating ? "#41AB5D" : "#9ca3af" }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="mb-0 mt-2" style={{color: "#9ca3af", fontSize: "12px"}}>{rev.date}</p>
                                                    </div>

                                                    <p className="mb-0 mt-2" style={{color: "#000000", fontSize: "16px"}}>{rev.title}</p>
                                                    <p className="mb-0 mt-2" style={{color: "#444646", fontSize: "14px"}}>{rev.comment}</p>
                                                    
                                                    <a href="#" className="mb-0 mt-1" style={{color: "#0b08bd", fontSize: "12px"}}>See more</a>

                                                    <div className="d-flex flex-row gap-3 mt-3">
                                                        <button 
                                                            className="btn btn-sm p-0 border-0" 
                                                            onClick={() => setHelpfulStatus(helpfulStatus === 'helpful' ? null : 'helpful')}
                                                            style={{background: "none", color: helpfulStatus === 'helpful' ? "#41AB5D" : "#9ca3af"}}
                                                        >
                                                            <ThumbsUp size={18} />
                                                            <span className="ms-2" style={{fontSize: "14px"}}>Helpful ({rev.helpfulVotes})</span>
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm p-0 border-0" 
                                                            onClick={() => setHelpfulStatus(helpfulStatus === 'unhelpful' ? null : 'unhelpful')}
                                                            style={{background: "none", color: helpfulStatus === 'unhelpful' ? "#41AB5D" : "#9ca3af"}}
                                                        >
                                                            <ThumbsDown size={18} />
                                                            <span className="ms-2" style={{fontSize: "14px"}}>Unhelpful ({rev.unhelpfulVotes})</span>
                                                        </button>
                                                    </div>
                                                    {index < paginatedReviews.length - 1 && <hr />}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="mb-0" style={{color: "#9ca3af", fontSize: "14px"}}>No reviews found</p>
                                        )}
                                        {totalPages > 1 && (
                                            <div className="d-flex flex-row justify-content-center gap-2 mt-3">
                                                <button 
                                                    className="btn btn-sm"
                                                    onClick={() => setCurrentPage(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    style={{
                                                        background: currentPage === 1 ? "#e0e0e0" : "#41AB5D",
                                                        color: currentPage === 1 ? "#9ca3af" : "white",
                                                        border: "none",
                                                        cursor: currentPage === 1 ? "default" : "pointer"
                                                    }}
                                                >
                                                    Previous
                                                </button>
                                                <span style={{alignSelf: "center", fontSize: "14px", fontWeight: "bold"}}
                                                >{currentPage} / {totalPages}</span>
                                                <button 
                                                    className="btn btn-sm"
                                                    onClick={() => setCurrentPage(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    style={{
                                                        background: currentPage === totalPages ? "#e0e0e0" : "#41AB5D",
                                                        color: currentPage === totalPages ? "#9ca3af" : "white",
                                                        border: "none",
                                                        cursor: currentPage === totalPages ? "default" : "pointer"
                                                    }}
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="custom-card d-flex flex-column p-3" style={{width: "32%", height: "500px"}}>
                            <div className="d-flex flex-row align-items-center justify-content-center mb-3">
                                <div className="rating-box p-1" style={{width: "70px", height: "30px"}}>
                                    <p className="mb-0 text-center" style={{color: "#00441B", fontWeight: "bold"}}>OPEN</p>
                                </div>
                                <p className="mb-0 ms-3" style={{color: "#444646", fontWeight: "bold", fontSize: "20px"}}>{establishment.businessHours}</p>
                            </div>
                            <p className="mb-0" style={{color: "#444646", fontWeight: "bold", fontSize: "16px"}}>Contact Information:</p>
                            <p className="mb-0 mt-2" style={{color: "#444646", fontSize: "14px", fontWeight: "bold"}}>{establishment.phone}</p>
                            <p className="mb-0 mt-2" style={{color: "#444646", fontSize: "14px", fontWeight: "bold"}}>{establishment.email}</p>
                            <img src={addressIcon} alt="address" style={{width: "100%", height: "40%", borderRadius: "5px", objectFit: "cover", marginTop: "10px"}} />
                            <p className="mb-0 mt-2" style={{color: "#444646", fontSize: "14px", fontWeight: "bold"}}>{establishment.address}</p>
                            <a href={establishment.website} className="mb-0 mt-2" style={{color: "#0b08bd", fontSize: "14px"}}>{establishment.website}</a>
                            <Link to="/create" className="button btn btn-primary mt-3" style={{background: "#7f8c8d", border: "none"}}>
                                <Star
                                    size={20}
                                    fill="#41AB5D"
                                    style={{ color: "#41AB5D" }}
                                />
                                <span className="ms-2">Create a review</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Establishment;

