import React, { useState, useEffect } from "react";
import { Upload, ImageIcon, X } from "lucide-react";

export default function ImageUploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Clean up object URL when component unmounts or previewUrl changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Reset state on modal close
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation(); // prevent clicking the parent div
    setSelectedFile(null);
    setPreviewUrl(null);
    // Reset input value
    const input = document.getElementById("fileInput");
    if (input) input.value = "";
  };

  const handleSave = () => {
    // 1. Tell the parent to show the toast
    // (Optionally pass selected file back if the parent wants to handle real uploads)
    onUploadSuccess(selectedFile);
    // 2. Reset state
    setSelectedFile(null);
    setPreviewUrl(null);
    // 3. Close immediately to remove the blur
    onClose();
  };

  const handleCloseModal = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  return (
    <>
      {/* GLASS BLUR BACKDROP */}
      <div className="glass-backdrop fade show" onClick={handleCloseModal} />

      {/* MODAL CONTENT */}
      <div className="modal d-block" style={{ zIndex: 1060 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden bg-white">
            <div className="modal-header bg-dlsu-dark text-white border-0 py-3">
              <h5 className="modal-title fw-bold">Update Profile Picture</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={handleCloseModal}
              />
            </div>

            <div className="modal-body p-4 text-center">
              <div
                className={`upload-drop-zone rounded-4 mb-3 d-flex flex-column align-items-center justify-content-center position-relative overflow-hidden mx-auto ${!previewUrl ? 'p-5' : ''}`}
                onClick={() => !previewUrl && document.getElementById("fileInput").click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{
                  border: previewUrl ? "none" : "2px dashed #ccc",
                  cursor: previewUrl ? "default" : "pointer",
                  width: previewUrl ? "250px" : "100%",
                  height: previewUrl ? "250px" : "auto",
                  minHeight: "200px"
                }}
              >
                {previewUrl ? (
                  <>
                    <img 
                      src={previewUrl} 
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
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="bg-dlsu-light p-3 rounded-circle mb-3">
                      <Upload size={32} className="text-dlsu-dark" />
                    </div>
                    <h6 className="fw-bold mb-1">
                      Click to upload or drag and drop
                    </h6>
                    <p className="text-muted small mb-0">
                      PNG, JPG or GIF (max. 5MB)
                    </p>
                  </>
                )}
                
                <input
                  type="file"
                  id="fileInput"
                  className="d-none"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              {selectedFile ? (
                <div className="d-flex align-items-center gap-2 p-3 bg-light rounded-3 mb-2 text-start border">
                  <ImageIcon size={18} className="text-muted" />
                  <small className="text-muted text-truncate w-100">
                    Selected: {selectedFile.name}
                  </small>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2 p-3 bg-light rounded-3 mb-2 text-start border">
                  <ImageIcon size={18} className="text-muted" />
                  <small className="text-muted">
                    Current: profile_picture.jpg
                  </small>
                </div>
              )}
            </div>

            <div className="modal-footer border-0 p-3 pt-0">
              <button
                className="btn btn-light fw-bold px-4 rounded-pill"
                onClick={handleCloseModal}
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
