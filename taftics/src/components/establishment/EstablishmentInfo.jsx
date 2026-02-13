export default function EstablishmentInfo({ description }) {
    return (
        <div
            className="custom-card d-flex flex-column p-3 mt-3 h-auto"
            style={{ minHeight: "100px" }}
        >
            <div className="d-flex flex-column">
                <p className="h3 mb-2 fw-bold">About us</p>
                <p
                    className="mb-0 fw-bold text-wrap text-break"
                    style={{ color: "#444646", fontSize: "14px", lineHeight: "1.5" }}
                >
                    {description}
                </p>
            </div>
        </div>
    );
}
