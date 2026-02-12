import React, { useState, useRef } from "react";
import "../styles/RegPage.css";

const RegPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    dlsuId: "",
    confirmPassword: "",
    avatar: null,
  });

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileClick = (e) => {
    e.preventDefault(); // Prevent form submission
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, avatar: e.target.files[0] }));
      alert(`Selected: ${e.target.files[0].name}`); // Just for feedback
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration Data:", formData);
    // Add registration logic here
  };

  return (
    <div className="reg-container">
      <div className="reg-card">
        <div className="reg-header">
          <h1 className="reg-title">Taftics</h1>
          <h2 className="reg-subtitle">Student Account Registration</h2>
        </div>

        <form className="reg-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* --- Left Column --- */}
            <div className="form-column">
              <div className="reg-field-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="reg-styled-input"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div className="reg-field-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="reg-styled-input"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="reg-field-group">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="reg-styled-input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* --- Right Column --- */}
            <div className="form-column">
              <div className="reg-field-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="reg-styled-input"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="reg-field-group">
                <label htmlFor="dlsuId">First 3 digits of DLSU ID#</label>
                <input
                  type="text"
                  name="dlsuId"
                  id="dlsuId"
                  maxLength="3"
                  className="reg-styled-input"
                  value={formData.dlsuId}
                  onChange={handleChange}
                />
              </div>

              <div className="reg-field-group">
                <label>Avatar</label>
                <button className="avatar-upload-btn" onClick={handleFileClick}>
                  Upload an avatar
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
            </div>
          </div>

          <div className="submit-section">
            <button type="submit" className="reg-submit-btn">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegPage;
