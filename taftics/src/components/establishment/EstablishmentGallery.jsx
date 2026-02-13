export default function EstablishmentGallery({ image }) {
    return (
        <div className="d-flex flex-row justify-content-between w-75 mt-4">
            {/* Main Image */}
            <div
                className="establishment-image"
                style={{
                    height: "300px",
                    width: "49.5%",
                    borderRadius: "10px 0 0 10px",
                    backgroundColor: "#ccc", // Placeholder color
                    backgroundImage: `url(${image})`, // Use dynamic image
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            ></div>

            {/* Middle Column */}
            <div
                className="d-flex flex-column justify-content-between"
                style={{ width: "24.5%", height: "300px" }}
            >
                <div
                    className="establishment-image"
                    style={{
                        height: "49%",
                        backgroundColor: "#ddd", // Placeholder color
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                ></div>
                <div
                    className="establishment-image"
                    style={{
                        height: "49%",
                        backgroundColor: "#eee", // Placeholder color
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                ></div>
            </div>

            {/* Right Column */}
            <div
                className="d-flex flex-column justify-content-between"
                style={{ width: "24.5%", height: "300px" }}
            >
                <div
                    className="establishment-image"
                    style={{
                        height: "49%",
                        borderRadius: "0 10px 0 0",
                        backgroundColor: "#ddd", // Placeholder color
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                ></div>
                <div
                    className="establishment-image"
                    style={{
                        height: "49%",
                        borderRadius: "0 0 10px 0",
                        backgroundColor: "#eee", // Placeholder color
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                ></div>
            </div>
        </div>
    );
}
