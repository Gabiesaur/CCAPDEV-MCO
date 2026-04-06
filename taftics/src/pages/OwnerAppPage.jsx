import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import "../styles/LoginRegStyles.css";
import logoImage from "/logo_green.svg?url";

const OwnerAppPage = ({ onApply }) => {
  const navigate = useNavigate();
  
  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const [formData, setFormData] = useState({
    establishmentName: "",
    address: "",
    establishmentType: "",
    email: "",
    contactInfo: "",
    contactName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Basic Validation
    if (!formData.establishmentName || !formData.address || !formData.establishmentType || !formData.email || !formData.contactInfo || !formData.contactName) {
      triggerToast("Please fill in all required fields.");
      return;
    }

    const submitData = {
      establishmentName: formData.establishmentName,
      address: formData.address,
      establishmentType: formData.establishmentType,
      email: formData.email,
      contactInfo: formData.contactInfo,
      contactName: formData.contactName
    };

    // 2. Send to App.jsx and wait for the response
    setIsSubmitting(true);
    const result = await onApply(submitData);
    
    if (result.success) {
      triggerToast("Application submitted successfully! Redirecting...");
      setTimeout(() => {
        navigate("/"); 
      }, 1500); 
    } else {
      alert(result.message || "Failed to submit application.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="centered-container position-relative">
      {/* Success Toast */}
      {showToast && (
        <div className="toast-success-custom fw-bold" style={{ zIndex: 9999 }}>
          <CheckCircle2 size={24} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="auth-card">
        <Link to="/" className="home-corner-btn">
          Home
        </Link>
        <div className="auth-header">
          <div class="header-brand-row">
            <img
              src={logoImage}
              alt="Taftics Logo"
              className="logo-img-small"
              style={{ paddingBottom: "25px" }}
            />
            <h1 className="auth-title">Taftics</h1>
          </div>
          <h2 className="auth-subtitle">
            Establishment Owner Account Application
          </h2>
        </div>

        <form className="form-wrapper wide" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="input-form-group">
              <label htmlFor="establishmentName">Establishment Name</label>
              <input
                type="text"
                name="establishmentName"
                id="establishmentName"
                className="styled-input"
                value={formData.establishmentName}
                onChange={handleChange}
                placeholder="Title of establishment"
              />
            </div>

            <div className="input-form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                name="address"
                id="address"
                className="styled-input"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. 2401 Taft Avenue, Malate, Manila"
              />
            </div>

            <div className="input-form-group">
              <label htmlFor="establishmentType">Establishment Type</label>
              <select
                name="establishmentType"
                id="establishmentType"
                className="styled-input dropdown-arrow"
                value={formData.establishmentType}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select type
                </option>
                <option value="School Supplies">School Supplies</option>
                <option value="Laundry">Laundry</option>
                <option value="Dorms/Condos">Dorms/Condos</option>
                <option value="Services">Services</option>
                <option value="Fitness">Fitness</option>
                <option value="Food">Food</option>
                <option value="Coffee">Coffee</option>
              </select>
            </div>

            <div className="input-form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="styled-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="Business or owner's email"
              />
            </div>

            <div className="input-form-group">
              <label htmlFor="contactInfo">Contact Number</label>
              <input
                type="tel"
                name="contactInfo"
                id="contactInfo"
                className="styled-input"
                value={formData.contactInfo}
                onChange={handleChange}
                placeholder="09XX-XXX-XXXX"
              />
            </div>

            <div className="input-form-group">
              <label htmlFor="contactName">Contact Person</label>
              <input
                type="text"
                name="contactName"
                id="contactName"
                className="styled-input"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="Name of person to be contacted"
              />
            </div>
          </div>

          <div className="action-section">
            <button 
              type="submit" 
              className="primary-btn wide" 
              disabled={isSubmitting}
              style={{ opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>

            <p className="footer-text">
              Not an owner?{" "}
              <Link to="/register" className="text-link">
                Register as a student.
              </Link>
              <br />
              <Link to="/login" className="text-link">
                Back to login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OwnerAppPage;
