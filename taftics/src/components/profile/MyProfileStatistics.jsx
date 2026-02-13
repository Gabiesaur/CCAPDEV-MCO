import { useState } from "react"; // Added useState
import { Share2, Edit2 } from "lucide-react"; // Added Edit2

export default function MyProfileStatistics({ user, setUser, onShareSuccess }) {
  const [isEditing, setIsEditing] = useState(false);
  const [bioInput, setBioInput] = useState(user.bio || "");

  const handleSaveBio = () => {
    // Update parent state (simulating DB update)
    const updatedUser = { ...user, bio: bioInput };
    setUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser)); // Persist to local storage
    setIsEditing(false);
  };

  const handleCancel = () => {
    setBioInput(user.bio || "");
    setIsEditing(false);
  };

  const handleShare = () => {
    const profileLink = `${window.location.origin}/profile/${user.username}`;
    navigator.clipboard.writeText(profileLink).then(() => {
      onShareSuccess();
    });
  };

  return (
    <div className="custom-card p-4 sidebar-sticky">
      {/* Header */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <h5 className="fw-bold text-dlsu-dark mb-0">{user.name}</h5>
        <span
          className="badge bg-dlsu-dark rounded-pill"
          style={{ fontSize: "0.75rem" }}
        >
          ID {user.idSeries}
        </span>
      </div>

      {/* Bio Section */}
      <div className="mb-4">
        <label className="fw-bold mb-1" style={{ fontSize: "0.85rem" }}>
          Bio
        </label>
        {isEditing ? (
          <div className="d-flex flex-column gap-2">
            <textarea
              className="form-control form-control-sm"
              rows="3"
              value={bioInput}
              onChange={(e) => setBioInput(e.target.value)}
              placeholder="Tell us about yourself..."
            />
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-dlsu-dark flex-grow-1"
                onClick={handleSaveBio}
              >
                Save
              </button>
              <button
                className="btn btn-sm btn-light border flex-grow-1"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="position-relative group">
            <p className="small text-muted mb-1 fst-italic">
              {user.bio || "No bio yet."}
            </p>
            <button
              className="btn btn-link p-0 text-decoration-none"
              style={{ fontSize: "0.75rem" }}
              onClick={() => setIsEditing(true)}
            >
              <Edit2 size={12} className="me-1" /> Edit Bio
            </button>
          </div>
        )}
      </div>

      {/* Share Button - Updated with handleShare */}
      <button
        className="btn btn-dark w-100 mb-4 d-flex align-items-center justify-content-center gap-2"
        onClick={handleShare}
      >
        <Share2 size={16} /> Share Profile
      </button>

      {/* Stats Grid */}
      <div className="row text-center g-2 mb-3">
        <div className="col-4">
          <h5 className="fw-bold mb-0">{user.followers}</h5>
          <small className="text-muted" style={{ fontSize: "0.75rem" }}>
            Followers
          </small>
        </div>
        <div className="col-4">
          <h5 className="fw-bold mb-0">{user.helpfulCount}</h5>
          <small className="text-muted" style={{ fontSize: "0.75rem" }}>
            Helpful
          </small>
        </div>
        <div className="col-4">
          <h5 className="fw-bold mb-0">{user.contributions}</h5>
          <small className="text-muted" style={{ fontSize: "0.75rem" }}>
            Contributions
          </small>
        </div>
      </div>
    </div>
  );
}
