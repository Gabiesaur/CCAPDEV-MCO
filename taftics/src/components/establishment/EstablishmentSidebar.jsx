import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import addressIcon from "../../assets/address.png"; // Adjusted path import

export default function EstablishmentSidebar({ establishment }) {
    return (
        <div
            className="custom-card d-flex flex-column p-4"
            style={{ width: "100%", minHeight: "500px" }}
        >
            <div className="d-flex flex-row align-items-center justify-content-center mb-3">
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
                    className="mb-0 ms-2 fw-bold"
                    style={{ color: "#444646", fontSize: "20px" }}
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
                {establishment.phone}
            </p>
            <p
                className="mb-0 mt-2 fw-bold text-break" // Added text-break
                style={{ color: "#444646", fontSize: "14px" }}
            >
                {establishment.email}
            </p>

            <div
                className="w-100 my-2"
                style={{
                    height: "150px", // Fixed height for image area
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
                className="mb-0 fw-bold text-wrap" // Added text-wrap
                style={{ color: "#444646", fontSize: "14px", lineHeight: "1.4" }}
            >
                {establishment.address}
            </p>

            <a
                href={`http://${establishment.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-0 mt-2 text-break" // Added text-break
                style={{ color: "#0b08bd", fontSize: "14px" }}
            >
                {establishment.website}
            </a>

            <Link
                to="/create"
                className="button btn mt-auto d-flex align-items-center justify-content-center py-2" // mt-auto pushes to bottom
                style={{ background: "#00441B", border: "none", color: "white" }}
            >
                <Star size={20} fill="#41AB5D" style={{ color: "#41AB5D" }} />
                <span className="ms-2">Create a review</span>
            </Link>
        </div>
    );
}
