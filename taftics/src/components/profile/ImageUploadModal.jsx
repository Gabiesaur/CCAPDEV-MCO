import React from "react";
import { Upload, ImageIcon } from "lucide-react";

export default function ImageUploadModal({ isOpen, onClose, onUploadSuccess }) {
  if (!isOpen) return null;

  const handleSave = () => {
    // 1. Tell the parent to show the toast
    onUploadSuccess();
    // 2. Close immediately to remove the blur
    onClose();
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
              <h5 className="modal-title fw-bold">Update Profile Picture</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>

            <div className="modal-body p-4 text-center">
              <div
                className="upload-drop-zone rounded-4 p-5 mb-3 d-flex flex-column align-items-center justify-content-center"
                onClick={() => document.getElementById("fileInput").click()}
              >
                <div className="bg-dlsu-light p-3 rounded-circle mb-3">
                  <Upload size={32} className="text-dlsu-dark" />
                </div>
                <h6 className="fw-bold mb-1">
                  Click to upload or drag and drop
                </h6>
                <p className="text-muted small mb-0">
                  PNG, JPG or GIF (max. 5MB)
                </p>
                <input
                  type="file"
                  id="fileInput"
                  className="d-none"
                  accept="image/*"
                />
              </div>

              <div className="d-flex align-items-center gap-2 p-3 bg-light rounded-3 mb-2 text-start border">
                <ImageIcon size={18} className="text-muted" />
                <small className="text-muted">
                  Current: profile_picture.jpg
                </small>
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
