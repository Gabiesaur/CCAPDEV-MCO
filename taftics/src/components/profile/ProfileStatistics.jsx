import { useState } from "react";
import { Share2, Edit2, Loader2 } from "lucide-react";

export default function ProfileStatistics({ user, isOwnProfile, setUser, onShareSuccess }) {
  // Bio Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [bioInput, setBioInput] = useState(user?.bio || "");
  const [isSaving, setIsSaving] = useState(false); // New state for loading UI

  const handleSaveBio = async () => {
    // Prevent saving if there's no user ID
    if (!user?._id) return;

    setIsSaving(true);

    try {
      // 1. Send the updated bio to the backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user._id}/bio`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bio: bioInput }),
      });

      const data = await response.json();

      if (data.success) {
        // 2. Update React State and LocalStorage ONLY if backend succeeds
        if (setUser) {
          const updatedUser = { ...user, bio: bioInput };
          setUser(updatedUser);
          localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        }
        setIsEditing(false);
      } else {
        alert(data.message || "Failed to save bio.");
      }
    } catch (error) {
      console.error("Error saving bio:", error);
      alert("Network error. Please make sure the server is running.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setBioInput(user?.bio || "");
    setIsEditing(false);
  };

  const handleShare = () => {
    const profileLink = `${window.location.origin}/profile/${user?.username}`;
    navigator.clipboard.writeText(profileLink).then(() => {
      if (onShareSuccess) onShareSuccess();
    });
  };

  return (
    <>
      <div className="custom-card p-4 sidebar-sticky">
        {/* Header */}
        <div className="d-flex align-items-center gap-2 mb-3">
          <h5 className="fw-bold text-dlsu-dark mb-0">{user?.name}</h5>
          <span
            className="badge bg-dlsu-dark rounded-pill"
            style={{ fontSize: "0.75rem" }}
          >
            ID {user?.idSeries}
          </span>
        </div>

        {/* Bio Section */}
        <div className="mb-4">
          {isOwnProfile ? (
            <>
              {isEditing ? (
                <div className="position-relative">
                  <textarea
                    className="form-control text-sm mb-2"
                    rows="3"
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    placeholder="Write a short bio..."
                    autoFocus
                    disabled={isSaving}
                  />
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-sm btn-light border"
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-sm btn-success d-flex align-items-center gap-1"
                      onClick={handleSaveBio}
                      disabled={isSaving}
                    >
                      {isSaving ? <Loader2 size={14} className="spin" /> : null}
                      {isSaving ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="position-relative group">
                  <p className="small text-muted mb-1 fst-italic">
                    {user?.bio ? `"${user.bio}"` : "No bio yet. Add one!"}
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
            </>
          ) : (
            // Public profile bio
            user?.bio && <p className="small text-muted mb-0 fst-italic">"{user.bio}"</p>
          )}
        </div>

        {/* Share Button - For Both */}
        <button
          className="btn btn-dark w-100 mb-4 d-flex align-items-center justify-content-center gap-2"
          onClick={handleShare}
        >
          <Share2 size={16} /> Share Profile
        </button>

        {/* Stats Grid */}
        <div className="row text-center g-2 mb-3">
          <div className="col-6">
            <h5 className="fw-bold mb-0">{user?.helpfulCount || 0}</h5>
            <small className="text-muted" style={{ fontSize: "0.75rem" }}>
              Helpful
            </small>
          </div>
          <div className="col-6">
            <h5 className="fw-bold mb-0">{user?.contributions || 0}</h5>
            <small className="text-muted" style={{ fontSize: "0.75rem" }}>
              Contributions
            </small>
          </div>
        </div>
      </div>
    </>
  );
}