import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/LoginRegStyles.css";
import logoImage from "/logo_green.svg?url";

const USERNAME_REGEX = /^[A-Za-z0-9._-]{3,30}$/;
const DLSU_EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@dlsu\.edu\.ph$/i;
const DLSU_ID_REGEX = /^[01]\d{2}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const validateForm = (data) => {
  const errors = {};
  const username = data.username.trim();
  const name = data.name.trim();
  const email = data.email.trim();
  const dlsuId = data.dlsuId.trim();

  if (!username) {
    errors.username = "Username is required.";
  } else if (!USERNAME_REGEX.test(username)) {
    errors.username = "Use 3-30 characters: letters, numbers, ., _, -.";
  }

  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters long.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!DLSU_EMAIL_REGEX.test(email)) {
    errors.email = "Please use a valid @dlsu.edu.ph email.";
  }

  if (!data.password) {
    errors.password = "Password is required.";
  } else if (!PASSWORD_REGEX.test(data.password)) {
    errors.password =
      "Password must be at least 8 characters with letters and numbers.";
  }

  if (!dlsuId) {
    errors.dlsuId = "DLSU ID series is required.";
  } else if (!DLSU_ID_REGEX.test(dlsuId)) {
    errors.dlsuId = "Enter exactly 3 digits starting with 0 or 1 (e.g., 125).";
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};

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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const normalizedValue =
      name === "dlsuId" ? value.replace(/\D/g, "").slice(0, 3) : value;

    const nextFormData = { ...formData, [name]: normalizedValue };
    setFormData(nextFormData);

    if (submitError) {
      setSubmitError("");
    }

    if (touched[name] || touched.password || touched.confirmPassword) {
      setErrors(validateForm(nextFormData));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const nextTouched = { ...touched, [name]: true };
    setTouched(nextTouched);
    setErrors(validateForm(formData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    setTouched({
      username: true,
      name: true,
      email: true,
      password: true,
      dlsuId: true,
      confirmPassword: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append("username", formData.username.trim());
    submitData.append("name", formData.name.trim());
    submitData.append("email", formData.email.trim());
    submitData.append("password", formData.password);
    submitData.append("dlsuId", formData.dlsuId.trim());

    try {
      const result = await onRegister(submitData);

      if (result.success) {
        navigate("/");
      } else {
        setSubmitError(
          result.message || "Unable to register. Please try again.",
        );
      }
    } catch {
      setSubmitError("Unable to register right now. Please try again.");
    } finally {
      setIsSubmitting(false);
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

        <form className="form-wrapper wide" onSubmit={handleSubmit} noValidate>
          {submitError && <p className="form-submit-error">{submitError}</p>}
          <div className="form-grid">
            <div className="form-column">
              <div className="input-form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className={`styled-input ${errors.username && touched.username ? "input-error" : ""}`}
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Can contain letters, numbers and symbols: - _ ."
                  aria-invalid={Boolean(errors.username && touched.username)}
                  aria-describedby={
                    errors.username && touched.username
                      ? "username-error"
                      : undefined
                  }
                />
                {errors.username && touched.username && (
                  <p id="username-error" className="input-error-text">
                    {errors.username}
                  </p>
                )}
              </div>

              <div className="input-form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className={`styled-input ${errors.email && touched.email ? "input-error" : ""}`}
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Active DLSU (@dlsu.edu.ph) email"
                  aria-invalid={Boolean(errors.email && touched.email)}
                  aria-describedby={
                    errors.email && touched.email ? "email-error" : undefined
                  }
                />
                {errors.email && touched.email && (
                  <p id="email-error" className="input-error-text">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="input-form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className={`styled-input ${errors.password && touched.password ? "input-error" : ""}`}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Must be at least 8 characters long"
                  aria-invalid={Boolean(errors.password && touched.password)}
                  aria-describedby={
                    errors.password && touched.password
                      ? "password-error"
                      : undefined
                  }
                />
                {errors.password && touched.password && (
                  <p id="password-error" className="input-error-text">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <div className="form-column">
              <div className="input-form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className={`styled-input ${errors.name && touched.name ? "input-error" : ""}`}
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Can be real name or alias"
                  aria-invalid={Boolean(errors.name && touched.name)}
                  aria-describedby={
                    errors.name && touched.name ? "name-error" : undefined
                  }
                />
                {errors.name && touched.name && (
                  <p id="name-error" className="input-error-text">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="input-form-group">
                <label htmlFor="dlsuId">First 3 digits of DLSU ID Number</label>
                <input
                  type="text"
                  name="dlsuId"
                  id="dlsuId"
                  maxLength="3"
                  className={`styled-input ${errors.dlsuId && touched.dlsuId ? "input-error" : ""}`}
                  value={formData.dlsuId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. 123"
                  inputMode="numeric"
                  aria-invalid={Boolean(errors.dlsuId && touched.dlsuId)}
                  aria-describedby={
                    errors.dlsuId && touched.dlsuId ? "dlsuId-error" : undefined
                  }
                />
                {errors.dlsuId && touched.dlsuId && (
                  <p id="dlsuId-error" className="input-error-text">
                    {errors.dlsuId}
                  </p>
                )}
              </div>

              <div className="input-form-group">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className={`styled-input ${errors.confirmPassword && touched.confirmPassword ? "input-error" : ""}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Re-enter your password"
                  aria-invalid={Boolean(
                    errors.confirmPassword && touched.confirmPassword,
                  )}
                  aria-describedby={
                    errors.confirmPassword && touched.confirmPassword
                      ? "confirmPassword-error"
                      : undefined
                  }
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <p id="confirmPassword-error" className="input-error-text">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="action-section">
            <button
              type="submit"
              className="primary-btn wide"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
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
