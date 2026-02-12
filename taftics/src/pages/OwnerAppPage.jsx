import React, { useState } from "react";
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
    // Add logic here
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
          {/* Grid Layout: 2 Columns, 3 Rows */}
          <div className="form-grid-2x3">
            {/* 1. Establishment Name (Row 1, Left) */}
            <div className="field-group">
              <label htmlFor="establishmentName">Establishment Name</label>
              <input
                type="text"
                name="establishmentName"
                id="establishmentName"
                className="styled-input"
                value={formData.establishmentName}
                onChange={handleChange}
              />
            </div>

            {/* 2. Address (Row 1, Right) */}
            <div className="field-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                name="address"
                id="address"
                className="styled-input"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            {/* 3. Establishment Type (Row 2, Left) - Dropdown */}
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

            {/* 4. Email (Row 2, Right) */}
            <div className="field-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="styled-input"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* 5. Contact Info (Row 3, Left) */}
            <div className="field-group">
              <label htmlFor="contactInfo">Contact Number</label>
              <input
                type="tel"
                name="contactInfo"
                id="contactInfo"
                className="styled-input"
                value={formData.contactInfo}
                onChange={handleChange}
              />
            </div>

            {/* 6. Contact Name (Row 3, Right) */}
            <div className="field-group">
              <label htmlFor="contactName">Contact Name</label>
              <input
                type="text"
                name="contactName"
                id="contactName"
                className="styled-input"
                value={formData.contactName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Button & Link */}
          <div className="submit-section-column">
            <button type="submit" className="black-btn submit-btn">
              Submit
            </button>

            <p className="switch-account-text">
              Not an owner?{" "}
              <a href="/register-student" className="switch-link">
                Register as a student.
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OwnerAppPage;
