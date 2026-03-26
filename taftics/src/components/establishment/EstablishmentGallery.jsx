export default function EstablishmentGallery({ image, name }) {
    return (
        <div 
            className="w-100 mb-4 rounded-4 shadow-sm overflow-hidden" 
            style={{ height: "400px" }}
        >
            <img
                src={image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Establishment')}&background=00441b&color=fff&size=512&bold=true`}
                alt={name || "Establishment Hero"}
                className="w-100 h-100"
                style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    backgroundColor: "#00441b"
                }}
                onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Establishment')}&background=00441b&color=fff&size=512&bold=true`;
                }}
            />
        </div>
    );
}
