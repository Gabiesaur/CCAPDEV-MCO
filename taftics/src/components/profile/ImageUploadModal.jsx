import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

const ImageUploadModal = ({ isOpen, onClose, onUploadSuccess, userId }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef(null);

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
    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, GIF).');
      return;
    }
    
    // Validate file size (e.g., max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError(null);
  };

  // --- API COMMUNICATION ---
  const handleUpload = async () => {
    if (!file || !userId) return;

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
        handleClose();
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

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    setIsDragging(false);
    onClose();
  };

  // Allow clicking the dropzone to open the file browser
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-custom" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050, display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className="modal-content-custom bg-white rounded-4 shadow-lg" style={{ width: "100%", maxWidth: "500px" }}>
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
          <h5 className="mb-0 fw-bold">Update Profile Picture</h5>
          <button 
            onClick={handleClose}
            className="btn btn-link text-muted p-0 hover-text-dark transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          {error && (
            <div className="alert alert-danger py-2 px-3 mb-4 text-sm d-flex align-items-center gap-2">
              <X size={16} />
              {error}
            </div>
          )}

          {/* Native Dropzone Area */}
          <div 
            onClick={triggerFileInput}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`dropzone-area p-5 rounded-4 text-center cursor-pointer transition-all ${
              isDragging ? 'border-success bg-success bg-opacity-10 border-solid' : 'border-dashed border-2 bg-light'
            } ${preview ? 'border-0 p-0 overflow-hidden' : ''}`}
            style={{ borderStyle: preview ? 'none' : (isDragging ? 'solid' : 'dashed'), cursor: 'pointer' }}
          >
            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg, image/png, image/gif"
              style={{ display: 'none' }} 
            />
            
            {preview ? (
              <div className="position-relative w-100 h-100 bg-black">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-100 h-100 object-fit-cover opacity-75"
                  style={{ maxHeight: '300px' }}
                />
                <div className="position-absolute top-50 start-50 translate-middle text-white text-center w-100">
                  <div className="bg-dark bg-opacity-50 d-inline-block px-4 py-2 rounded-pill fw-medium backdrop-blur">
                    Click or drag to change
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-4">
                <div className="bg-white rounded-circle d-inline-flex p-3 shadow-sm mb-3">
                  <Upload size={32} className="text-success" />
                </div>
                <h6 className="fw-bold mb-2">
                  {isDragging ? "Drop your image here" : "Click or drag image to upload"}
                </h6>
                <p className="text-muted small mb-0">
                  SVG, PNG, JPG or GIF (max. 5MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-top bg-light rounded-bottom-4 d-flex justify-content-end gap-2">
          <button 
            className="btn btn-light border fw-medium px-4"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="btn btn-success fw-bold px-4 d-flex align-items-center gap-2"
            onClick={handleUpload}
            disabled={!file || loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin" />
                Uploading...
              </>
            ) : (
              <>
                <ImageIcon size={18} />
                Save Picture
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;