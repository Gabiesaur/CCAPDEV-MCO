import { Share2 } from "lucide-react";

export default function MyProfileStatistics({ user, onShareSuccess }) {
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
