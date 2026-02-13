import { Star, BookMarked } from "lucide-react";

export default function EstablishmentHeader({
    establishment,
    isBookmarked,
    onBookmarkToggle,
}) {
    return (
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
                                <span className="ms-2">{establishment.rating}</span>
                            </p>
                        </div>
                        <span className="mx-3">&bull;</span>
                        <p
                            className="mb-0 fw-bold"
                            style={{ color: "#444646", fontSize: "20px" }}
                        >
                            {establishment.reviewCount} reviews
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
                onClick={onBookmarkToggle}
                style={{ cursor: "pointer" }}
            >
                <BookMarked
                    size={30}
                    fill={isBookmarked ? "#41AB5D" : "none"}
                    style={{ color: isBookmarked ? "#00441B" : "#000000" }}
                />
            </button>
        </div>
    );
}
