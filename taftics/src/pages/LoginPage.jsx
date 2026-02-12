import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/LoginPage.css";
// Ensure this path matches where your actual logo is
import logoImage from "/logo_white.svg?url";

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();

  // State for inputs and feedback
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // 1. Basic Validation
    if (!username || !password) {
      setError("Please fill in both username and password.");
      return;
    }

    // 2. Call the Mock Login function passed from App.jsx
    const result = onLogin(username, password);

    // 3. Handle Result
    if (result.success) {
      navigate("/"); // Redirect to Landing Page
    } else {
      setError(result.message); // Show error message from mock DB
    }
  };

  return (
    <div className="login-container">
      {/* Left Panel - Branding */}
      <div className="left-panel">
        <div className="content-wrapper">
          <div className="logo-circle">
            <img src={logoImage} alt="Taftics Logo" className="logo-img" />
          </div>
          <h1 className="brand-title">Taftics</h1>
          <p className="brand-tagline">
            A step closer to becoming
            <br />
            the ultimate Taft tambay.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="right-panel">
        <form className="login-form" onSubmit={handleLogin}>
          {/* Error Alert Box */}
          {error && (
            <div
              className="alert alert-danger text-center p-2 mb-4 small rounded-3"
              style={{
                backgroundColor: "#f8d7da",
                color: "#842029",
                border: "1px solid #f5c2c7",
              }}
            >
              {error}
            </div>
          )}

          <div className="login-field-group">
            <label htmlFor="username">Username or email</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="styled-input"
              placeholder="e.g. leelanczerscx"
            />
          </div>

          <div className="login-field-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="styled-input"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          <p className="register-text">
            Not a member yet?{" "}
            <Link to="/register" className="register-link">
              Register now!
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
