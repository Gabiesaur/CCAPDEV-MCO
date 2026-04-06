import React, { useState, useEffect } from "react";
import { Star, X } from "lucide-react";

export default function ReviewEditModal({ isOpen, onClose, review, onSave }) {
  if (!isOpen) return null;

  const [rating, setRating] = useState(review?.rating || 0);
  const [title, setTitle] = useState(review?.title || "");
  const [body, setBody] = useState(review?.body || review?.comment || "");
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState(review?.images || []);
  const [newVideos, setNewVideos] = useState([]);
  const [existingVideos, setExistingVideos] = useState(review?.videos || []);
  const fileInputRef = React.useRef(null);
  const videoInputRef = React.useRef(null);

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setTitle(review.title);
      setBody(review.body || review.comment || "");
      setExistingImages(review.images || []);
      setExistingVideos(review.videos || []);
      setNewImages([]);
      setNewVideos([]);
    }
  }, [review]);

  const handleSave = () => {
    onSave({
      ...review,
      rating,
      title,
      body,
      existingImages,
      newImages,
      existingVideos,
      newVideos,
      isEdited: true,
    });
    onClose();
  };

  const handleUploadClick = () => fileInputRef.current?.click();
  const handleVideoUploadClick = () => videoInputRef.current?.click();

  const handleFilesChange = (e) => {
    const currentCount = existingImages.length + newImages.length;
    const files = Array.from(e.target.files || []).slice(0, 6 - currentCount);
    const addedImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setNewImages((prev) =>
      [...prev, ...addedImages].slice(0, 6 - existingImages.length),
    );
    e.target.value = null;
  };

  const handleVideoFilesChange = (e) => {
    const currentCount = existingVideos.length + newVideos.length;
    const files = Array.from(e.target.files || []).slice(0, 3 - currentCount);
    const addedVideos = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setNewVideos((prev) =>
      [...prev, ...addedVideos].slice(0, 3 - existingVideos.length),
    );
    e.target.value = null;
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[index].url);
      copy.splice(index, 1);
      return copy;
    });
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewVideo = (index) => {
    setNewVideos((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[index].url);
      copy.splice(index, 1);
      return copy;
    });
  };

  const removeExistingVideo = (index) => {
    setExistingVideos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      {/* GLASS BLUR BACKDROP */}
      <div className="glass-backdrop fade show" onClick={onClose} />

      {/* MODAL CONTENT */}
      <div className="modal d-block" style={{ zIndex: 1060 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden bg-white">
            <div className="modal-header bg-dlsu-dark text-white border-0 py-3">
              <h5 className="modal-title fw-bold">Edit Review</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>

            <div className="modal-body p-4 text-start">
              {/* Rating Input */}
              <div className="mb-3">
                <label className="form-label fw-bold small text-uppercase text-muted">
                  Rating
                </label>
                <div className="d-flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={32}
                      className={`pointer-cursor ${star <= rating ? "text-dlsu-primary" : "text-muted"}`}
                      fill={star <= rating ? "currentColor" : "none"}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div className="mb-3">
                <label
                  htmlFor="reviewTitle"
                  className="form-label fw-bold small text-uppercase text-muted"
                >
                  Title
                </label>
                <input
                  type="text"
                  className="form-control rounded-3 bg-light border-0 py-2"
                  id="reviewTitle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Body Input */}
              <div className="mb-3">
                <label
                  htmlFor="reviewBody"
                  className="form-label fw-bold small text-uppercase text-muted"
                >
                  Body
                </label>
                <textarea
                  className="form-control rounded-3 bg-light border-0 py-2"
                  id="reviewBody"
                  rows="4"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                ></textarea>
              </div>

              {/* Media (Photos) */}
              <div className="mb-3">
                <label className="form-label fw-bold small text-uppercase text-muted d-block">
                  Media (Photos)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFilesChange}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  className="btn btn-outline-success rounded-pill px-4 btn-sm mb-2"
                  onClick={handleUploadClick}
                >
                  Upload Photos
                </button>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {existingImages.map((url, i) => (
                    <div
                      key={`exist-${i}`}
                      className="position-relative"
                      style={{ width: 80, height: 80 }}
                    >
                      <img
                        src={url}
                        alt={`existing-${i}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 12,
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute rounded-circle shadow"
                        style={{
                          top: -8,
                          right: -8,
                          width: 24,
                          height: 24,
                          padding: 0,
                        }}
                        onClick={() => removeExistingImage(i)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {newImages.map((img, i) => (
                    <div
                      key={`new-${i}`}
                      className="position-relative"
                      style={{ width: 80, height: 80 }}
                    >
                      <img
                        src={img.url}
                        alt={`preview-${i}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 12,
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute rounded-circle shadow"
                        style={{
                          top: -8,
                          right: -8,
                          width: 24,
                          height: 24,
                          padding: 0,
                        }}
                        onClick={() => removeNewImage(i)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Media (Videos) */}
              <div className="mb-3">
                <label className="form-label fw-bold small text-uppercase text-muted d-block">
                  Media (Videos)
                </label>
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  ref={videoInputRef}
                  onChange={handleVideoFilesChange}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  className="btn btn-outline-primary rounded-pill px-4 btn-sm mb-2"
                  onClick={handleVideoUploadClick}
                >
                  Upload Videos
                </button>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {existingVideos.map((url, i) => (
                    <div
                      key={`exist-vid-${i}`}
                      className="position-relative"
                      style={{ width: 160, height: 90 }}
                    >
                      <video
                        src={url}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 12,
                        }}
                        controls
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute rounded-circle shadow"
                        style={{
                          top: -8,
                          right: -8,
                          width: 24,
                          height: 24,
                          padding: 0,
                        }}
                        onClick={() => removeExistingVideo(i)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {newVideos.map((vid, i) => (
                    <div
                      key={`new-vid-${i}`}
                      className="position-relative"
                      style={{ width: 160, height: 90 }}
                    >
                      <video
                        src={vid.url}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 12,
                        }}
                        controls
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute rounded-circle shadow"
                        style={{
                          top: -8,
                          right: -8,
                          width: 24,
                          height: 24,
                          padding: 0,
                        }}
                        onClick={() => removeNewVideo(i)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer border-0 p-3 pt-0">
              <button
                className="btn btn-light fw-bold px-4 rounded-pill"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="btn btn-dlsu-dark rounded-pill px-4 fw-bold shadow-sm"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
