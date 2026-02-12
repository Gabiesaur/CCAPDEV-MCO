import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/OwnerAppPage.css";

const OwnerAppPage = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Owner Application:", formData);
  };

  return (
    <div className="owner-reg-container">
      <div className="owner-reg-card">
        {/* Header */}
        <div className="owner-reg-header">
          <h1 className="owner-reg-title">Taftics</h1>
          <h2 className="owner-reg-subtitle">
            Establishment Owner Account Application
          </h2>
        </div>

        <form className="owner-reg-form" onSubmit={handleSubmit}>
          <div className="form-grid-2x3">
            <div className="field-group">
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

            <div className="field-group">
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

            <div className="field-group">
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
                <option value="food">Food & Beverage</option>
                <option value="retail">Retail Store</option>
                <option value="services">Services</option>
                <option value="study">Study Hub/Coworking</option>
              </select>
            </div>

            <div className="field-group">
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

            <div className="field-group">
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

            <div className="field-group">
              <label htmlFor="contactName">Contact Name</label>
              <input
                type="text"
                name="contactName"
                id="contactName"
                className="styled-input"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="Name of person from given contact number"
              />
            </div>
          </div>

          <div className="submit-section-column">
            <button type="submit" className="black-btn submit-btn">
              Submit
            </button>

            <p className="switch-account-text">
              Not an owner?{" "}
              <Link to="/register" className="switch-link">
                Register as a student.
              </Link>
              <br></br>
              <Link to="/" className="register-link">
                Home
              </Link>{" "}
              <Link to="/login" className="register-link">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OwnerAppPage;
