import { useEffect, useState } from "react";
import { UserPen, Loader2, X } from "lucide-react";

export default function ProfileEditModal({
  isOpen,
  onClose,
  user,
  onUpdateSuccess,
}) {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setFormData({
      username: user?.username || "",
      name: user?.name || "",
      password: "",
      confirmPassword: "",
    });
    setError("");
    setLoading(false);
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const trimmedUsername = formData.username.trim();
    const trimmedName = formData.name.trim();

    if (!trimmedUsername || !trimmedName) {
      setError("Username and name are required.");
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const payload = {
      username: trimmedUsername,
      name: trimmedName,
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${user._id || user.id}/profile`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Failed to update profile.");
        return;
      }

      onUpdateSuccess(data.user);
      onClose();
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="glass-backdrop fade show" onClick={handleClose} />

      <div className="modal d-block" style={{ zIndex: 1060 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden bg-white">
            <div className="modal-header bg-dlsu-dark text-white border-0 py-3">
              <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                <UserPen size={18} />
                Edit Profile Information
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={handleClose}
                disabled={loading}
              />
            </div>

            <div className="modal-body p-4">
              {error && (
                <div className="alert alert-danger py-2 px-3 mb-3 d-flex align-items-center gap-2">
                  <X size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-semibold">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Leave blank to keep current password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="form-label fw-semibold">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Re-enter new password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="modal-footer border-0 p-3 pt-0">
              <button
                className="btn btn-light fw-bold px-4 rounded-pill"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn btn-dlsu-dark rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? <Loader2 size={16} className="spin" /> : null}
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
