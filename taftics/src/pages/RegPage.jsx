import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/LoginRegStyles.css";
import logoImage from "/logo_green.svg?url";

const RegPage = ({ onRegister }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    dlsuId: "",
    confirmPassword: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Basic Validation (Using alerts to preserve original layout)
    if (!formData.name || !formData.email || !formData.password || !formData.dlsuId || !formData.confirmPassword) {
      alert("Please fill in all required fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // 2. Package the data into FormData
    const submitData = new FormData();
    submitData.append("username", formData.username);
    submitData.append("name", formData.name);
    submitData.append("email", formData.email);
    submitData.append("password", formData.password);
    submitData.append("dlsuId", formData.dlsuId);

    // 3. Send to App.jsx and wait for the response
    const result = await onRegister(submitData);
    
    if (result.success) {
      navigate("/"); // Redirect to home if successful
    } else {
      alert(result.message); // Display the error from the server
    }
  };

  return (
    <div className="centered-container">
      <div className="auth-card">
        <Link to="/" className="home-corner-btn">
          Home
        </Link>
        <div className="auth-header">
          <div className="header-brand-row">
            <img
              src={logoImage}
              alt="Taftics Logo"
              className="logo-img-small"
              style={{ paddingBottom: "25px" }}
            />
            <h1 className="auth-title">Taftics</h1>
          </div>
          <h2 className="auth-subtitle">Student Account Registration</h2>
        </div>

        <form className="form-wrapper wide" onSubmit={handleSubmit}>
          <div className="form-grid">
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
            </div>

            <div className="form-column">
              <div className="input-form-group">
                <label htmlFor="username">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="styled-input"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Can be real name or alias"
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

export default RegPage;
