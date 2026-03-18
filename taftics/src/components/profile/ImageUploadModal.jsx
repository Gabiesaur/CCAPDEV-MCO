import React, { useState, useRef, useEffect } from "react";
import { Upload, Image as ImageIcon, X, Loader2 } from "lucide-react";

export default function ImageUploadModal({ isOpen, onClose, onUploadSuccess, userId }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  // Clean up object URL when component unmounts or previewUrl changes
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Reset state on modal close
  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setPreview(null);
      setError(null);
      setIsDragging(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // --- NATIVE DRAG AND DROP HANDLERS ---
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  // --- FILE PROCESSING & VALIDATION ---
  const processFile = (selectedFile) => {
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, GIF).');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError(null);
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation(); // prevent clicking the parent div
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- API COMMUNICATION ---
  const handleSave = async () => {
    if (!file || !userId) {
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/avatar`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onUploadSuccess(data.user);
        handleCloseModal();
      } else {
        setError(data.message || "Failed to upload image.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Network error. Make sure your server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    setIsDragging(false);
    onClose();
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <div className="glass-backdrop fade show" onClick={!loading ? handleCloseModal : undefined} />
      
      <div className="modal d-block" style={{ zIndex: 1060 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden bg-white">
            <div className="modal-header bg-dlsu-dark text-white border-0 py-3">
              <h5 className="modal-title fw-bold">Update Profile Picture</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={handleCloseModal}
                disabled={loading}
              />
            </div>

            <div className="modal-body p-4 text-center">
              {error && (
                <div className="alert alert-danger py-2 px-3 mb-3 text-sm d-flex align-items-center gap-2">
                  <X size={16} />
                  {error}
                </div>
              )}

              <div
                className={`upload-drop-zone rounded-4 mb-3 d-flex flex-column align-items-center justify-content-center position-relative overflow-hidden mx-auto transition-all ${!preview ? 'p-5' : ''}`}
                onClick={() => !preview && triggerFileInput()}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  border: preview ? "none" : (isDragging ? "2px solid #48a868" : "2px dashed #ccc"),
                  backgroundColor: isDragging ? "rgba(72, 168, 104, 0.05)" : "transparent",
                  cursor: preview ? "default" : "pointer",
                  width: preview ? "250px" : "100%",
                  height: preview ? "250px" : "auto",
                  minHeight: "200px"
                }}
              >
                {preview ? (
                  <>
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="img-fluid w-100 h-100 position-absolute top-0 start-0"
                      style={{ objectFit: 'cover' }}
                    />
                    {/* Translucent overlay for circular preview cutout */}
                    <div 
                      className="position-absolute pe-none"
                      style={{
                        top: 0, left: 0, right: 0, bottom: 0,
                        borderRadius: "50%",
                        boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
                        border: "2px solid rgba(255, 255, 255, 0.8)",
                        margin: "0"
                      }}
                    ></div>
                    <button 
                      className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle shadow d-flex align-items-center justify-content-center p-1"
                      onClick={handleRemoveImage}
                      title="Remove image"
                      style={{ zIndex: 10 }}
                      disabled={loading}
                    >
                      <X size={16} />
                    </button>
                    {loading && (
                      <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 5 }}>
                        <Loader2 size={32} className="spin text-dlsu-dark" />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="bg-dlsu-light p-3 rounded-circle mb-3">
                      <Upload size={32} className="text-dlsu-dark" />
                    </div>
                    <h6 className="fw-bold mb-1">
                      {isDragging ? "Drop your image here" : "Click or drag to upload"}
                    </h6>
                    <p className="text-muted small mb-0">
                      PNG, JPG or GIF (max. 5MB)
                    </p>
                  </>
                )}
                
                <input
                  type="file"
                  id="fileInput"
                  ref={fileInputRef}
                  className="d-none"
                  accept="image/jpeg, image/png, image/gif"
                  onChange={handleFileChange}
                />
              </div>

              {file ? (
                <div className="d-flex align-items-center gap-2 p-3 bg-light rounded-3 mb-2 text-start border">
                  <ImageIcon size={18} className="text-muted" />
                  <small className="text-muted text-truncate w-100">
                    Selected: {file.name}
                  </small>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2 p-3 bg-light rounded-3 mb-2 text-start border">
                  <ImageIcon size={18} className="text-muted" />
                  <small className="text-muted">
                    No new image selected
                  </small>
                </div>
              )}
            </div>

            <div className="modal-footer border-0 p-3 pt-0">
              <button
                className="btn btn-light fw-bold px-4 rounded-pill"
                onClick={handleCloseModal}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn btn-dlsu-dark rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2"
                onClick={handleSave}
                disabled={!file || loading}
              >
                {loading ? <Loader2 size={16} className="spin" /> : null}
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}