import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/LoginRegStyles.css";
import logoImage from "/logo_white.svg?url";

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please fill in both username and password.");
      return;
    }
    const result = onLogin(username, password);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="split-screen-container">
      <div className="brand-panel">
        <div className="brand-content">
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

      <div className="form-panel">
        <form className="form-wrapper" onSubmit={handleLogin}>
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

          <div className="input-form-group">
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

          <div className="input-form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="styled-input"
              placeholder="••••••••"
            />
            <a
              className="text-link"
              style={{ textAlign: "center", paddingTop: "10px" }}
            >
              Forgot password?
            </a>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="rememberMe"
              className="styled-checkbox"
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>

          <div className="action-section">
            <button type="submit" className="primary-btn">
              Login
            </button>

            <p className="footer-text">
              Not a member yet?{" "}
              <Link to="/register" className="text-link">
                Register now!
              </Link>
              <br />
              <Link to="/" className="text-link">
                Return to home
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
