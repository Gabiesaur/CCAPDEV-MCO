export default function EstablishmentGallery({ image }) {
    return (
        <div 
            className="w-100 mb-4 rounded-4 shadow-sm overflow-hidden" 
            style={{ height: "400px" }}
        >
            <img
                src={image}
                alt="Establishment Hero"
                className="w-100 h-100"
                style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    backgroundColor: "#ccc"
                }}
            />
        </div>
    );
}
