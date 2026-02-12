import React, { useState } from "react";
import "../styles/LoginPage.css"; // Make sure to import the CSS file
// TODO: Replace this import with the path to your actual logo file
import logoImage from "./logo.png";

const LoginPage = () => {
  // State to handle input values
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with:", username, password);
    // Add your login logic here (API calls, etc.)
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
          <div className="input-group">
            <label htmlFor="username">Username or email</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="styled-input"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="styled-input"
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          <p className="register-text">
            Not a member yet?{" "}
            <a href="/register" className="register-link">
              Register now!
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
