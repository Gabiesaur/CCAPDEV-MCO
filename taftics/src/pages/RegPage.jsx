import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/LoginRegStyles.css";

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
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, avatar: e.target.files[0] }));
      alert(`Selected: ${e.target.files[0].name}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration Data:", formData);
  };

  return (
    <div className="centered-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Taftics</h1>
          <h2 className="auth-subtitle">Student Account Registration</h2>
        </div>

        <form className="form-wrapper wide" onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Left Column */}
            <div className="form-column">
              <div className="input-form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="styled-input"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Can contain letters, numbers and symbols: - _ ."
                />
              </div>

              <div className="input-form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="styled-input"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Must be at least 8 characters long"
                />
              </div>

              <div className="input-form-group">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="styled-input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                />
              </div>
            </div>

            <div className="form-column">
              <div className="input-form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="styled-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Active DLSU (@dlsu.edu.ph) email"
                />
              </div>

              <div className="input-form-group">
                <label htmlFor="dlsuId">First 3 digits of DLSU ID Number</label>
                <input
                  type="text"
                  name="dlsuId"
                  id="dlsuId"
                  maxLength="3"
                  className="styled-input"
                  value={formData.dlsuId}
                  onChange={handleChange}
                  placeholder="e.g. 12x, 11x"
                />
              </div>

              <div className="input-form-group">
                <label>Avatar (optional)</label>
                <button
                  className="primary-btn full-width"
                  onClick={handleFileClick}
                >
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

          <div className="action-section">
            <button type="submit" className="primary-btn wide">
              Register
            </button>

            <p className="footer-text">
              Owning an establishment?{" "}
              <Link to="/apply" className="text-link">
                Apply here.
              </Link>
              <br />
              <Link to="/" className="text-link">
                Home
              </Link>{" "}
              <Link to="/login" className="text-link">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegPage;
