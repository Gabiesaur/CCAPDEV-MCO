import React from "react";
import { Star } from "lucide-react";



function CreateReview() {
    const stars = Array(5).fill(0);
    const [rating, setRating] = React.useState(0);
    const [hover, setHover] = React.useState(0);
    const [titleText, setTitleText] = React.useState("");
    const [reviewText, setReviewText] = React.useState("");

    const dummyData = {
        name: "De La Salle University",
        type: "Laundry",
        fiveStar: 13,
        fourStar: 3,
        threeStar: 1,
        twoStar: 2,
        oneStar: 1,
        totalReviews: 20,
    };

    const handleClick = (index) => {
        setRating(index + 1);
    }

    const handleMouseEnter = (index) => {
        setHover(index + 1);
    }

    const handleMouseLeave = () => {
        setHover(0);
    }

    const fileInputRef = React.useRef(null);
    const [images, setImages] = React.useState([]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    }

    const handleFilesChange = (e) => {
        const files = Array.from(e.target.files || []).slice(0, 6);
        const newImages = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
        setImages((prev) => {
            const combined = [...prev, ...newImages];
            return combined.slice(0, 6);
        });
        e.target.value = null;
    }

    const removeImage = (index) => {
        setImages((prev) => {
            const copy = prev.slice();
            URL.revokeObjectURL(copy[index].url);
            copy.splice(index, 1);
            return copy;
        });
    }

    const average = (() => {
        const total = dummyData.totalReviews || 0;
        if (!total) return 0;
        const sum = 5 * (dummyData.fiveStar || 0) + 4 * (dummyData.fourStar || 0) + 3 * (dummyData.threeStar || 0) + 2 * (dummyData.twoStar || 0) + 1 * (dummyData.oneStar || 0);
        return sum / total;
    })();

    

    return (
        <div>
            <div className="d-flex flex-column align-items-center min-vw-100">
                <div className="d-flex flex-column align-items-left w-75">
                    <h5 className="text-dlsu-dark">CREATE REVIEW</h5>
                    <h1>Tell us your story</h1>
                </div>
                <div className="d-flex flex-row justify-content-between w-75">
                    <div className="custom-card border p-3 d-flex align-items-center justify-content-center" style={{width: "60%", height: "700px"}}>
                        <div style={{width: "95%", height: "95%"}}>
                            <p>QUALITY SCORE</p>
                            <div className="textBox p-3 d-flex flex-row justify-content-between" style={{width: "52%"}}>
                                <div className="d-flex flex-row gap-1">
                                    {stars.map((_, index) => {
                                        return (
                                            <Star
                                                key={index}
                                                size={26}
                                                fill={index < (hover || rating) ? "currentColor" : "none"}
                                                style={{
                                                    cursor: "pointer",
                                                    color: index < (hover || rating) ? "#41AB5D" : "#9ca3af",
                                                }}
                                                onClick={() => handleClick(index)}
                                                onMouseOver={() => handleMouseEnter(index)}
                                                onMouseLeave={handleMouseLeave}
                                            />
                                        )
                                    })}
                                </div>
                                <p className="mb-0">Select Rating</p>
                            </div>
                            <p className="mt-4">TITLE</p>
                            <textarea
                                className="border-0"
                                placeholder="Summarize your experience..."
                                rows={1}
                                style={{backgroundColor: "transparent", color: "#7f8c8d", width:"100%", height:"20px", outline: "none", resize: "none", overflow: "hidden"}}
                                value={titleText}
                                onChange={(e) => setTitleText(e.target.value)}
                            />
                            <hr className="border-2 opacity-100 mt-0" style={{color: "#A0ACC9"}}/>
                            <p className="mt-4">DETAILS</p>
                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="mb-3">
                                    <textarea
                                        className="form-control border-0 rounded-3 p-3 shadow-sm"
                                        placeholder="Tell us your experience. How was the service?"
                                        rows={5}
                                        style={{backgroundColor: "#d1d8e0", color: "#7f8c8d", resize: "none"}}
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                    />
                                </div>
                            </form>
                            <p className="mt-4">MEDIA (PHOTOS)</p>
                            <div className="mb-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    ref={fileInputRef}
                                    onChange={handleFilesChange}
                                    style={{ display: "none" }}
                                />
                                <button type="button" className="btn btn-outline-secondary btn-sm mb-2" onClick={handleUploadClick}>
                                    Upload Photos
                                </button>
                                <div className="d-flex flex-wrap gap-2 mt-2">
                                    {images.map((img, i) => (
                                        <div key={i} className="position-relative" style={{ width: 80, height: 80 }}>
                                            <img src={img.url} alt={`preview-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }} />
                                            <button type="button" className="btn btn-sm btn-danger position-absolute" style={{ top: -8, right: -8, padding: '2px 6px' }} onClick={() => removeImage(i)}>×</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="custom-card border" style={{width: "35%", height: "500px"}}>
                        <div className="custom-bg pt-3 ps-3 pe-3 pb-1" style={{height: "30%"}}>
                            <div className="position-relative top-50" style={{height: "50%"}}>
                                <div className="category-box d-flex justify-content-center align-items-center" style={{width: "40%"}}>
                                    <p className="text-white mb-0" style={{fontSize: 15}}>{dummyData.type}</p>
                                </div>
                                <p className="text-white" style={{fontSize: 25}}>{dummyData.name}</p>
                            </div>
                        </div>
                        <div className="p-3 d-flex flex-column gap-2" style={{height: "70%"}}>
                            <div className="d-flex align-items-center gap-3 ps-2">
                                <div className="d-flex flex-row align-items-center gap-2">
                                    <div className="fw-bold fs-4">{average.toFixed(1)}</div>
                                    <div className="text-muted small">({dummyData.totalReviews})</div>
                                </div>

                                <div className="d-flex align-items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            fill={i < Math.round(average) ? "currentColor" : "none"}
                                            style={{ color: i < average ? "#41AB5D" : "#9ca3af" }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="d-flex flex-column gap-2 ps-2 pt-1" style={{height: "70%"}}>
                                <div className="d-flex flex-row align-items-center mb-2">
                                    <p className="mb-0" style={{width: "10%"}}>5</p>
                                    <div className="bar" style={{width: `${(dummyData.fiveStar / dummyData.totalReviews * 100 || 0)}%`}}></div>
                                </div>
                                <div className="d-flex flex-row align-items-center mb-2">
                                    <p className="mb-0" style={{width: "10%"}}>4</p>
                                    <div className="bar" style={{width: `${(dummyData.fourStar / dummyData.totalReviews * 100 || 0)}%`}}></div>
                                </div>
                                <div className="d-flex flex-row align-items-center mb-2">
                                    <p className="mb-0" style={{width: "10%"}}>3</p>
                                    <div className="bar" style={{width: `${(dummyData.threeStar / dummyData.totalReviews * 100 || 0)}%`}}></div>
                                </div>
                                <div className="d-flex flex-row align-items-center mb-2">
                                    <p className="mb-0" style={{width: "10%"}}>2</p>
                                    <div className="bar" style={{width: `${(dummyData.twoStar / dummyData.totalReviews * 100 || 0)}%`}}></div>
                                </div>
                                <div className="d-flex flex-row align-items-center mb-2">
                                    <p className="mb-0" style={{width: "10%"}}>1</p>
                                    <div className="bar" style={{width: `${(dummyData.oneStar / dummyData.totalReviews * 100 || 0)}%`}}></div>
                                </div>
                            </div>

                            <div className="textBox d-flex align-items-center justify-content-center p-3" style={{height: "20%", fontSize: 10}}>
                                <p className="mb-0">Your reviews help establishments build trust and help receive valuable feedback for improvements. Describe your experience and include specific services.</p>
                            </div>
                        </div>
                        <button className="button btn btn-primary w-100 p-3 mt-3">Submit Review</button>
                    </div>


                </div>
            </div>
        </div>
        
    );
};

export default CreateReview;